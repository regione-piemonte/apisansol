<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Csi\Utils\Utils;

class ApisanRiscreController
{

    /**
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function proxy($req, $res, $args)
    {
        $http = new Http();
        $http->setAuth(APISANRISCRE_USER, APISANRISCRE_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANRISCRE_SCHEME);
        $uri = $uri->withHost(APISANRISCRE_HOST);
        $uri = $uri->withPort(APISANRISCRE_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function geocoding(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        // disabilitiamo i mocks per questa chiamata
        $req = $req->withAttribute('mockable', false);

        $http = new Http();
        $http->setAuth(APISANRISCRE_USER, APISANRISCRE_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme('SCHEME');
        $uri = $uri->withHost('HOST');
        $uri = $uri->withPort(null);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

    public function download_document(ServerRequestInterface $request, ResponseInterface $response, array $args)
    {

        $response = $this->proxy($request, $response, $args);

        $status = $response->getStatusCode();
        $content = $response->getBody()->getContents();
        $data = @json_decode($content, true);
        $base64 = isset($data['base_64']) ? $data['base_64'] : '';
        $filename = isset($data['nome_file']) ? $data['nome_file'] : '';
        $string = base64_decode($base64);
        $stream = Utils::string2Stream($string);
        $stream = new \Slim\Http\Stream($stream);
        return $response
            ->withHeader('Content-Disposition', 'attachment; filename="' .  $filename)
            ->withHeader('Content-Type', ' application/pdf; charset=utf-8')
            // ->withHeader('Content-Length', strlen($base64))
            ->withHeader('Content-Length', strlen($string))
            ->withHeader('Expires', '0')
            ->withHeader('Pragma', 'no-cache')
            ->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->withBody($stream);

    }


}