<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanTrovaUnController
{

    /**
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function proxy($req, $res, $args)
    {
        $http = new Http();
        $http->setAuth(APISANTROVAUN_USER, APISANTROVAUN_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANTROVAUN_SCHEME);
        $uri = $uri->withHost(APISANTROVAUN_HOST);
        $uri = $uri->withPort(APISANTROVAUN_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

    public function tipologieOspedale(ServerRequestInterface $req, ResponseInterface$res, array$args)
    {
        // Se ci stanno chiedendo dei mocks
        // E se vogliamo effettivamente mockare questa richiesta
        // => facciamo il forward verso i mocks
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(URL_JSON_TIPOLOGIE_OSPEDALE);
        if ($json === false) {
            $error = [
                'status' => 500,
                'code' => '01',
                'title' => 'JSON lista tipologie ospedale non trovato',
                'detail' => [],
                'links' => [],
            ];

            $res = $res->withJson($error, 500);
            return $res;
        }

        $json = @json_decode($json, true);
        if ($json === null) {
            $error = [
                'status' => 500,
                'code' => '01',
                'title' => 'Errore di sintassi nel JSON',
                'detail' => [],
                'links' => []
            ];

            $res = $res->withJson($error, 500);
            return $res;
        }

        return $res->withJson($json);
    }


    public function tipologieAssistenza(ServerRequestInterface $req, ResponseInterface$res, array$args)
    {
        // Se ci stanno chiedendo dei mocks
        // E se vogliamo effettivamente mockare questa richiesta
        // => facciamo il forward verso i mocks
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(URL_JSON_TIPOLOGIE_ASSISTENZA);
        if ($json === false) {
            $error = [
                'status' => 500,
                'code' => '01',
                'title' => 'JSON lista tipologie assistenza non trovato',
                'detail' => [],
                'links' => [],
            ];

            $res = $res->withJson($error, 500);
            return $res;
        }

        $json = @json_decode($json, true);
        if ($json === null) {
            $error = [
                'status' => 500,
                'code' => '01',
                'title' => 'Errore di sintassi nel JSON',
                'detail' => [],
                'links' => []
            ];

            $res = $res->withJson($error, 500);
            return $res;
        }

        return $res->withJson($json);
    }

    public function tipologiePuntiVendita(ServerRequestInterface $req, ResponseInterface$res, array$args)
    {
        // Se ci stanno chiedendo dei mocks
        // E se vogliamo effettivamente mockare questa richiesta
        // => facciamo il forward verso i mocks
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(URL_JSON_TIPOLOGIE_PUNTI_VENDITA);
        if ($json === false) {
            $error = [
                'status' => 500,
                'code' => '01',
                'title' => 'JSON lista tipologie punti vendita non trovato',
                'detail' => [],
                'links' => [],
            ];

            $res = $res->withJson($error, 500);
            return $res;
        }

        $json = @json_decode($json, true);
        if ($json === null) {
            $error = [
                'status' => 500,
                'code' => '01',
                'title' => 'Errore di sintassi nel JSON',
                'detail' => [],
                'links' => []
            ];

            $res = $res->withJson($error, 500);
            return $res;
        }

        return $res->withJson($json);
    }
}