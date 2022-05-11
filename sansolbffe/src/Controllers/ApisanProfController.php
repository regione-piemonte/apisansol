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


class ApisanProfController
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
        $http->setAuth(APISANPROF_USER, APISANPROF_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANPROF_SCHEME);
        $uri = $uri->withHost(APISANPROF_HOST);
        $uri = $uri->withPort(APISANPROF_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function verifyTeam(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        $res = $this->proxy($req, $res, $args);

        $status = $res->getStatusCode();
        if ($status === 200) {
            $data = $res->getBody()->getContents();
            $data = @json_decode($data, true);
            $desc = isset($data['desc_risposta']) ? $data['desc_risposta'] : '';
            $data['risposta'] = strtoupper($desc) === 'OK';

            $stream = Utils::string2Stream(@json_encode($data));
            $stream = new \Slim\Http\Stream($stream);
            $res = $res->withBody($stream);
        }

        return $res;
    }

}