<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Models\Application;
use Csi\Models\ApplicationCategory;
use Csi\Models\ApplicationGroup;
use Csi\Models\ApplicationMenu;
use Csi\Models\ApplicationStarred;
use Csi\Utils\RequestParsers;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LmsApplicationMenuController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }


    public function list(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $orderBy = RequestParsers::getOrderBy($req, 'ordinamento');

        // Se non ci è stato passato nessun ordinamento => ne applichiamo uno di default
        if (count($orderBy) <= 0) {
            $orderBy = [['field' => 'posizione', 'direction' => 'asc']];
        }

        $list = ApplicationMenu::with(['applicazione']);
        foreach ($orderBy as $tuple) {
            $list = $list->orderBy($tuple['field'], $tuple['direction']);
        }
        $list = $list->get();

        $data = $list->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    public function detail(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $id = $args['id'];
        $el = ApplicationMenu::with(['applicazione'])->find($id);

        if ($el == null) {
            return $res->withStatus(404);
        }

        $data = $el->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }

    /**
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     * @throws AssertionFailedException
     */
    public function create($req, $res, $args)
    {
        $payload = $req->getParsedBody();

        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($payload)->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        try {
            $el = new ApplicationMenu();
            $el->descrizione = $payload['descrizione'];
            $el->url = $payload['url'];
            $el->posizione = $payload['posizione'];
            $el->visibile_menu_desktop = $payload['visibile_menu_desktop'];
            $el->visibile_menu_mobile = $payload['visibile_menu_mobile'];
            $el->applicazione_id = $payload['applicazione_id'];

            $el->save();
            $el = $el->fresh();
        } catch (\Exception $e) {
            throw $e;
            // return $res->withStatus(500)->withJson($e->getMessage());
        }

        $data = $el->jsonSerialize();
        return $res->withStatus(201)->withJson($data);
    }

    /**
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     *
     * @throws AssertionFailedException
     */
    public function edit($req, $res, $args)
    {
        $id = $args['id'];
        $payload = $req->getParsedBody();

        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($payload)->notEmpty()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        try {
            $el = ApplicationMenu::where('id', $id)->first();
            if ($el == null) {
                return $res->withStatus(404)->withJson("Id applicazione errato");
            }

            $el->descrizione = $payload['descrizione'];
            $el->url = $payload['url'];
            $el->posizione = $payload['posizione'];
            $el->visibile_menu_desktop = $payload['visibile_menu_desktop'];
            $el->visibile_menu_mobile = $payload['visibile_menu_mobile'];

            $el->save();
            $el = $el->fresh();
        } catch (\Exception $e) {
            throw $e;
            // return $res->withStatus(500)->withJson($e->getMessage());
        }

        $data = $el->jsonSerialize();
        return $res->withStatus(200)->withJson($data);
    }


    public function delete(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $id = $args['id'];

        $el = ApplicationMenu::with(['applicazione'])->find($id);

        if ($el == null) {
            return $res->withStatus(404);
        }

        $el->delete();
        return $res->withStatus(200);
    }
}