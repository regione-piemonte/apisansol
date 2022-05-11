<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Csi\Models\FseAccessDecodeService;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Http\Response;

class LmsFseController
{

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }

    public function accessDecodeList(ServerRequestInterface $req, Response $res, array $args)
    {
        $list = FseAccessDecodeService::all();
        $data = $list->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }
}