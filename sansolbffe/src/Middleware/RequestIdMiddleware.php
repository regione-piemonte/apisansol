<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Ramsey\Uuid\Uuid;

class RequestIdMiddleware
{

    public function __construct() {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
    {
        // Before
        $method = $request->getMethod();
        $has_request_id = !empty($request->getHeader(HEADER_NAME_REQUEST_ID));

        if($method != 'OPTIONS' && !$has_request_id){
            $uuid = Uuid::uuid4()->toString();
            $request = $request->withHeader(HEADER_NAME_REQUEST_ID, $uuid);
        }

        // Next Middleware || Request Handler
        $response = $next($request, $response);

        // After
        return $response;
    }

}