<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Models\Application;
use Csi\Models\ApplicationCategory;
use Csi\Models\ApplicationGroup;
use Csi\Models\ApplicationMenu;
use Csi\Models\ApplicationStarred;
use Csi\Models\Delegable;
use Csi\Utils\RequestParsers;
use Exception;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LmsApplicationController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }


    public function list(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $orderBy = RequestParsers::getOrderBy($req, 'ordinamento');

        // Se non ci è stato passato nessun ordinamento => ne applichiamo uno di default
        if (count($orderBy) <= 0) {
            $orderBy = [['field' => 'posizione', 'direction' => 'asc']];
        }

        $applicationList = Application::with(['categoria', 'gruppo', 'delegabili', 'menu']);
        foreach ($orderBy as $tuple) {
            $applicationList = $applicationList->orderBy($tuple['field'], $tuple['direction']);
        }
        $applicationList = $applicationList->get();

        $data = $applicationList->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    public function detail(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $id = $args['id'];
        $application = Application::with(['categoria', 'gruppo', 'delegabili', 'menu'])->find($id);

        if ($application == null) {
            return $res->withStatus(404);
        }

        $data = $application->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }

    /**
     * Permette di creare un nuova nuova applicazione
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     * @throws AssertionFailedException
     */

    public function create($req, $res, $args)
    {
        $payload = $req->getParsedBody();

        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($payload)->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        try {
            $appCode = $payload['codice'];
            $existingApplication = Application::where('codice', $appCode)->first();
            if ($existingApplication) {
                return $res->withStatus(400, "Il codice deve essere univoco");
            }

            $application = new Application();
            $application->codice = $payload['codice'];
            $application->descrizione = $payload['descrizione'];
            $application->descrizione_estesa = $payload['descrizione_estesa'];
            $application->posizione = $payload['posizione'];
            $application->url = $payload['url'];
            $application->icona_url = $payload['icona_url'];
            $application->vecchio = $payload['vecchio'];
            $application->pubblico = $payload['pubblico'];
            $application->visibile_home_mobile = $payload['visibile_home_mobile'];
            $application->visibile_home_desktop = $payload['visibile_home_desktop'];
            $application->visibile_menu_mobile = $payload['visibile_menu_mobile'];
            $application->visibile_menu_desktop = $payload['visibile_menu_desktop'];
//            $application->in_pubblicazione =  $payload['in_pubblicazione'];
//            $application->data_pubblicazione_prevista =  $payload['data_pubblicazione_prevista'];
            $application->deleghe_codice = $payload['deleghe_codice'];
            $application->deleghe_supportate = $payload['deleghe_supportate'];
//            $application->deleghe_numero_giorni=  $payload['deleghe_numero_giorni'];
            $application->fse_consigliato = $payload['fse_consigliato'];
            $application->fse_obbligatorio = $payload['fse_obbligatorio'];
            $application->notifiche_supportate = $payload['notifiche_supportate'];
            $application->notifiche_codice = $payload['notifiche_codice'];
            $application->portale_codice = $payload['portale_codice'];
            $application->albero_aiuti_visibile = $payload['albero_aiuti_visibile'];
            $application->numero_accessi = $payload['numero_accessi'];
            $application->gruppo_id = $payload['gruppo_id'];
            $application->categoria_id = $payload['categoria_id'];
            $application->assistenza_codice = $payload['assistenza_codice'];
            $application->soddisfazione_cliente_visibile = $payload['soddisfazione_cliente_visibile'];
            $application->soddisfazione_cliente_url = $payload['soddisfazione_cliente_url'];
//            $application->manutenzione_data_inizio = $payload['manutenzione_data_inizio'];
//            $application->manutenzione_data_fine = $payload['manutenzione_data_fine'];
            $delegables_list = $payload['delegabili'];

            if($payload['manutenzione_data_inizio']){
                $application->manutenzione_data_inizio = \Carbon\Carbon::parse($payload['manutenzione_data_inizio']);
            }

            if($payload['manutenzione_data_fine']){
                $application->manutenzione_data_fine = \Carbon\Carbon::parse($payload['manutenzione_data_fine']);
            }

            $application->save();
            $application = $application->fresh();
            foreach ($delegables_list as $delegation) {
                if($delegation["attiva"]===true){
                    $delegation["applicazione_id"]=$application->id;
                    $delegation_code = $delegation["codice"];

                    $existingDelegable = Delegable::where('codice', $delegation_code)->first();
                    $newDelegable=null;
                    if($existingDelegable){
                        $newDelegable= $this->editDelegable($existingDelegable, $delegation, $application->id);
                    }
                    else{
                        $newDelegable = $this->createDelegable($delegation, $application->id);
                    }
                    $newDelegable->save();
                    $newDelegable = $newDelegable->fresh();
                }
            }
            $application->save();
            $application = $application->fresh();

        } catch (Exception $e) {
            throw $e;
            // return $res->withStatus(500)->withJson($e->getMessage());
        }

        $data = $application->jsonSerialize();
        return $res->withStatus(201)->withJson($data);
    }

    /**
     * Permette di modificare i dati di un'applicazione
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     * @throws AssertionFailedException
     */
    public function editList($req, $res, $args)
    {
        $id = $args['id'];
        $payload = $req->getParsedBody();

        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($payload)->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        try {
            $application = Application::where('id', $id)->first();
            if ($application == null) {
                return $res->withStatus(404)->withJson("Id applicazione errato");
            }

            $application->codice = $payload['codice'];
            $application->descrizione = $payload['descrizione'];
            $application->descrizione_estesa = $payload['descrizione_estesa'];
            $application->posizione = $payload['posizione'];
            $application->portale_codice = $payload['portale_codice'];
            $application->url = $payload['url'];
            $application->icona_url = $payload['icona_url'];
            $application->vecchio = $payload['vecchio'];
            $application->pubblico = $payload['pubblico'];
            $application->visibile_home_mobile = $payload['visibile_home_mobile'];
            $application->visibile_home_desktop = $payload['visibile_home_desktop'];
            $application->visibile_menu_mobile = $payload['visibile_menu_mobile'];
            $application->visibile_menu_desktop = $payload['visibile_menu_desktop'];
            $application->deleghe_codice = $payload['deleghe_codice'];
            $application->deleghe_supportate = $payload['deleghe_supportate'];
            $application->fse_consigliato = $payload['fse_consigliato'];
            $application->fse_obbligatorio = $payload['fse_obbligatorio'];
            $application->notifiche_supportate = $payload['notifiche_supportate'];
            $application->notifiche_codice = $payload['notifiche_codice'];
            $application->albero_aiuti_visibile = $payload['albero_aiuti_visibile'];
            $application->numero_accessi = $payload['numero_accessi'];
            $application->gruppo_id = $payload['gruppo_id'];
            $application->categoria_id = $payload['categoria_id'];
            $application->assistenza_codice = $payload['assistenza_codice'];
            $application->soddisfazione_cliente_visibile = $payload['soddisfazione_cliente_visibile'];
            $application->soddisfazione_cliente_url = $payload['soddisfazione_cliente_url'];
            // $application->manutenzione_data_inizio = $payload['manutenzione_data_inizio'];
            // $application->manutenzione_data_fine = $payload['manutenzione_data_fine'];

            if($payload['manutenzione_data_inizio']){
                $application->manutenzione_data_inizio = \Carbon\Carbon::parse($payload['manutenzione_data_inizio']);
            }else{
                $application->manutenzione_data_inizio = null;
            }

            if($payload['manutenzione_data_fine']){
                $application->manutenzione_data_fine = \Carbon\Carbon::parse($payload['manutenzione_data_fine']);
            }else{
                $application->manutenzione_data_fine = null;
            }

            $delegables_list = $payload['delegabili'];

            if (!$application->deleghe_supportate) {
                foreach ($application->delegabili as $delegation) {
                    $delegable = Delegable::where('codice', $delegation->codice)->first();
                    if ($delegable !== null) {
                        $delegable->forceDelete();
                    }
                }
                $application->deleghe_codice = "";
            }else{
                foreach ($delegables_list as $delegation) {
                    if($delegation['attiva']===true){
                        $newDelegable=null;
                        $existingDelegable = Delegable::where('codice', $delegation["codice"])->first() ;
                        if ($existingDelegable == null) {
                            $newDelegable = $this->createDelegable($delegation, $id);
                        }else{
                            $newDelegable = $this->editDelegable($existingDelegable, $delegation, $id);
                        }
                        $newDelegable->save();
                        $newDelegable = $newDelegable->fresh();
                    }else{
                        $existingDelegable = Delegable::where('codice',  $delegation["codice"])->first();
                        $existingDelegable->forceDelete();
                    }

                }
            }

            $application->save();
            $application = $application->fresh();


        } catch (Exception $e) {
            throw $e;
            // return $res->withStatus(500)->withJson($e->getMessage());
        }

        $data = $application->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    function editDelegable($delegable, $payload, $id){
        $delegable->codice = $payload['codice'];
        $delegable->deleghe_codice = $payload['deleghe_codice'];
        $delegable->numero_giorni = $payload['numero_giorni'];
        $delegable->gruppo_fse = $payload['gruppo_fse'];
        $delegable->delega_forte = $payload['delega_forte'];
        $delegable->delega_debole = $payload['delega_debole'];
        $delegable->delega_forte_descrizione = $payload['delega_forte_descrizione'];
        $delegable->delega_debole_descrizione = $payload['delega_debole_descrizione'];
        $delegable->posizione = $payload['posizione'];
        $delegable->delega_info_descrizione = $payload['delega_info_descrizione'];
        $delegable->applicazione_id =$id;

        return $delegable;
    }
    function createDelegable($payload, $id){

        $newDelegable = new Delegable();
        $newDelegable->codice = $payload['codice'];
        $newDelegable->deleghe_codice = $payload['deleghe_codice'];
        $newDelegable->numero_giorni = $payload['numero_giorni'];
        $newDelegable->gruppo_fse = $payload['gruppo_fse'];
        $newDelegable->delega_forte = $payload['delega_forte'];
        $newDelegable->delega_debole = $payload['delega_debole'];
        $newDelegable->delega_forte_descrizione = $payload['delega_forte_descrizione'];
        $newDelegable->delega_debole_descrizione = $payload['delega_debole_descrizione'];
        $newDelegable->posizione = $payload['posizione'];
        $newDelegable->delega_info_descrizione = $payload['delega_info_descrizione'];
        $newDelegable->applicazione_id = $id;
        return $newDelegable;

    }
    /**
     * Permette di cancellare un'applicazione
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     */
    public function delete($req, $res, $args)
    {
        $id = $args['id'];

        $application = Application::where('id', $id)->first();

        if ($application == null) {
            return $res->withStatus(404);
        }

        $application->delete();
        return $res->withStatus(200);
    }

    /**
     * Permette di registrare un'applicazione come preferita da parte di un utente
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     * @throws AssertionFailedException
     */
    public function starredCreate($req, $res, $args)
    {
        $taxCode = $args['cf'];
        $payload = $req->getParsedBody();
        $applicazione_id = $payload['applicazione_id'] ?? null;

        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($taxCode, 'codice')->string()->betweenLength(10, 16)
                ->that($payload)->notEmpty()
                ->that($applicazione_id, 'codice')->integer()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        try {
            $application = Application::where('id', $applicazione_id)->first();
            if ($application == null) {
                return $res->withStatus(400, "Id applicazione errato");
            }

            $applicationStarred = new ApplicationStarred();
            $applicationStarred->applicazione_id = $applicazione_id;
            $applicationStarred->codice_fiscale = $taxCode;
            $applicationStarred->save();
            $applicationStarred = $applicationStarred->fresh();
        } catch (Exception $e) {
            throw $e;
            // return $res->withStatus(500)->withJson($e->getMessage());
        }

        $data = $applicationStarred->jsonSerialize();
        return $res->withStatus(201)->withJson($data);
    }


    /**
     * Restituisce l'elenco delle applicazioni segnate come preferite dal cittadino
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function starredList($req, $res, $args)
    {
        $taxCode = $args['cf'];
        $applicationStarredList = ApplicationStarred::where('codice_fiscale', $taxCode)->get();

        $data = $applicationStarredList->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }

    /**
     * Permette di segnare un'applicazione come non più preferita
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function starredDelete($req, $res, $args)
    {
        $taxCode = $args['cf'];
        $id = $args['id'];

        // Cancelliamo la riga solo se appartiene all'utente
        $result = ApplicationStarred::where('id', $id)->where('codice_fiscale', $taxCode)->delete();

        if ($result <= 0) {
            return $res->withStatus(404);
        }

        return $res->withStatus(200);
    }


    /**
     * Restituisce l'elenco delle categorie di applicazioni
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function categoryList($req, $res, $args)
    {
        $categoryList = ApplicationCategory::orderBy('descrizione', 'asc')->get();

        $data = $categoryList->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    /**
     * Restituisce l'elenco dei gruppi di applicazioni
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function groupList($req, $res, $args)
    {
        $groupList = ApplicationGroup::orderBy('descrizione', 'asc')->get();

        $data = $groupList->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }
}