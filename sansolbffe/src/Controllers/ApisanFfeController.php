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

class ApisanFfeController
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
        $http->setAuth(APISANFFE_USER, APISANFFE_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANFFE_SCHEME);
        $uri = $uri->withHost(APISANFFE_HOST);
        $uri = $uri->withPort(APISANFFE_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }
    public function getRefundDocuments(ServerRequestInterface $request, ResponseInterface $response, array $args)
    {
        $request = $request->withoutHeader('HTTP_X_FORWARDED_FOR');

        $payload = $request->getParam('payload');
        $payload = json_decode($payload, true);

        $stream = Utils::string2Stream(json_encode($payload));
        $stream = new \Slim\Http\Stream($stream);
        $request = $request->withBody($stream);
        $request = $request->withParsedBody($payload);
        $request = $request->withHeader('Content-type', 'application/json');

        $response = $this->proxy($request, $response, $args);
        $response = $response->withoutHeader('Content-Length');

        return $response;
    }

}