<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Models\Application;
use Csi\Models\Delegable;
use Exception;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LmsDelegableController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }


    public function list(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $list = Delegable::with(['applicazione'])->get();
        $data = $list->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    public function detail(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $id = $args['id'];
        $detail = Delegable::with(['applicazione'])->find($id);

        if ($detail == null) {
            return $res->withStatus(404);
        }

        $data = $detail->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }

    /**
     * Permette di creare un nuovo delegabile
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
            $delegationCode = $payload['codice'];
            $existingDelegable = Delegable::where('codice', $delegationCode)->first();
            if ($existingDelegable) {
                return $res->withStatus(400, "Il codice deve essere univoco");
            }

            $delegable = new Delegable();
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
            $delegable->applicazione_id = $payload['applicazione_id'];

            $delegable->save();
            $delegable = $delegable->fresh();
        } catch (Exception $e) {
            throw $e;
            // return $res->withStatus(500)->withJson($e->getMessage());
        }

        $data = $delegable->jsonSerialize();
        return $res->withStatus(201)->withJson($data);
    }

    /**
     * Permette di modificare i dati di un delegabile
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     * @throws AssertionFailedException
     */
    public function edit($req, $res, $args)
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
            $delegable = Delegable::where('id', $id)->first();
            if ($delegable == null) {
                return $res->withStatus(404)->withJson("Id delegabile errato");
            }

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
            $delegable->applicazione_id = $payload['applicazione_id'];

            $delegable->save();
            $delegable = $delegable->fresh();
        } catch (Exception $e) {
            throw $e;
            // return $res->withStatus(500)->withJson($e->getMessage());
        }

        $data = $delegable->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    /**
     * Permette di cancellare un delegabile
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     * @throws AssertionFailedException
     */
    public function delete($req, $res, $args)
    {
        $id = $args['id'];

        $delegable = Delegable::where('id', $id)->first();
        if ($delegable == null) {
            return $res->withStatus(404)->withJson("Id delegabile errato");
        }

        $delegable->delete();
        return $res->withStatus(200);

    }
}