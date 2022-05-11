<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;

use Csi\Auth;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;


class RouteProtectedMiddleware
{

    private $statusCode;

    public function __construct($statusCode = 401)
    {
        $this->statusCode = $statusCode;
    }


    /**
     * @param ServerRequestInterface $req PSR7 request
     * @param ResponseInterface $res PSR7 response
     * @param callable $next Next middleware
     *
     * @return ResponseInterface
     */
    public function __invoke($req, $res, $next)
    {
        // Before
        if (!Auth::isShibbolethSessionEnabled()) {
            return $res->withStatus(401);
        }

        // Next Middleware || Request Handler
        $res = $next($req, $res);

        // After
        return $res;
    }

}