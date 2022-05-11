<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Csi\Models\Application;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LmsController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }


    // CONFIGURAZIONE
    // ----------------------------------------------------------------------------------------------------------------
    public function configuration(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $applicationList = Application::with(['categoria', 'gruppo', 'delegabili', 'menu'])->orderBy('posizione', 'asc')->get();
        $fcm = [
            'vapid_key' => 'KEY',
            'config' => [
                'apiKey' => 'KEY',
                'authDomain' => 'AUTH_DOMAIN',
                'databaseURL' => 'DB_URL',
                'projectId' => 'ID',
                'storageBucket' => 'STORAGE',
                'messagingSenderId' => 'SENDER_ID',
                'appId' => 'ID',
            ]
        ];

        $data = [
            'fcm' => $fcm,
            'apps' => $applicationList->jsonSerialize()
        ];

        return $res->withStatus(200)->withJson($data);
    }

}