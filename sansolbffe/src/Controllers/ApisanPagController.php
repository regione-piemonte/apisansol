<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanPagController
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
        $http->setAuth(APISANPAG_USER, APISANPAG_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANPAG_SCHEME);
        $uri = $uri->withHost(APISANPAG_HOST);
        $uri = $uri->withPort(APISANPAG_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function paymentReminder(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        $res = $this->proxy($req, $res, $args);

        $status = $res->getStatusCode();

        // In caso di errore restuiamo un html di errore
        if ($status >= 300) {
            $file = PATH_PROJECT_ROOT . 'pdf-error';
            $fh = fopen($file, 'rb');
            $stream = new \Slim\Http\Stream($fh);

            $res = $res->withHeader('Content-Disposition', 'inline');
            $res = $res->withHeader('Content-Type', 'text/html');
            $res = $res->withHeader('Expires', '0');
            $res = $res->withHeader('Pragma', 'no-cache');
            $res = $res->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

            $res = $res->withBody($stream);
        }

        return $res;
    }


    public function asrTemp(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $asrs = PTW['ASR_LIST'];
        usort($asrs, function ($a, $b) {
            return $a['descrizione'] > $b['descrizione'] ? 1 : -1;
        });

        $res = $res->withJson($asrs);
        return $res;
    }

    public function printableReminderTemp(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $res = $res->withJson(PTW_PRINTABLE_REMINDER);
        return $res;
    }


    public function captchaTemp(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $json = [
            'captcha' => 'CAPTCHA',
        ];

        $res = $res->withJson($json);
        return $res;
    }

}