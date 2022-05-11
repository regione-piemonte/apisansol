<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class CorsMiddleware
{


    public function __construct()
    {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
    {
        // Before

        // Next Middleware || Request Handler
        if (!self::isPreflightRequest($request)) {
            $response = $next($request, $response);
        }

        // Aggiungiamo gli header CORS solo alle richieste preflight
        $origin = $request->getHeaderLine('Origin');
        if ($origin === 'null' || in_array(parse_url($origin, PHP_URL_HOST), CORS_ALLOWED_ORIGINS)) {
            $response = $response->withHeader('Access-Control-Allow-Origin', $origin);
        }
        $response = $response->withHeader('Access-Control-Allow-Credentials', 'true');
        $response = $response->withHeader('Access-Control-Allow-Methods', implode(',', CORS_ALLOWED_METHODS));
        $response = $response->withHeader('Access-Control-Allow-Headers', implode(',', CORS_ALLOWED_HEADERS));
        $response = $response->withHeader('Access-Control-Expose-Headers', implode(',', CORS_EXPOSE_HEADERS));

        return $response;
    }

    /**
     * Determina se una richiesta è di tipo preflight.
     * @see https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
     *
     * @param ServerRequestInterface $request
     * @return bool true se si tratta di una richiesta preflight, false altrimenti
     */
    public static function isPreflightRequest(ServerRequestInterface $request)
    {
        return $request->getMethod() === 'OPTIONS'
            && $request->hasHeader('Origin')
            && $request->hasHeader('Access-Control-Request-Headers')
            && $request->hasHeader('Access-Control-Request-Method');
    }

}