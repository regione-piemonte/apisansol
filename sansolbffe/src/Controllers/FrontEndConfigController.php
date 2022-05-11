<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Models\FrontEndConfig;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class FrontEndConfigController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }

    /**
     * Restituisce la lista delle configurazioni create
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     * @throws AssertionFailedException
     */
    public function getFrontEndConfigList($req, $res, $args)
    {
        $configList = FrontEndConfig::all();
        $data = $configList->jsonSerialize();
        return $res->withJson($data);
    }

    /**
     * Restituisce la configurazione con un determinato nome
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     * @throws AssertionFailedException
     */
    public function getFrontEndConfig($req, $res, $args)
    {
        $nome_app = $args['nome_app'];
        $config = FrontEndConfig::where('nome_app', $nome_app)->first();

        if (!$config) {
            return $res->withJson("Non esiste una configurazione per un'app con questo nome", 404);
        }

        $data = $config->jsonSerialize();
        return $res->withJson($data);
    }

    /**
     * Rimuove una configurazione
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     */
    public function deleteFrontEndConfig($req, $res, $args)
    {
        $nome_app = $args['nome_app'];
        $config = FrontEndConfig::where('nome_app', $nome_app)->first();

        if (!$config) {
            return $res->withJson("Non esiste una configurazione per un'app con questo nome", 404);
        }

        $config->delete();
        return $res->withJson(true, 200);
    }


    /**
     * Permette di creare una nuova configurazione
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     * @throws AssertionFailedException
     */
    public function postFrontEndConfig($req, $res, $args)
    {
        $payload = $req->getParsedBody();
        $nome_app = $payload['nome_app'] ?? null;
        $configurazione = $payload['configurazione'] ?? null;

        // Validazione input
        try {
            Assert::lazy()
                ->tryAll()
                ->that($payload, 'payload')->notEmpty()
                ->that($nome_app, 'nome_app')->notEmpty()->string()
                ->that($configurazione, 'configurazione')->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        $config = new FrontEndConfig();
        $config->nome_app = $nome_app;
        $config->configurazione = json_encode($configurazione);
        $config->save();

        $data = $config->jsonSerialize();
        return $res->withJson($data, 201);
    }


    /**
     * Permette di aggiornare una configurazione con un determinato nome
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     * @throws AssertionFailedException
     */
    public function putFrontEndConfig($req, $res, $args)
    {
        $payload = $req->getParsedBody();
        $nome_app = $payload['nome_app'] ?? null;
        $configurazione = $payload['configurazione'] ?? null;

        // Validazione input
        try {
            Assert::lazy()
                ->tryAll()
                ->that($payload, 'payload')->notEmpty()
                ->that($nome_app, 'nome_app')->notEmpty()->string()
                ->that($configurazione, 'canale')->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        $config = FrontEndConfig::where('nome_app', $nome_app)->first();

        if (!$config) {
            return $res->withJson("Non esiste una configurazione per un'app con questo nome", 404);
        }

        $config->configurazione = json_encode($configurazione);
        $config->save();

        $data = $config->jsonSerialize();
        return $res->withJson($data);
    }

}