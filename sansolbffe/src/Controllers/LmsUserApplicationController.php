<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Models\Application;
use Csi\Models\ApplicationStarred;
use Csi\Models\UserApplication;
use Csi\Models\UserInformation;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LmsUserApplicationController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }

    /**
     * Permette di registrare un questionario soddisfazione cliente come visualizzato da parte di un utente
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     * @throws AssertionFailedException
     */
    public function createOrEdit($req, $res, $args)
    {
        $taxCode = $args['cf'];
        $applicazione_id = $args['app_id'];
        $payload = $req->getParsedBody();

        $is_customer_satisfaction_seen = $payload['soddisfazione_cliente_visualizzato'] ?? false;
        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($taxCode, 'codice')->string()->betweenLength(10, 16)
                ->that($applicazione_id, 'codice')->string()
                ->that($payload)->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        try {
            $application = Application::where('id', $applicazione_id)->first();
            if ($application == null) {
                return $res->withStatus(400, "Id applicazione errato");
            }

            $userApplication= UserApplication::where('applicazione_id', $applicazione_id)->where('codice_fiscale', $taxCode)-> first();
            if ($userApplication == null) {
              $userApplication = new UserApplication();
              $userApplication->applicazione_id = $applicazione_id;
              $userApplication->codice_fiscale = $taxCode;
            }
            $userApplication->soddisfazione_cliente_visualizzato = $is_customer_satisfaction_seen;
            $userApplication->save();
            $userApplication = $userApplication->fresh();
        } catch (Exception $e) {
            throw $e;
            // return $res->withStatus(500)->withJson($e->getMessage());
        }

        $data = $userApplication->jsonSerialize();
        return $res->withStatus(201)->withJson($data);
    }


    /**
     * Restituisce l'elenco delle applicazioni associate al cittadino
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function list($req, $res, $args)
    {
        $taxCode = $args['cf'];
        $userApplicationList = UserApplication::where('codice_fiscale', $taxCode)->get();

        $data = $userApplicationList->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    /**
     * Permette di cancellare un'associazione Utente-applicazione
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function delete($req, $res, $args)
    {
        $taxCode = $args['cf'];
        $id = $args['id'];

        // Cancelliamo la riga solo se appartiene all'utente
        $result = UserApplication::where('id', $id)->where('codice_fiscale', $taxCode)->delete();

        if ($result <= 0) {
            return $res->withStatus(404);
        }

        return $res->withStatus(200);
    }
}