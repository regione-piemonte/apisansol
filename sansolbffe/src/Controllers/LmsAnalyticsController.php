<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Http;
use Csi\Models\Application;
use Illuminate\Database\Capsule\Manager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Http\Headers;
use Slim\Http\Request;
use Slim\Http\RequestBody;
use Slim\Http\Uri;

class LmsAnalyticsController
{

    protected $orm;

    public function __construct(Manager $orm)
    {
        $this->orm = $orm;
    }

    public function increaseAppAccess(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $appCode = $args['appCode'] ?? null;

        // Validazione payload
        try {
            Assert::lazy()
                ->tryAll()
                ->that($appCode, 'codice applicazione')->string()
                ->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
        }

        // Verifichiamo che il codice applicazione passato sia valido
        $app = Application::where('codice', $appCode)->first();
        if (!$app) {
            return $res->withStatus(400)->withJson('Codice applicazione non valido');
        }

        $app->numero_accessi = $app->numero_accessi + 1;

        try {
            $app->save();
        } catch (\Exception $e) {
            throw $e;
        }

        return $res->withStatus(200);
    }


    public function updateAccessData(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {

        $query = $req->getQueryParams();
        $date = $query['data'] ?? "last1";
        $period = $query['periodo'] ?? "week";


        try {
            $this->orm->getConnection()->beginTransaction();

            $appList = Application::all();
            $result = [];

            foreach ($appList as $app) {
                $toReplace = IS_PRODUCTION || IS_ALPHA || IS_ALPHA_CERT ? 'HOST' : 'HOST';
                $url = str_replace($toReplace, '', $app->url);

                $http = new Http();
                if (USE_PROXY) $http->setProxy(PROXY);

                $query = [
                    'token_auth' => MATOMO_AUTH_TOKEN,
                    'idSite' => MATOMO_SITE_ID,
                    'format' => 'json',
                    'module' => 'API',
                    'method' => 'API.get',
                    'date' => $date,
                    'period' => $period,
                    'segment' => 'pageTitle=^' . $url,
                    'filter_limit' => -1,
                ];

                $uri = new Uri(MATOMO_SCHEMA, MATOMO_HOST);
                $uri = $uri->withPath(MATOMO_PATH);
                $uri = $uri->withQuery(http_build_query($query));
                $headers = new Headers();
                $body = new RequestBody();
                $request = new Request('GET', $uri, $headers, [], [], $body);

                $response = $http->call($request);
                $data = $response->getBody()->getContents();
                $data = @json_decode($data, true);

                $count = 0;

                foreach ($data as $day => $value) {
                    if (!empty($value)) {
                        $count += $value['nb_uniq_visitors'];
                    }
                }

                if ($count > 0) {
                    $app->numero_accessi += $count;
                    $app->save();
                }

                $result[$app->codice] = $data;
            }

            $this->orm->getConnection()->commit();
            return $res->withJson($result, 200);
        } catch (\Throwable $e) {
            $this->orm->getConnection()->rollBack();
            throw $e;
        }
    }
}