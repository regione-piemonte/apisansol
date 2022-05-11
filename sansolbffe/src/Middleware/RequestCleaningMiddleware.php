<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RequestCleaningMiddleware
{

    public function __invoke(ServerRequestInterface $req, ResponseInterface $res, callable $next)
    {
        // Before
        // Prima puliamo i query params
        $query = $req->getQueryParams();
        unset($query['XDEBUG_SESSION_START']);
        unset($query['_shcf']);
        unset($query['_shc']);
        unset($query['_shn']);
        $req = $req->withQueryParams($query);

        // Poi puliamo la URI
        $uri = $req->getUri();
        $uri = $uri->withQuery(http_build_query($query));
        $req = $req->withUri($uri);

        // Next Middleware || Request Handler
        $res = $next($req, $res);

        // After
        return $res;
    }

}