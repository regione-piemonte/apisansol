<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanRedController
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
        $http->setAuth(APISANESENRED_USER, APISANESENRED_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANESENRED_SCHEME);
        $uri = $uri->withHost(APISANESENRED_HOST);
        $uri = $uri->withPort(APISANESENRED_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function exemptionPdf(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $uri = $req->getUri();
        $path = $uri->getPath();
        $new_path = rtrim($path, '/pdf');
        $new_uri = $uri->withPath($new_path);

        $request_target = $req->getRequestTarget();
        $new_request_target = str_replace('/pdf', '', $request_target);

        // @NOTE: Dobbiamo sovrascrivere REQUEST_URI solo perche ProxyApi lo usa internamente per forwardare la richiesta
        $_SERVER['REQUEST_URI'] = $new_request_target;

        $req = $req
            ->withUri($new_uri)
            ->withRequestTarget($new_request_target)
            ->withHeader('Accept', 'application/pdf');

        return $this->proxy($req, $res, $args);
    }

}