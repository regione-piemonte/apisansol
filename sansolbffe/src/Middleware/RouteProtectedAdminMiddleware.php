<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;

use Csi\Auth;
use Csi\Log\Formatters;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;


class RouteProtectedAdminMiddleware
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

        if (IS_PRODUCTION) {
            $identity = Auth::getShibbolethIdentity();

            $cf_list = [];
            if(!in_array($identity['cf'], $cf_list)){
                return $res->withStatus(401);
            }
        }

        // Next Middleware || Request Handler
        $res = $next($req, $res);
        // After
        return $res;
    }

}