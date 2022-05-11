<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Csi\Utils\Utils;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanScerevController
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
        $http->setAuth(APISANSCEREV_USER, APISANSCEREV_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANSCEREV_SCHEME);
        $uri = $uri->withHost(APISANSCEREV_HOST);
        $uri = $uri->withPort(APISANSCEREV_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function disclaimer(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $json = @file_get_contents(DISCLAIMER_SCEREV);

        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getDisclaimer",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getDisclaimer"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }


    public function proxyNoMocks(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $req = $req->withAttribute('mockable', false);
        return $this->proxy($req, $res, $args);
    }

    public function getDelegatorPdf(ServerRequestInterface $request, ResponseInterface $response, array $args)
    {
        $request = $request->withoutHeader('HTTP_X_FORWARDED_FOR');

        $payload = $request->getParam('payload');
        $payload = json_decode($payload, true);

        $stream = Utils::string2Stream(json_encode($payload));
        $stream = new \Slim\Http\Stream($stream);
        $request = $request->withBody($stream);
        $request = $request->withParsedBody($payload);
        $request = $request->withHeader('Content-type', 'application/json');

        $response =  $this->proxy($request, $response, $args);
        $response = $response->withoutHeader('Content-Length');

        return $response;
//        $proxy = new SlimProxyApi(APISANSCEREV_URL);
//        $proxy->integrateRequest($request);
//        $proxy->setAuth(APISANSCEREV_USER, APISANSCEREV_PASS);
//        $proxy->setServiceCode();
//        $proxy->setJson($payload);
//
//        // Attualmente la macchina che hosta questo servizio non è visibile dalla nostra macchina di produzione
//        if (USE_PROXY) {
//            $proxy->setProxy(PROXY);
//        }
//
//        $forwardedServer = isset($_SERVER['HTTP_X_FORWARDED_SERVER']) ?: null;
//        if ($forwardedServer != null) {
//            $proxy->setReferer('https://' . $forwardedServer . '/rol/');
//        }
//
//
//        $res = $proxy->call();
//        $response = $proxy->finalizeResponse($res, $response);
//        return $response;

    }
}