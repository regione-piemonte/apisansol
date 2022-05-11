<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LmsCmsController
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
        if (USE_PROXY || IS_PRODUCTION_NIV) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(CMS_SCHEME);
        $uri = $uri->withHost(CMS_HOST);
        $uri = $uri->withPort(CMS_PORT);
        $path = str_replace('URL', '', $uri->getPath());
        $uri = $uri->withPath($path);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


}