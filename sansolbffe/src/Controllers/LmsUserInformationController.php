<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;

use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Models\UserInformation;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LmsUserInformationController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }


    public function list(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $list = UserInformation::all();
        $data = $list->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    public function detail(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $id = $args['id'];
        $detail = UserInformation::find($id);

        if ($detail == null) {
            return $res->withStatus(404);
        }

        $data = $detail->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }

    public function patch(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        $payload = $req->getParsedBody();
        $tutorialHomeSeen = $payload['tutorial_home_visualizzato'] ?? null;
        $tutorialFseSeen = $payload['tutorial_fse_visualizzato'] ?? null;

        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($payload)->notEmpty()
                ->that($tutorialHomeSeen, 'tutorial_home_visualizzato')->nullOr()->boolean()
                ->that($tutorialFseSeen, 'tutorial_fse_visualizzato')->nullOr()->boolean()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }


        $id = $args['id'];
        $detail = UserInformation::find($id);

        if ($detail == null) {
            return $res->withStatus(404);
        }

        $detail->fill($payload);
        $detail->save();
        $detail = $detail->fresh();

        $data = $detail->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }
}