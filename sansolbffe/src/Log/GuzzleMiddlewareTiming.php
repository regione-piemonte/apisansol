<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Log;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class GuzzleMiddlewareTiming
{
    public function __invoke(callable $handler)
    {
        return function (RequestInterface $req, array $options) use ($handler) {
            $name = $req->getUri()->getPath();
            $name = str_replace('/', '-', $name);
            $name = 'Forward-' . $name;
            // $name = 'Forward-' . uniqid();
            $stopwatch = $GLOBALS['app']->getContainer()->get(CONTAINER_STOPWATCH);
            $stopwatch->start($name);

            return $handler($req, $options)->then(
                function (ResponseInterface $res) use ($handler, $req, $stopwatch, $name) {
                    $stopwatch->stop($name);

                    if (IS_DEVELOPMENT || IS_TEST) {
                        $curl = Formatters::curl($req, true);
                        $res = $res->withHeader('X-' . $name, $curl);
                    }


                    return $res;
                }
            );
        };
    }
}