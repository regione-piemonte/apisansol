<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class HeadersNormalizeMiddleware
{


    public function __construct()
    {
    }

    private function withHeadersNormalized(ServerRequestInterface $req)
    {
        $req = clone $req;
        $headers = $req->getHeaders();

        foreach ($headers as $name => $value) {
            $req = $req->withoutHeader($name);
            $name = preg_replace('/^HTTP_/', '', $name);
            $name = preg_replace('/_/', '-', $name);
            $name = ucwords(strtolower($name), '-');
            $req = $req->withHeader($name, $value);
        }

        return $req;
    }

    public function __invoke(ServerRequestInterface $req, ResponseInterface $res, callable $next)
    {
        // Before
        $req = $this->withHeadersNormalized($req);

        // Next Middleware || Request Handler
        $res = $next($req, $res);

        return $res;
    }
}