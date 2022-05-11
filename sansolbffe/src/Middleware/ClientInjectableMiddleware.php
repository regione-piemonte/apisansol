<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Csi\Utils\Utils;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ClientInjectableMiddleware
{

    public function __construct()
    {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
    {

        function is_injectable_query_param($value, $key)
        {
            return Utils::startsWith($key, 'xci_');
        }

        function is_not_injectable_query_param($value, $key)
        {
            return !is_injectable_query_param($value, $key);
        }


        // Before
        $query = $request->getQueryParams();

        $injectable_query = array_filter(
            $query,
            function ($value, $key) {
                return Utils::startsWith($key, 'xci_');
            },
            ARRAY_FILTER_USE_BOTH
        );

        $clean_query = array_filter(
            $query,
            function ($value, $key) {
                return !Utils::startsWith($key, 'xci_');
            },
            ARRAY_FILTER_USE_BOTH
        );

        $request->withQueryParams($clean_query);


        // Next Middleware || Request Handler
        $response = $next($request, $response);


        $status = $response->getStatusCode();

        // CONTENT DISPOSITION
        // -------------------------------------------------------------------------------------------------------------
        if (isset($injectable_query['xci_cd'])) {
            $content_disposition = $injectable_query['xci_cd'];

            if (isset($injectable_query['xci_fn'])) {
                $content_disposition = "{$content_disposition}; filename={$injectable_query['xci_fn']}";
            }

            $response = $response->withHeader('Content-Disposition', $content_disposition);
        }

        // STATUS
        // -------------------------------------------------------------------------------------------------------------
        if (isset($injectable_query['xci_status'])) {
            $status = intval($injectable_query['xci_status']);
            $response = $response->withStatus($status);
        }


        // ERROR REDIRECT
        // -------------------------------------------------------------------------------------------------------------
        if ($status >= 400) {
            if (isset($injectable_query['xci_error_url'])) {
                $url = $injectable_query['xci_error_url'];
                $response = $response->withStatus(303)->withHeader('Location', $url);
            }
        }

        return $response;
    }

}