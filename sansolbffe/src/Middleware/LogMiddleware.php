<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Csi\Log\Formatters;
use Csi\Log\Loggers;
use Csi\Utils\LoggingUtils;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LogMiddleware
{

    private $loggerCurl;
    private $loggerAccess;
    private $loggerError;
    private $loggerJson;

    public function __construct()
    {
        $this->loggerCurl = Loggers::curl();
        $this->loggerAccess = Loggers::access();
        $this->loggerError = Loggers::error();
        $this->loggerJson = Loggers::json();
    }

    private function logCurl(ServerRequestInterface $req, ResponseInterface $res)
    {
        $this->loggerCurl->debug('[R]' . Formatters::curl($req, LOG_CURL_PAYLOAD) . PHP_EOL);
    }

    private function logAccess(ServerRequestInterface $req, ResponseInterface $res)
    {
        $this->loggerAccess->debug(Formatters::access($req, $res) . PHP_EOL);
    }

    private function logError(ServerRequestInterface $req, ResponseInterface $res)
    {
        $status = $res->getStatusCode();
        $is_error = $status >= 400;
        if (!$is_error) return;
        $this->loggerError->debug(Formatters::error($req, $res, LOG_ERROR_PAYLOAD, LOG_ERROR_BODY) . PHP_EOL . PHP_EOL);
    }

    private function logJson(ServerRequestInterface $req, ResponseInterface $res)
    {
        $status = $res->getStatusCode();
        $is_error = $status >= 400;
        $with_payload = $is_error ? LOG_JSON_PAYLOAD_ON_ERROR : LOG_JSON_PAYLOAD;
        $with_body = $is_error ? LOG_JSON_BODY_ON_ERROR : LOG_JSON_BODY;
        $with_cookies = $is_error ? LOG_JSON_COOKIES_ON_ERROR : LOG_JSON_COOKIES;
        $json = Formatters::json($req, $res, $with_payload, $with_body, $with_cookies);
        $this->loggerJson->debug($json . PHP_EOL);
    }

    public function __invoke(ServerRequestInterface $req, ResponseInterface $res, callable $next)
    {
        // Se si tratta di un utente da ignorare => saltiamo il logging
        // Se la richiesta è una richiesta di test => saltiamo il logging
        if (!LoggingUtils::isUserLoggable() || strpos($req->getRequestTarget(), '__tests__') !== false) {
            return $next($req, $res);
        }

        // Before
        try {
            if (LOG_CURL) $this->logCurl($req, $res);
        } catch (\Exception $e) {

        }

        // Next Middleware || Request Handler
        $res = $next($req, $res);

        // After
        try {
            if (LOG_ACCESS) $this->logAccess($req, $res);
        } catch (\Exception $e) {

        }

        try {
            if (LOG_ERROR) $this->logError($req, $res);
        } catch (\Exception $e) {

        }

        try {
            if (LOG_JSON) $this->logJson($req, $res);
        } catch (\Exception $e) {

        }

        return $res;
    }
}