<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Csi\Auth;
use Csi\Models\UserInformation;
use Csi\Utils\Utils;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Http\Response;

class BffController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }

    public function ping(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        return $res->withStatus(200);
    }


    // Permette il login e ridirige al path indicato
    public function login(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $query = $req->getQueryParams();
        $location = isset($query['landingUrl']) ? $query['landingUrl'] : '';

        // Se la URL è assoluta e non si riferisce al dominio isan.csi.it
        // => facciamo un redirect vuoto
        if (Utils::startsWith($location, 'http') && strpos($location, 'isan.csi.it') === false) {
            $location = '';
        }

        // Se la URL è relativa e non inizia con /
        // => lo aggiungiamo noi
        if (!Utils::startsWith($location, 'http') && !Utils::startsWith($location, '/')) {
            $location = '/' . $location;
        }

        return $res->withStatus(302)->withHeader('Location', $location);
    }


    public function logout(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

//        if (!$req->hasHeader('Shib-Handler')) {
//            return $res->withStatus(403)->withJson('Sessione non attiva');
//        }
//
//        $handler = $req->getHeader('Shib-Handler');
//        if (is_array($handler)) $handler = $handler[0];
//        $url = $handler . '/Logout';
//        return $res->withStatus(302)->withHeader('Location', $url);

        return $res->withStatus(302)->withHeader('Location', SHIBBOLETH_LOGOUT_URL);
    }


    public function identity(ServerRequestInterface $req, Response $res, array $args)
    {

        if (!Auth::isShibbolethSessionEnabled()) {
            return $res->withStatus(401, 'Non autenticato');
        }

        $identity = Auth::getShibbolethIdentity();
        $taxCode = $identity['cf'] ?? null;

        // Non rompiamo la webapp se non riusciamo ad ottenere i dati
        try {
            if ($taxCode) {
                $info = UserInformation::where('codice_fiscale', $taxCode)->first();

                if (!$info) {
                    $info = new UserInformation();
                    $info->codice_fiscale = $taxCode;
                    $info->save();
                    $info = $info->fresh();
                }

                $identity['info'] = $info->jsonSerialize();;
            }
        } catch (\Exception $e) {
        }


        return $res
            ->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->withHeader('Pragma', 'no-cache')
            ->withJson($identity);
    }
}