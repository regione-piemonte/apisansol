<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Psr\Http\Message\ServerRequestInterface;
use Slim\Http\Response;

class LmsDevelopmentController
{

    public function userList(ServerRequestInterface $req, Response $res, array $args)
    {
        $user_list = [
            IDENTITY_DEMO_20,
            IDENTITY_DEMO_21,
            IDENTITY_DEMO_22,
            IDENTITY_DEMO_23,
            IDENTITY_DEMO_24,
            IDENTITY_DEMO_25,
            IDENTITY_DEMO_26,
            IDENTITY_DEMO_27,
            IDENTITY_DEMO_28,
            IDENTITY_DEMO_29,
            IDENTITY_DEMO_30,
            IDENTITY_DEMO_31,
            IDENTITY_DEMO_32,
            IDENTITY_DEMO_33,
            IDENTITY_DEMO_34,
            IDENTITY_DEMO_35,
            IDENTITY_DEMO_36,
            IDENTITY_DEMO_37,
            IDENTITY_DEMO_38,
            IDENTITY_DEMO_39,
            IDENTITY_DEMO_40,
            IDENTITY_DEMO_43
        ];

        usort($user_list, function ($a, $b) {
            $a = $a['cognome'] . ' ' . $a['nome'];
            $b = $b['cognome'] . ' ' . $b['nome'];
            return strcasecmp($a, $b);
        });

        return $res->withStatus(200)->withJson($user_list);
    }
}