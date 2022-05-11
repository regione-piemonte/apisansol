<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ResponseEnvMiddleware
{

    public function __construct() {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
    {

        // Before

        // Next Middleware || Request Handler
        $response = $next($request, $response);

        // After
        $response = $response->withHeader('X-Bff-Env', ENVIRONMENT);
        return $response;
    }

}