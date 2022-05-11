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

class CovidController
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
        $http->setAuth(COVID_USER, COVID_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(COVID_SCHEME);
        $uri = $uri->withHost(COVID_HOST);
        $uri = $uri->withPort(COVID_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader('X-Applicazione-Codice', 'solcovid');

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

    public function otpCreate(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        return $this->proxy($req, $res, $args);
        // return $res->withStatus(200);
    }

    public function otpVerify(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $res = $this->proxy($req, $res, $args);
        // $res = $res->withStatus(200);

        $status = $res->getStatusCode();

        // In caso di successo impostiamo il cookie
        if ($status >= 200 && $status < 300) {
            $payload = $req->getParsedBody();
            $taxCode = $payload['codiceFiscale'] ?? null;

            session_start([
                'name' => 'BFF_SESSION_ID',
                'cookie_secure' => IS_DEVELOPMENT ? false : true,
                'cookie_httponly' => true,
            ]);

            $_SESSION['covidTaxCode'] = $taxCode;
        }

        return $res;
    }

    public function anonymousLogout(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        session_start(['name' => 'BFF_SESSION_ID', 'read_and_close' => true]);
        unset ($_SESSION["covidTaxCode"]);
        return $res->withStatus(200);
    }

    public function anonymousSubjectDetail(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        session_start(['name' => 'BFF_SESSION_ID', 'read_and_close' => true]);
        $taxCode = $_SESSION['covidTaxCode'] ?? null;

        if (!$taxCode) {
            return $res->withStatus(403);
        }

        // Modifichiamo la URI per cambiare il path da chiamare
        $uri = $req->getUri();
        $uri = $uri->withPath('URL' . $taxCode);
        $req = $req->withUri($uri);

        // Aggiungiamo gli header necessari
        $req = $req->withHeader(AUTH_HEADER_NAME_CF, $taxCode);

        return $this->proxy($req, $res, $args);
    }

    public function anonymousUpdateContacts(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        session_start(['name' => 'BFF_SESSION_ID', 'read_and_close' => true]);
        $taxCode = $_SESSION['covidTaxCode'] ?? null;

        if (!$taxCode) {
            return $res->withStatus(403);
        }

        $id = $args['id'];

        // Modifichiamo la URI per cambiare il path da chiamare
        $uri = $req->getUri();
        $uri = $uri->withPath('URL/' . $id . '/contatti');
        $req = $req->withUri($uri);

        // Aggiungiamo gli header necessari
        $req = $req->withHeader(AUTH_HEADER_NAME_CF, $taxCode);

        return $this->proxy($req, $res, $args);
    }


    private function proxyApisanFse(ServerRequestInterface $req, ResponseInterface $res, array $args)
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
        $path = $uri->getPath();
        $path = str_replace('URL/', 'URL/', $path);
        $uri = $uri->withPath($path);
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function reportVerify(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $query = $req->getQueryParams();
        $otp_session = key_exists('sessione_otp', $query);

        if ($otp_session) {
            session_start(['name' => 'BFF_SESSION_ID', 'read_and_close' => true]);
            $taxCode = $_SESSION['covidTaxCode'] ?? null;
            //$taxCode = DEFAULT_IDENTITY['cf']; // Per test

            if (!$taxCode) return $res->withStatus(403);

            $req = $req->withHeader(AUTH_HEADER_NAME_CF, $taxCode);

            $uri = $req->getUri();
            $path = $uri->getPath();
            $path = str_replace('CODICE_FISCALE_OTP', $taxCode, $path);
            $uri = $uri->withPath($path);
            $req = $req->withUri($uri);
        }


        return $this->proxyApisanFse($req, $res, $args);
    }

    public function documentRolDownload(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $query = $req->getQueryParams();
        $otp_session = key_exists('sessione_otp', $query);

        if ($otp_session) {
            session_start(['name' => 'BFF_SESSION_ID', 'read_and_close' => true]);
            $taxCode = $_SESSION['covidTaxCode'] ?? null;
            //$taxCode = DEFAULT_IDENTITY['cf']; // Per test

            if (!$taxCode) return $res->withStatus(403);

            $req = $req->withHeader(AUTH_HEADER_NAME_CF, $taxCode);

            $uri = $req->getUri();
            $path = $uri->getPath();
            $path = str_replace('CODICE_FISCALE_OTP', $taxCode, $path);
            $uri = $uri->withPath($path);
            $req = $req->withUri($uri);
        }


        $res = $this->proxyApisanFse($req, $res, $args);

//        $status = $res->getStatusCode();
//        $query = $req->getQueryParams();
//        $pdf = $query['pdf'] ?? null;
//
//        if($pdf !== null){
//
//            if($status >= 300){
//
//                return $res->withStatus($status);
//            }
//
//            $content = $res->getBody()->getContents();
//
//            $data = @json_decode($content, true);
//            $document = $data['documento'] ?? [];
//            $base64 = $document['documento'] ?? '';
////            $documentId = $document['id_documento'] ?? '';
////            $filename = 'referto-' . $documentId;
//
//            $string = base64_decode($base64);
//            $stream = Utils::string2Stream($string);
//            $stream = new \Slim\Http\Stream($stream);
//
//            return $res
//                ->withHeader('Content-Disposition', 'inline')
//                ->withHeader('Content-Type', ' application/pdf; charset=utf-8')
//                // ->withHeader('Content-Length', strlen($base64))
//                ->withHeader('Content-Length', strlen($string))
//                ->withHeader('Expires', '0')
//                ->withHeader('Pragma', 'no-cache')
//                ->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
//                ->withBody($stream);
//        }

        return $res;
    }

    public function documentFseDownload(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $query = $req->getQueryParams();
        $otp_session = key_exists('sessione_otp', $query);

        if ($otp_session) {
            session_start(['name' => 'BFF_SESSION_ID', 'read_and_close' => true]);
            $taxCode = $_SESSION['covidTaxCode'] ?? null;
            //$taxCode = DEFAULT_IDENTITY['cf']; // Per test

            if (!$taxCode) return $res->withStatus(403);

            $req = $req->withHeader(AUTH_HEADER_NAME_CF, $taxCode);

            $uri = $req->getUri();
            $path = $uri->getPath();
            $path = str_replace('CODICE_FISCALE_OTP', $taxCode, $path);
            $uri = $uri->withPath($path);
            $req = $req->withUri($uri);
        }


        $res = $this->proxyApisanFse($req, $res, $args);

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


}