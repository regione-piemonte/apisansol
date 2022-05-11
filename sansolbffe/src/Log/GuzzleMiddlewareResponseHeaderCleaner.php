<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Log;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class GuzzleMiddlewareResponseHeaderCleaner
{

    public function __invoke(callable $handler)
    {
        return function (RequestInterface $req, array $options) use ($handler) {
            return $handler($req, $options)->then(
                function (ResponseInterface $res) use ($handler, $req) {
                    $res = $res->withoutHeader('Connection');
                    $res = $res->withoutHeader('Date');
                    $res = $res->withoutHeader('Keep-Alive');
                    $res = $res->withoutHeader('Proxy-Authenticate');
                    $res = $res->withoutHeader('Proxy-Authorization');
                    $res = $res->withoutHeader('TE');
                    $res = $res->withoutHeader('Trailer');
                    $res = $res->withoutHeader('Transfer-Encoding');
                    $res = $res->withoutHeader('Upgrade');

                    $res = $res->withoutHeader('X-Powered-By');
                    $res = $res->withoutHeader('Server');
                    $res = $res->withoutHeader('Via');
                    $res = $res->withoutHeader('Set-Cookie');

                    // Prova per CMS
                    // $res = $res->withoutHeader('Expires');
                    // $res = $res->withoutHeader('Last-Modified');
                    // $res = $res->withoutHeader('ETag');
                    // /$res = $res->withoutHeader('Cache-Control');

                    return $res;
                }
            );
        };
    }
}