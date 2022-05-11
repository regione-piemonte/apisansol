<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanVaccinazioniController
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
        $http->setAuth(APISANVAC_USER, APISANVAC_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANVAC_SCHEME);
        $uri = $uri->withHost(APISANVAC_HOST);
        $uri = $uri->withPort(APISANVAC_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function forbidden(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        // @TODO: temporaneamente permettiamo di eseguire queste funzionalità solo in alpha
        if (IS_TEST || IS_ALPHA) {
            return $this->proxy($req, $res, $args);
        }

        return $res->withStatus(403)->withJson("Al momento non è possibile usufruire di questa funzionalità");
    }


    public function autocontribution(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $payload = $req->getParsedBody();
        $type = $payload['tipologia'] ?? null;

        // BLOCCHIAMO SOLO LE RICHIESTE DI OMISSIONE
        if ($type === 'COMUNICAZIONE') {
            return $this->proxy($req, $res, $args);
        } else {
            return $this->forbidden($req, $res, $args);
        }
    }

}