<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Log;

use Monolog\Handler\RotatingFileHandler;
use Monolog\Logger;

class Loggers
{

    public static function curl()
    {
        $formatter = new MonologFormatterPlain();
        $handler = new RotatingFileHandler(LOG_CURL_FILE_PATH, LOG_CURL_MAX_FILES);
        $handler->setFormatter($formatter);
        $logger = new Logger(LOG_CURL_CHANNEL);
        $logger->pushHandler($handler);
        return $logger;
    }


    public static function access()
    {
        $formatter = new MonologFormatterPlain();
        $handler = new RotatingFileHandler(LOG_ACCESS_FILE_PATH, LOG_ACCESS_MAX_FILES);
        $handler->setFormatter($formatter);
        $logger = new Logger(LOG_ACCESS_CHANNEL);
        $logger->pushHandler($handler);
        return $logger;
    }

    public static function error()
    {
        $formatter = new MonologFormatterPlain();
        $handler = new RotatingFileHandler(LOG_ERROR_FILE_PATH, LOG_ERROR_MAX_FILES);
        $handler->setFormatter($formatter);
        $logger = new Logger(LOG_ERROR_CHANNEL);
        $logger->pushHandler($handler);
        return $logger;
    }

    public static function json()
    {
        $formatter = new MonologFormatterPlain();
        $handler = new RotatingFileHandler(LOG_JSON_FILE_PATH, LOG_JSON_MAX_FILES);
        $handler->setFormatter($formatter);
        $logger = new Logger(LOG_JSON_CHANNEL);
        $logger->pushHandler($handler);
        return $logger;
    }
}