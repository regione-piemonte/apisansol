<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ApisanCrossController
{

    /**
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function proxy($req, $res, $args)
    {
        $http = new Http();
        $http->setAuth(APISANCROSS_USER, APISANCROSS_PASS);
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(APISANCROSS_SCHEME);
        $uri = $uri->withHost(APISANCROSS_HOST);
        $uri = $uri->withPort(APISANCROSS_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }


    public function regioni(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        // restituiamo i mocks
        $regioni = json_decode('[
                    {
                      "codice_istat": 13,
                      "desc": "ABRUZZO"
                    },
                    {
                      "codice_istat": 17,
                      "desc": "BASILICATA"
                    },
                    {
                      "codice_istat": 18,
                      "desc": "CALABRIA"
                    },
                    {
                      "codice_istat": 15,
                      "desc": "CAMPANIA"
                    },
                    {
                      "codice_istat": 8,
                      "desc": "EMILIA-ROMAGNA"
                    },
                    {
                      "codice_istat": 6,
                      "desc": "FRIULI-VENEZIA GIULIA"
                    },
                    {
                      "codice_istat": 12,
                      "desc": "LAZIO"
                    },
                    {
                      "codice_istat": 7,
                      "desc": "LIGURIA"
                    },
                    {
                      "codice_istat": 3,
                      "desc": "LOMBARDIA"
                    },
                    {
                      "codice_istat": 11,
                      "desc": "MARCHE"
                    },
                    {
                      "codice_istat": 14,
                      "desc": "MOLISE"
                    },
                    {
                      "codice_istat": 1,
                      "desc": "PIEMONTE"
                    },
                    {
                      "codice_istat": 21,
                      "desc": "PROV. AUTON. BOLZANO"
                    },
                    {
                      "codice_istat": 22,
                      "desc": "PROV. AUTON. TRENTO"
                    }, 
                    {
                      "codice_istat": 16,
                      "desc": "PUGLIA"
                    },
                    {
                      "codice_istat": 20,
                      "desc": "SARDEGNA"
                    },
                    {
                      "codice_istat": 19,
                      "desc": "SICILIA"
                    },
                    {
                      "codice_istat": 9,
                      "desc": "TOSCANA"
                    },
                    {
                      "codice_istat": 4,
                      "desc": "TRENTINO-ALTO ADIGE/SÜDTIROL"
                    },
                    {
                      "codice_istat": 10,
                      "desc": "UMBRIA"
                    },
                    {
                      "codice_istat": 2,
                      "desc": "VALLE D\'AOSTA/VALLÉE D\'AOSTE"
                    },   
                    {
                      "codice_istat": 5,
                      "desc": "VENETO"
                    }
                  ]');

        $res = $res->withStatus(200);
        $res = $res->withJson($regioni);
        return $res;
    }


    public function stopList(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $query = $req->getQueryParams();
        $lat = $query['lat'] ?? null;
        $lon = $query['lon'] ?? null;
        $distanza = $query['distanza'] ?? null;

        // Verifichiamo che siano stati passati i campi obbligatori nei query params
        try {
            Assert::lazy()
                ->tryAll()
                ->that($lat, 'lat')->notEmpty()->numeric()
                ->that($lon, 'lon')->notEmpty()->numeric()
                ->that($distanza, 'distanza')->notEmpty()->numeric()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        $http = new Http();
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(PUBLIC_TRANSPORT_SCHEME);
        $uri = $uri->withHost(PUBLIC_TRANSPORT_HOST);
        $uri = $uri->withPort(PUBLIC_TRANSPORT_PORT);
        $uri = $uri->withPath('URL/' . $lon . '/' . $lat . '/' . $distanza);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

    public function stopDetail(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $http = new Http();
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(PUBLIC_TRANSPORT_SCHEME);
        $uri = $uri->withHost(PUBLIC_TRANSPORT_HOST);
        $uri = $uri->withPort(PUBLIC_TRANSPORT_PORT);
        $uri = $uri->withPath('URL/' . $args['id']);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

    public function stopRouteDetail(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $http = new Http();
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(PUBLIC_TRANSPORT_SCHEME);
        $uri = $uri->withHost(PUBLIC_TRANSPORT_HOST);
        $uri = $uri->withPort(PUBLIC_TRANSPORT_PORT);
        $uri = $uri->withPath('URL/' . $args['id'] . '/' . $args['linea_id']);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }

}