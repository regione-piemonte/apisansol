<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi;


use Csi\Log\Formatters;
use Csi\Log\Loggers;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Handlers\Error;

class ErrorHandler extends Error
{

    /**
     * Invoke error handler
     *
     * @param ServerRequestInterface $request The most recent Request object
     * @param ResponseInterface $response The most recent Response object
     * @param \Exception $exception The caught Exception object
     *
     * @return ResponseInterface
     * @throws \UnexpectedValueException
     */
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, \Exception $exception)
    {
        $response = parent::__invoke($request, $response, $exception);

        if (CORS_ENABLED) {
            // Aggiungiamo gli header CORS solo alle richieste preflight
            $origin = $request->getHeaderLine('Origin');
            if ($origin === 'null' || in_array(parse_url($origin, PHP_URL_HOST), CORS_ALLOWED_ORIGINS)) {
                $response = $response->withHeader('Access-Control-Allow-Origin', $origin);
            }
            $response = $response->withHeader('Access-Control-Allow-Credentials', 'true');
            $response = $response->withHeader('Access-Control-Allow-Methods', implode(',', CORS_ALLOWED_METHODS));
            $response = $response->withHeader('Access-Control-Allow-Headers', implode(',', CORS_ALLOWED_HEADERS));
            $response = $response->withHeader('Access-Control-Expose-Headers', implode(',', CORS_EXPOSE_HEADERS));
        }

        $loggerError = Loggers::error();
        $loggerError->debug(Formatters::error($request, $response, LOG_ERROR_PAYLOAD, LOG_ERROR_BODY) . PHP_EOL . PHP_EOL);

        $loggerError = Loggers::access();
        $loggerError->debug(Formatters::access($request, $response) . PHP_EOL);

        return $response;

    }

}