<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Csi\Auth;
use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class NotifyPreferencesController
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
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(NOTIFY_MESSAGE_STORE_SCHEME);
        $uri = $uri->withHost(NOTIFY_MESSAGE_STORE_HOST);
        $uri = $uri->withPort(NOTIFY_MESSAGE_STORE_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);
        $request = $request->withHeader(NOTIFY_HEADER_NAME_AUTH, NOTIFY_AUTH_JWT);

        if (Auth::isShibbolethSessionEnabled()) {
            $user = Auth::getShibbolethIdentity();
            $request = $request->withHeader(NOTIFY_HEADER_NAME_CF, $user['cf']);
        }

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

}