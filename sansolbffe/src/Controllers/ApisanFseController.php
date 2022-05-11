<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Csi\Utils\Utils;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanFseController
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
        $http->setAuth(APISANFSE_USER, APISANFSE_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANFSE_SCHEME);
        $uri = $uri->withHost(APISANFSE_HOST);
        $uri = $uri->withPort(APISANFSE_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);
        // $request = $request->withHeader('Bypass-Tunnel-Reminder', 'yay');

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

    public function reportPdf(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $res = $this->proxy($req, $res, $args);

        $statusCode = $res->getStatusCode();
        if ($statusCode === 200) {
            $res = $res->withHeader('Content-Disposition', 'attachment; filename="referto.pdf"');
        }

        return $res;
    }


    public function lastPolicyPdf(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $res = $this->proxy($req, $res, $args);

        $statusCode = $res->getStatusCode();


        if ($statusCode === 200) {
            $contentDisposition = $req->getQueryParam('content_disposition', 'inline');

            if ($contentDisposition === 'inline') {
                $res = $res->withHeader('Content-Disposition', 'inline');
            } else {
                $res = $res->withHeader('Content-Disposition', 'attachment; filename="informativa.pdf"');
            }
        }

        return $res;
    }

    /**
     * Metodo di utility che estrapola il documento dalla response JSON del Back-End e genera un PDF.
     * In questo modo il client può visualizzare sul browser il documento.
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function documentPdf(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $res = $this->proxy($req, $res, $args);

        $status = $res->getStatusCode();
        $query = $req->getQueryParams();
        $pdf = $query['pdf'] ?? null;

        if($pdf !== null){

            if($status >= 300){

                return $res->withStatus($status);
            }

            $content = $res->getBody()->getContents();

            $data = @json_decode($content, true);
            $document = $data['documento'] ?? [];
            $base64 = $document['documento'] ?? '';
//            $documentId = $document['id_documento'] ?? '';
//            $filename = 'referto-' . $documentId;

            $string = base64_decode($base64);
            $stream = Utils::string2Stream($string);
            $stream = new \Slim\Http\Stream($stream);

            return $res
                ->withHeader('Content-Disposition', 'inline')
                ->withHeader('Content-Type', ' application/pdf; charset=utf-8')
                // ->withHeader('Content-Length', strlen($base64))
                ->withHeader('Content-Length', strlen($string))
                ->withHeader('Expires', '0')
                ->withHeader('Pragma', 'no-cache')
                ->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->withBody($stream);
        }

        return $res;
    }


    /**
     * Metodo di utility che estrapola il documento dalla response JSON del Back-End e genera un PDF.
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function documentPersonalPdf(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $res = $this->proxy($req, $res, $args);

        $status = $res->getStatusCode();
        $query = $req->getQueryParams();
        $pdf = $query['pdf'] ?? null;

        if($pdf !== null){

            if($status >= 300){
                // @TODO: restituire una pagina html di errore?
                return $res->withStatus($status);
            }

            $content = $res->getBody()->getContents();

            $data = @json_decode($content, true);
            $base64 = $data['allegato'] ?? '';
            $contentType = $data['tipo_allegato'] ?? 'application/pdf';

            $string = base64_decode($base64);
            $stream = Utils::string2Stream($string);
            $stream = new \Slim\Http\Stream($stream);

            return $res
                ->withHeader('Content-Disposition', 'inline')
                ->withHeader('Content-Type', $contentType . '; charset=utf-8')
                ->withHeader('Content-Length', strlen($string))
                ->withHeader('Expires', '0')
                ->withHeader('Pragma', 'no-cache')
                ->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->withBody($stream);
        }

        return $res;
    }


    public function accessListPdf(ServerRequestInterface $request, ResponseInterface $response, array $args)
    {
        $request = $request->withoutHeader('HTTP_X_FORWARDED_FOR');

        $payload = $request->getParam('payload');
        $payload = json_decode($payload, true);

        $stream = Utils::string2Stream(json_encode($payload));
        $stream = new \Slim\Http\Stream($stream);
        $request = $request->withBody($stream);
        $request = $request->withParsedBody($payload);
        $request = $request->withHeader('Content-type', 'application/json');

        $response =  $this->proxy($request, $response, $args);
        $response = $response->withoutHeader('Content-Length');

        return $response;
    }


}