<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class MocksMiddleware
{

    public function __construct()
    {
    }


    private function hasParamsQuery(ServerRequestInterface $req)
    {
        $query = $req->getQueryParams();
        return $query['x_bff_mocks'] ?? false;
    }

    private function hasParamsHeader(ServerRequestInterface $req)
    {
        return $req->hasHeader('X-Bff-Mocks');
    }

    private function hasParamsCookie(ServerRequestInterface $req)
    {
        $cookie = $req->getCookieParams();
        return $cookie['x-bff-mocks'] ?? false;
    }

    private function hasParams(ServerRequestInterface $req)
    {
        return $this->hasParamsHeader($req)
            || $this->hasParamsQuery($req)
            || $this->hasParamsCookie($req);
    }

    private function getParamsCookie(ServerRequestInterface $req)
    {
        $cookie = $req->getCookieParams();
        return $cookie['x-bff-mocks'];
    }

    private function mustUseMocks(ServerRequestInterface $req)
    {

        if ($this->hasParamsHeader($req)) {
            return true;
        }

        if ($this->hasParamsQuery($req)) {
            return true;
        }

        // In caso di cookie calcoliamo se la richiesta è da mockare in base
        // all'endpoint chiamato
        //
        // In particolare il BFF si aspetta che il cookie sia impostato nel seguente modo:
        // una stringa separata da virgole che rappresenta l'elenco delle base url per cui abilitare i mock
        //
        // es:
        //  Cookie => "apisanpag,apisanfse"
        //  Url chiamata => "/apisanpag/api/v1" (MOCK)
        //  Url chiamata => "/apisancross/api/v1" (NO MOCKS)
        //  Url chiamata => "/apisanfse/api/v1" (MOCKS)
        if ($this->hasParamsCookie($req)) {
            $param = $this->getParamsCookie($req);
            $params = explode(',', $param);
            $endpoint = $req->getUri()->getPath();

            foreach ($params as $p) {
                if (strpos($endpoint, $p) !== false) {
                    return true;
                }
            }

            return false;
        }

        return false;
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
    {
        // Before
        if ($this->hasParams($request) && $this->mustUseMocks($request)) {
            $_SERVER['HTTP_X_BFF_MOCKS'] = true;
            $request = $request->withAttribute('mockable', true);
        }

        // Next Middleware || Request Handler
        $response = $next($request, $response);

        // After
        return $response;
    }

}