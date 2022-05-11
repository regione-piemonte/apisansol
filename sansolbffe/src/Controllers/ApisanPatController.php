<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanPatController
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
        $http->setAuth(APISANESENPAT_USER, APISANESENPAT_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANESENPAT_SCHEME);
        $uri = $uri->withHost(APISANESENPAT_HOST);
        $uri = $uri->withPort(APISANESENPAT_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

    //lista tipologie invalidità
    public function tipologie_invalidita(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(TIPOLOGIE_INVALIDITA);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getTipologieInvalidità",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getTipologieInvalidità"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }

    //motivazioni-annullamento
    public function motivazioni_annullamento(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(MOTIVAZIONI_ANNULLAMENTO);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getMotivazioniAnnullamento",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getMotivazioniAnnullamento"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;

        }

        $res = $json;
        return $res;
    }


    //disclaimer malattie rare
    public function disclaimer_malattie_rare(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(DISCLAIMER_MALATTIE_RARE);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getDisclaimerMalattie",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getDisclaimerMalattie"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;

        }

        $res = $json;
        return $res;
    }

    public function disclaimer_trattamento_dati(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(DISCLAIMER_TRATTAMENTO_DATI);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getDisclaimerDati",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getDisclaimerDati"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;

        }

        $res = $json;
        return $res;
    }

    public function documenti_tipologie(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $codice = $args['tipologia_codice'];
        $c = 'DOCUMENTO_TIPOLOGIE_' . $codice;
        $url = constant($c);
        $json = @file_get_contents($url);

        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getDocumentiTipologie",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getDocumentiTipologie"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }

    public function malattie(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $codice = $args['tipologia_codice'];
        $c = 'DIAGNOSI_' . $codice;
        $url = constant($c);
        $json = @file_get_contents($url);

        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getMalattie",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getMalattie"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;

        }

        $res = $json;
        return $res;
    }

//dettaglio malattia
    public function dettaglio_malattia(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $codice = $args['tipologia_codice'];
        $codice_malattia = $args['malattia_codice'];
        $c = 'DIAGNOSI_' . $codice;
        $url = constant($c);
        $json = @file_get_contents($url);
        $data = json_decode($json, true);

        foreach ($data as $item) {
            if ($item["codice"] == $codice_malattia) {
                $single_data = $item;
                $single_data = json_encode($single_data);
                $json = $single_data;
            }
        }

        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getMalattia",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getMalattia"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;

        }

        $res = $single_data;
        return $res;
    }

    //dettaglio esenzione
    public function dettaglio_esenzione(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $codice = $args['tipologia_codice'];
        $codice_esenzione = $args['esenzione_codice'];
        $c = 'ESENZIONI_' . $codice;
        $url = constant($c);
        $json = @file_get_contents($url);
        $data = json_decode($json, true);

        foreach ($data as $item) {
            if ($item["codice"] == $codice_esenzione) {
                $single_data = $item;
                $single_data = json_encode($single_data);
                $json = $single_data;
            }
        }

        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getEsenzione",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getEsenzione"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;

        }

        $res = $single_data;
        return $res;
    }

    //motivazioni-revoca
    public function motivazioni_revoca(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(MOTIVAZIONI_REVOCA);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getMotivazioniRevoca",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getMotivazioniRevoca"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }

    public function esenzioni(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $codice = $args['tipologia_codice'];
        $c = 'ESENZIONI_' . $codice;
        $url = constant($c);
        $json = @file_get_contents($url);

        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getEsenzioni",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getEsenzioni"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }

    //stati-esenzione
    public function stati_esenzione(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(STATI_ESENZIONE);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getStatiEsenzione",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getStatiEsenzione"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }

    //tipologie-esenzione
    public function tipologie_esenzione(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        if ($req->getAttribute('mockable', false)) {
            return $this->proxy($req, $res, $args);
        }

        $json = @file_get_contents(TIPOLOGIE_ESENZIONE);
        if ($json === false) {
            $error = json_decode('{
            "status": "500: internal server error",
            "code": "01", "title": "Errore getTipologieEsenzione",
            "detail": {
                "chiave": "01",
                "valore": "generico errore getTipologieEsenzione"
                }, 
            "links": "link"}'
            );

            $res = $res->withJson($error, 500);
            return $res;
        }

        $res = $json;
        return $res;
    }

}