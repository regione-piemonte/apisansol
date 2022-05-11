<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Log;

use Psr\Http\Message\RequestInterface;

class GuzzleMiddlewareRequestCurl
{

    public function __invoke(callable $handler)
    {
        return function (RequestInterface $req, array $options) use ($handler) {
            $logger = Loggers::curl();
            $logger->debug('[F]' . Formatters::curl($req, LOG_CURL_PAYLOAD) . PHP_EOL);
            return $handler($req, $options);
        };
    }
}