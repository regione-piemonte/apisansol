<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanRicController
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
        $http->setAuth(APISANRIC_USER, APISANRIC_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANRIC_SCHEME);
        $uri = $uri->withHost(APISANRIC_HOST);
        $uri = $uri->withPort(APISANRIC_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function stati_ricette(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        // Se ci stanno chiedendo dei mocks
        // E se vogliamo effettivamente mockare questa richiesta
        // => facciamo il forward verso i mocks
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(STATI_RICETTE);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getStatiRicette",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getStatiRicette"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }

    public function tipologie_ricette(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        // Se ci stanno chiedendo dei mocks
        // E se vogliamo effettivamente mockare questa richiesta
        // => facciamo il forward verso i mocks
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(TIPOLOGIE_RICETTE);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "02", "title": "Errore getTipologieRicette",
            "detail": {
                "chiave": "02",
                "valore": "generico errore getTipologieRicette"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }

}