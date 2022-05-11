<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Csi\Auth;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UserOverrideMiddleware
{


    public function __construct()
    {
    }


    private function hasParamsCookie()
    {
        return $_COOKIE['_shcf'] ?? false
            && $_COOKIE['_shc'] ?? false
            && $_COOKIE['_shn'] ?? false;

    }

    private function hasParamsQuery()
    {
        $url = parse_url($_SERVER['REQUEST_URI']);
        $query = isset($url['query']) ? $url['query'] : '';
        return strpos($query, '_shcf') !== false
            && strpos($query, '_shn') !== false
            && strpos($query, '_shc') !== false;
    }

    private function isAuthOverridable(ServerRequestInterface $req)
    {
        $identity = Auth::getShibbolethIdentity();
        $taxCode = $identity['cf'] ?? null;

        // Solamente gli utenti loggati possono usufruire della funzionalità "simula utente"
        if (!$taxCode) return false;

        $feApplication = $req->getHeader('X-Front-End-Application');
        $feApplication = $feApplication[0] ?? null;

        $isAllowedUser = in_array('*', AUTH_OVERRIDABLE_WHITELIST_USER) || in_array($taxCode, AUTH_OVERRIDABLE_WHITELIST_USER);
        $isAllowedApplication = in_array('*', AUTH_OVERRIDABLE_WHITELIST_APPLICATION) || in_array($feApplication, AUTH_OVERRIDABLE_WHITELIST_APPLICATION);

        return $isAllowedUser && $isAllowedApplication;
    }

    private function hasParams()
    {
        return $this->hasParamsCookie() || $this->hasParamsQuery();
    }

    private function getParamsCookie()
    {
        return [
            'cf' => $_COOKIE['_shcf'],
            'nome' => $_COOKIE['_shn'],
            'cognome' => $_COOKIE['_shc'],
        ];
    }

    private function getParamsQuery()
    {
        $query = [];
        $url = parse_url($_SERVER['REQUEST_URI']);
        parse_str($url['query'], $query);

        return [
            'cf' => $query['_shcf'],
            'nome' => $query['_shn'],
            'cognome' => $query['_shc'],
        ];
    }


    private function getParams()
    {
        if ($this->hasParamsCookie()) {
            return $this->getParamsCookie();
        } else {
            return $this->getParamsQuery();
        }
    }


    private function clearParamsCookies()
    {
        unset($_COOKIE['_shcf']);
        unset($_COOKIE['_shn']);
        unset($_COOKIE['_shc']);
    }

    private function clearParamsQuery()
    {
        $query = [];
        $url = parse_url($_SERVER['REQUEST_URI']);
        parse_str($url['query'] ?? '', $query);

        unset($query['_shcf']);
        unset($query['_shn']);
        unset($query['_shc']);

        $pure_query = http_build_query($query);
        $pure_uri = explode('?', $_SERVER['REQUEST_URI']);
        $pure_uri[1] = $pure_query;
        $pure_uri = implode('?', $pure_uri);
        $_SERVER['QUERY_STRING'] = $pure_query;
        $_SERVER['REQUEST_URI'] = $pure_uri;
    }

    private function clearParams()
    {
        $this->clearParamsCookies();
        $this->clearParamsQuery();
    }

    private function override($nome, $cognome, $cf, $riscontro = 'S')
    {
        $_SERVER[HEADER_FIELD_SHIB_NOME] = $nome;
        $_SERVER[HEADER_FIELD_SHIB_COGNOME] = $cognome;
        $_SERVER[HEADER_FIELD_SHIB_CF] = $cf;
        $_SERVER[HEADER_FIELD_SHIB_RISCONTRO] = $riscontro;
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
    {
        // Before
        // Se è possibile mockare l'utente => impostaiamo DEFAULT_IDENTITY
        if (AUTH_AUTO) {
            $this->override(
                DEFAULT_IDENTITY['nome'],
                DEFAULT_IDENTITY['cognome'],
                DEFAULT_IDENTITY['cf']
            );
        }

        // Se il client può sovrascrivere l'utente
        // e nella request ci sono i parametri richiesti per l'override dell'utente da parte del client
        // => effettuiamo l'override
//        if (AUTH_OVERRIDABLE && $this->hasParams()) {
        if ($this->isAuthOverridable($request) && $this->hasParams()) {
            $params = $this->getParams();
            $this->override($params['nome'], $params['cognome'], $params['cf']);
            $this->clearParams();
        }

        if (Auth::isShibbolethSessionEnabled()) {
            $user = Auth::getShibbolethIdentity();
            $request = $request->withHeader(AUTH_HEADER_NAME_CF, $user['cf']);
            $request = $request->withHeader(AUTH_HEADER_NAME_NOME, $user['nome']);
            $request = $request->withHeader(AUTH_HEADER_NAME_COGNOME, $user['cognome']);
            $request = $request->withHeader(AUTH_HEADER_NAME_RISCONTRO, $user['autenticazione_riscontro']);
        }

        // Next Middleware || Request Handler
        $response = $next($request, $response);

        // After
        return $response;
    }

}