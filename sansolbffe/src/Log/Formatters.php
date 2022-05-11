<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Log;

use Carbon\Carbon;
use Csi\Auth;
use Csi\Utils\LoggingUtils;
use Csi\Utils\Utils;
use DateTime;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use WhichBrowser\Parser;

class Formatters
{

    public static function curl(RequestInterface $req, $with_payload = false)
    {
        $method = $req->getMethod();
        $uri = $req->getUri();
        $headers = $req->getHeaders();
        ksort($headers);
        $payload = $req->getBody();
        $payload_size = $payload->getSize();

        $result = [];
        array_push($result, '[' . Carbon::now()->toTimeString() . ']');
        array_push($result, 'curl');
        array_push($result, "-X {$method} '{$uri}'");

        $html_headers = LoggingUtils::php2HtmlHeaders($headers);
        foreach ($html_headers as $name => $value) {
            // $value = implode(', ', $value);
            array_push($result, "-H '{$name}: {$value}'");
        }

        if (!$with_payload) {
            array_push($result, "-d ... payload hidden ...");
        } elseif ($payload != null && $payload_size > 0) {
            $payload->rewind();
            $data = $payload->getContents();
            $payload->rewind();
            array_push($result, "-d '{$data}'");
        }

        return implode(' ', $result);
    }


    public static function access(ServerRequestInterface $req, ResponseInterface $res)
    {
        $datetime = (new DateTime())->format('H:i:s');
        $request_id = $req->getHeader(HEADER_NAME_REQUEST_ID);
        $request_id = isset($request_id[0]) ? $request_id[0] : '';
        $fe_page = $req->getHeader('X-Front-End-Page');
        $fe_page = isset($fe_page[0]) ? $fe_page[0] : '';
        $fe_route = $req->getHeader('X-Front-End-Route');
        $fe_route = isset($fe_route[0]) ? $fe_route[0] : '';
        $fe_app = $req->getHeader('X-Front-End-Application');
        $fe_app = isset($fe_app[0]) ? $fe_app[0] : '';
        $cookie = $req->getCookieParams();
        $session_id = $cookie['LMS_SESSION_ID'] ?? '';

        $cf = '';
        if (Auth::isShibbolethSessionEnabled()) {
            $user = Auth::getShibbolethIdentity();
            $cf = isset($user['cf']) ? $user['cf'] : '';
        }

        $status = $res->getStatusCode();
        $method = $req->getMethod();
        $path = $req->getUri()->getPath();
        $query = $req->getUri()->getQuery();
        if (!empty($query)) $path = implode('?', [$path, $query]);
        $path = urldecode($path);
        $ms = microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'];

        // DATA | SESSION ID | X-REQUEST-ID | CF | TEMPO | STATUS | METODO | URL
        $message = "%8s | %36s | %36s | %16s | %6.2fs | %s | %-7s | %s | fea::%s | fer::%s | fep::%s";
        return sprintf($message, $datetime, $session_id, $request_id, $cf, $ms, $status, $method, $path, $fe_app, $fe_route, $fe_page);
    }

    public static function error(ServerRequestInterface $req, ResponseInterface $res, $with_payload = false, $with_body = false)
    {

        $access = self::access($req, $res);
        $curl = self::curl($req, $with_payload);
        $lines = [
            $access,
            '[R]' . $curl
        ];

        // Print headers
        $headers = $res->getHeaders();
        $html_headers = LoggingUtils::php2HtmlHeaders($headers);
        foreach ($html_headers as $name => $value) {
            array_push($lines, "{$name}: {$value}");
        }

        $body = $res->getBody();
        $bodySize = $body->getSize();
        if (!$with_body) {
            array_push($lines, "... body hidden ...");
        } elseif ($bodySize != null && $bodySize > 0) {
            $body->rewind();
            $data = $body->getContents();
            $data = Utils::jsonPretty($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $body->rewind();
            array_push($lines, $data);
        }

        return implode(PHP_EOL, $lines);
    }

    public static function json(ServerRequestInterface $req, ResponseInterface $res, $with_payload = false, $with_body = false, $with_cookies = false)
    {

        function getClientInfo()
        {
            $parsed = new Parser($_SERVER['HTTP_USER_AGENT']);

            $result = [
                'browserName' => $parsed->browser->name,
                'browserVersion' => $parsed->browser->getVersion(),
                'browserType' => $parsed->browser->type,

                'engineName' => $parsed->engine->name,
                'engineVersion' => $parsed->engine->getVersion(),

                'osName' => $parsed->os->name,
                'osVersion' => $parsed->os->getVersion(),

                'deviceType' => $parsed->device->type,
                'deviceSubtype' => $parsed->device->subtype,
                'deviceManufacturer' => $parsed->device->manufacturer,
                'deviceModel' => $parsed->device->model,
                'deviceIdentifier' => $parsed->device->identifier,
            ];

            return $result;
        }


        function htmlHeaders($phpHeaders)
        {
            $result = [];

            foreach ($phpHeaders as $name => $value) {
                $value = implode(', ', $value);;
                $result[$name] = $value;
            }

            ksort($result);
            return $result;
        }

        function normalizeUri(UriInterface $uri)
        {
            return [
                'scheme' => $uri->getScheme(),
                'host' => $uri->getHost(),
                'port' => $uri->getPort(),
                'basePath' => $uri->getBasePath(),
                'path' => $uri->getPath(),
                'fragment' => $uri->getFragment(),
                'url' => $uri->getBaseUrl() . '/' . $uri->getPath()
            ];
        }

        function getStreamContent(StreamInterface $stream)
        {
            $stream->rewind();
            $data = $stream->getContents();
            $stream->rewind();
            return $data;
        }

        $json_user = null;

        if (Auth::isShibbolethSessionEnabled()) {
            $json_user = Auth::getShibbolethIdentity();
        }

        $json_request = [
            'method' => $req->getMethod(),
            'uri' => normalizeUri($req->getUri()),
            'query' => $req->getQueryParams(),
            'headers' => htmlHeaders($req->getHeaders()),
            // 'curl' => self::curl($req, $with_payload)
        ];

        $json_response = [
            'status' => $res->getStatusCode(),
            'headers' => htmlHeaders($res->getHeaders()),
        ];

        // Solo nel DEBUG aggiungiamo i cookies ed il body
        $json_request['cookies'] = '... cookies hidden ...';
        $json_request['payload'] = '... payload hidden ...';
        $json_response['body'] = '... body hidden ...';

        if ($with_cookies) $json_request['cookies'] = $req->getCookieParams();
        if ($with_payload) $json_request['payload'] = getStreamContent($req->getBody());
        if ($with_body) $json_response['body'] = getStreamContent($res->getBody());

        $perf = microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'];
        $perf = number_format($perf, 2, '.', "");

        $cookie = $req->getCookieParams();
        $sessionId = $cookie['LMS_SESSION_ID'] ?? null;

        $json = [
            'sessionId' => $sessionId,
            'datetime' => (new DateTime())->format(DATE_ATOM),
            'perf' => $perf,
            'user' => $json_user,
            'client' => getClientInfo(),
            'request' => $json_request,
            'response' => $json_response,
        ];

        return json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

}