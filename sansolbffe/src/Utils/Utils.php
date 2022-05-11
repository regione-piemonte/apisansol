<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Utils;


use Exception;
use Psr\Http\Message\ResponseInterface;

class Utils
{

    public static function arrayMapDeep(callable $callback, array $arr)
    {
        $result = [];

        foreach ($arr as $key => $value) {

            $r = call_user_func($callback, $key, $value);
            $_key = $r['key'];
            $_value = $r['value'];

            if (is_array($_value)) {
                $_value = self::arrayMapDeep($callback, $value);
            }

            $result[$_key] = $_value;
        }

        return $result;
    }


    public static function isJson($val)
    {

        // Evitiamo di provare a decodificare file che presumibilmente non sono JSON
        // o sono comunque troppo grandi per essere decodificati
        // @see https://stackoverflow.com/questions/31085943/safe-json-decode-to-prevent-exhausting-memory
        $json_mb_memory_limit = 5;
        if (!is_string($val)) {
            return false;
        }
        $is_too_big = strlen($val) * 10 > ($json_mb_memory_limit * 1024 * 1024);
        if ($is_too_big) {
            return false;
        }

        json_decode($val);
        return json_last_error() === JSON_ERROR_NONE;
    }


    public static function jsonPretty(
        $val,
        $options = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    ) {
        if (is_object($val)) {
            return $val;
        }

        $val = self::isJson($val) ? json_decode($val) : $val;
        return json_encode($val, $options);
    }


    public static function guzzleResponse2SlimResponse(
        ResponseInterface $guzzleResponse,
        ResponseInterface $slimResponse
    ) {

        // Trick per effeturare il clone della risposta slim senza modificarla
        $result = $slimResponse->withHeader('x-dummy', 'dummy');
        $result = $result->withoutHeader('x-dummy');

        $headers = $guzzleResponse->getHeaders();
        foreach ($headers as $name => $value) {
            $result = $result->withHeader($name, $value);
        }

        $result->withProtocolVersion($guzzleResponse->getProtocolVersion());
        $result->withStatus($guzzleResponse->getStatusCode(), $guzzleResponse->getReasonPhrase());
        $result->withBody($guzzleResponse->getBody());

        return $result;
    }


    public static function startsWith($haystack, $needle)
    {
        $length = strlen($needle);
        return (substr($haystack, 0, $length) === $needle);
    }


    public static function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }

        return (substr($haystack, -$length) === $needle);
    }


    public static function arrayAny(array $array, callable $fn) {
        foreach ($array as $value) {
            if($fn($value)) {
                return true;
            }
        }
        return false;
    }

    public static function arrayEvery(array $array, callable $fn) {
        foreach ($array as $value) {
            if(!$fn($value)) {
                return false;
            }
        }
        return true;
    }


    public static function string2Stream($string){
        $stream = fopen('php://memory','r+');
        fwrite($stream, $string);
        rewind($stream);
        return $stream;
    }

}