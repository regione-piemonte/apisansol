<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Auth;
use Csi\Models\OtpOrm;
use Csi\SendMessage;
use DateTime;
use Exception;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class OtpController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }

    /**
     * Genera una OTP (One Time Password) associata ad un utente ed un canale di notifica,
     * la salva sul DB e la restituisce come risultato della richiesta
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     * @throws Exception
     * @throws AssertionFailedException
     */
    public function generate($req, $res, $args)
    {
        $payload = $req->getParsedBody();
        $cf = $payload['cf'] ?? null;
        $canale = $payload['canale'] ?? null;
        $contatto = $payload['contatto'] ?? null;
        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($payload)->notEmpty()
                ->that($cf, 'cf')->string()->betweenLength(10, 16)
                ->that($canale, 'canale')->notEmpty()->string()
                ->that($contatto, 'contatto')->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        $count = OtpOrm::MAX_DAILY_ATTEMPTS;

        // Abbiamo il vincolo di poter inviare massimo 3 SMS al giorno ad ogni cittadino
        // In caso di SMS controlliamo che questo limite non venga superto
        if ($canale == OtpOrm::SMS) {
            $now = new DateTime();

            $count = OtpOrm::where('cf', $cf)
                ->where('canale', $canale)
                ->whereDate('data_scadenza', '>=', $now)
                ->count();

            if ($count >= OtpOrm::MAX_DAILY_ATTEMPTS) {
                return $res->withStatus(403)->withJson('Daily SMS limit reached');
            }
        }

        // Cancelliamo gli OTP considerati vecchi
        if (IS_DEVELOPMENT || IS_TEST) {
            OtpOrm::obsolete()->delete();
        }

        // Creiamo il nuovo OTP e lo salviamo sul DB
        $otp = new OtpOrm();
        $otp->cf = $cf;
        $otp->canale = $canale;
        $otp->codice = OtpOrm::getRandomCode();
        $otp->data_scadenza = OtpOrm::getEndDate();
        $otp->save();

        // Inviamo la mail o l'SMS
        $send = new SendMessage();

        switch ($otp->canale) {
            case OtpOrm::EMAIL:
                // @WARNING: stiamo assumendo che l'utente sia loggato
                //        e che la chiamata effettuata sia protetta da shibboleth

                if (Auth::isShibbolethSessionEnabled()) {
                    $identity = Auth::getShibbolethIdentity();
                    $body = <<<EOT
        <p>
        Ciao {$identity['nome']},<br/>
        il  codice per confermare l'indirizzo email è: 
        </p>
        
        <div class="alert alert-primary">
        {$otp->codice}
        </div>
        
        <p>
        Per motivi di sicurezza il codice potrà essere utilizzato entro 30 minuti, trascorsi i quali sarà necessario effettuare una nuova procedura di inserimento email.
        </p>
EOT;
                } else {
                    $body = <<<EOT
        <p>
        Ciao,<br/>
        il  codice per confermare l'indirizzo email è: 
        </p>
        
        <div class="alert alert-primary">
        {$otp->codice}
        </div>
        
        <p>
        Per motivi di sicurezza il codice potrà essere utilizzato entro 30 minuti, trascorsi i quali sarà necessario effettuare una nuova procedura di inserimento email.
        </p>
EOT;
                }


                $send->email($otp->cf, $contatto, 'Verifica email', $body);
                break;
            case OtpOrm::SMS:
                $send->sms($otp->cf, $contatto, 'Codice di verifica: ' . $otp->codice);
                break;
        }


        // Infine restituiamo l'OTP appena creato
        $data = $otp->jsonSerialize();

        if ($canale == OtpOrm::SMS) {
            // -1 perchè è appena stato creato un OTP per SMS
            $result['attempts_left'] = OtpOrm::MAX_DAILY_ATTEMPTS - $count - 1;
        }

        return $res->withJson($data, 201);
    }


    /**
     * Permette di verificare un codice OTP.
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     * @throws Exception
     * @throws AssertionFailedException
     */
    public function verify($req, $res, $args)
    {
        $cf = $req->getQueryParam('cf', null);
        $canale = $req->getQueryParam('canale', null);
        $codice = $req->getQueryParam('codice', null);

        // Validazione input
        try {
            Assert::lazy()
                ->tryAll()
                ->that($cf, 'cf')->string()->betweenLength(10, 16)
                ->that($canale, 'canale')->notEmpty()->string()
                ->that($codice, 'codice')->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }


        $now = new DateTime();
        $otp = OtpOrm::where('cf', $cf)
            ->where('canale', $canale)
            ->where('codice', $codice)
            ->whereDate('data_scadenza', '>=', $now)
            ->orderBy('data_creazione', 'desc')
            ->first();


        if (!$otp) {
            return $res->withJson(null);
        }

        $data = $otp->jsonSerialize();
        return $res->withJson($data);
    }


    /**
     * Permette di ottenere il numero di sms che l'utente può ancora inviare in giornata
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     * @throws Exception
     * @throws AssertionFailedException
     */
    public function attemptsLeft($req, $res, $args)
    {
        $cf = $req->getQueryParam('cf', null);

        // Validazione input
        try {
            Assert::lazy()
                ->tryAll()
                ->that($cf, 'cf')->string()->betweenLength(10, 16)
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        $now = new DateTime();
        $count = OtpOrm::where('cf', $cf)
            ->where('canale', OtpOrm::SMS)
            ->whereDate('data_scadenza', '>=', $now)
            ->count();

        $data = [
            'attempts_left' => OtpOrm::MAX_DAILY_ATTEMPTS - $count
        ];

        return $res->withJson($data);
    }

}