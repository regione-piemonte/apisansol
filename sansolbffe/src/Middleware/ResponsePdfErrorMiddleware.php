<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ResponsePdfErrorMiddleware
{

    public function __construct() {
    }

    public function __invoke(ServerRequestInterface $req, ResponseInterface $res, callable $next)
    {

        // Before

        // Next Middleware || Request Handler
        $res = $next($req, $res);

        // After
        $status = $res->getStatusCode();

        // In caso di errore restituiamo un html di errore
        if ($status >= 400) {
            $file = PATH_PROJECT_ROOT . 'pdf-error';
            $fh = fopen($file, 'rb');
            $stream = new \Slim\Http\Stream($fh);

            $res = $res->withHeader('Content-Disposition', 'inline');
            $res = $res->withHeader('Content-Type', 'text/html');
            $res = $res->withHeader('Expires', '0');
            $res = $res->withHeader('Pragma', 'no-cache');
            $res = $res->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

            $res = $res->withBody($stream);
        }


        return $res;
    }

}