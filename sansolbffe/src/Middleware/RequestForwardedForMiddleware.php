<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RequestForwardedForMiddleware
{


    public function __construct()
    {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
    {
        // Before
        $myIp = isset($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : '127.0.0.1';
        $xForwardedFor = [];

        // Dal momento che siamo il primo strato ad essere contattato dal client, non abbiamo bisogno di
        // ottenere la catena di IP coinvolti nella richiesta per appenderci il nostro IP.
        // Ci basta semplicemente dire qual è l'IP del client e qual è l'IP del BFF
        if ($request->hasHeader(HEADER_NAME_FORWARDED_FOR)) {
            $xForwardedFor = $request->getHeader(HEADER_NAME_FORWARDED_FOR);
        }

        array_push($xForwardedFor, $myIp);
        $request = $request->withHeader(HEADER_NAME_FORWARDED_FOR, $xForwardedFor);

        return $next($request, $response);
    }

}