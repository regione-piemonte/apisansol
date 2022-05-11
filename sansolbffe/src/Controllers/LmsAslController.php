<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Models\Application;
use Csi\Models\Delegable;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LmsAslController
{

    public function list(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $asrs = ASL_LIST;

        usort($asrs, function ($a, $b) {
            return $a['descrizione'] > $b['descrizione'] ? 1 : -1;
        });


        $res = $res->withJson($asrs);
        return $res;
    }

}