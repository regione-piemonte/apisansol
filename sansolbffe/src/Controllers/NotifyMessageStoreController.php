<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Csi\Auth;
use Csi\Utils\Utils;
use Csi\Http;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Http\Uri;

class NotifyMessageStoreController
{

    /**
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function proxy($req, $res, $args)
    {
        $http = new Http();
        if (USE_PROXY) $http->setProxy(PROXY);

        $request = clone $req;
        $uri = $request->getUri();
        $uri = $uri->withScheme(NOTIFY_PREFERENCES_SCHEME);
        $uri = $uri->withHost(NOTIFY_PREFERENCES_HOST);
        $uri = $uri->withPort(NOTIFY_PREFERENCES_PORT);
        $uri = $uri->withBasePath('');
        $request = $request->withUri($uri);
        $request = $request->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);
        $request = $request->withHeader(NOTIFY_HEADER_NAME_AUTH, NOTIFY_AUTH_JWT);

        if (Auth::isShibbolethSessionEnabled()) {
            $user = Auth::getShibbolethIdentity();
            $request = $request->withHeader(NOTIFY_HEADER_NAME_CF, $user['cf']);
        }

        $response = $http->call($request);
        $res = clone $response;

        return $res;
    }



    public function getUnseen(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $taxCode = $args['taxCode'];

        // Aggiungiamo alla request verso il notificatore i tag relativi a "La mia salute"
        $query = $req->getQueryParams();
        $filter = $query['filter'] ?? "";
        $filter = json_decode($filter, true) ?? [];

        // Ricostruiamo la struttura se non esiste
        // Altrimenti prendiamo la struttura passata ed aggiungiamo i tag necessari
        $tag = $filter['tag'] ?? [];
        $match = $tag['match'] ?? "";
        $match = $match . " +sanita -deleted -noticed";

        $tag['match'] = $match;
        $filter['tag'] = $tag;
        $query['filter'] = json_encode($filter);

        // Se non ci è stato passato il limit impostiamolo noi
        $query['limit'] = $query['limit'] ?? 1;
        $req = $req->withQueryParams($query);

        // La query appena costruita la usiamo anche nella URI
        $url = NOTIFY_MESSAGE_STORE_SCHEME . '://' . NOTIFY_MESSAGE_STORE_HOST . '/notify-messagestore/api/v1/users/' . $taxCode . '/messages?' . http_build_query($query);
        $uri = Uri::createFromString($url);
        $req = $req->withUri($uri);

        $http = new Http();
        if (USE_PROXY) $http->setProxy(PROXY);

        $req = $req->withHeader(NOTIFY_HEADER_NAME_AUTH, NOTIFY_AUTH_JWT);
        $req = $req->withHeader(NOTIFY_HEADER_NAME_CF, $_SERVER[HEADER_FIELD_SHIB_CF]);
        $res = $http->call($req);

        return $res;
    }


    public function setUnseen(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $taxCode = $args['taxCode'];
        $payload = $req->getParsedBody();
        $notificationList = $payload ?? [];

        $notificationSeenList = [];
        foreach ($notificationList as $notification) {
            $tag = $notification['tag'] ?? '';
            $tag = explode(',', $tag);

            if (!in_array('noticed', $tag)) {
                array_push($tag, 'noticed');
            }

            $tag = implode(',', $tag);

            array_push($notificationSeenList, [
                'id' => $notification['id'] ?? null,
                'read_at' => $notification['read_at'] ?? null,
                'tag' => $tag,
            ]);
        }


        $url = NOTIFY_MESSAGE_STORE_SCHEME . '://' . NOTIFY_MESSAGE_STORE_HOST . '/notify-messagestore/api/v1/users/' . $taxCode . '/messages/status';
        $uri = Uri::createFromString($url);
        $req = $req->withUri($uri);

        $stream = Utils::string2Stream(json_encode($notificationSeenList));
        $stream = new \Slim\Http\Stream($stream);
        $req = $req->withBody($stream);
        $req = $req->withParsedBody($notificationSeenList);

        $http = new Http();
        if (USE_PROXY) $http->setProxy(PROXY);

        $req = $req->withHeader(NOTIFY_HEADER_NAME_AUTH, NOTIFY_AUTH_JWT);
        $req = $req->withHeader(NOTIFY_HEADER_NAME_CF, $_SERVER[HEADER_FIELD_SHIB_CF]);
        $res = $http->call($req);

        return $res;
    }


    /**
     * Endpoint di utility che permette di ottenere la lista dei messaggi ricevuti da un cittadino
     * e che fanno riferimento al portale "La mia salute".
     *
     * In pratica preimposta i filtri necessari per leggere solo i messaggi di "La mia salute"
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     * @throws \Exception
     */
    public function getList($req, $res, $args)
    {

        $taxCode = $args['taxCode'];

        // Aggiungiamo alla request verso il notificatore i tag relativi a "La mia salute"
        $query = $req->getQueryParams();
        $filter = $query['filter'] ?? "";
        $filter = json_decode($filter, true) ?? [];

        // Ricostruiamo la struttura se non esiste
        // Altrimenti prendiamo la struttura passata ed aggiungiamo i tag necessari
        $tag = $filter['tag'] ?? [];
        $match = $tag['match'] ?? "";
        $match = $match . " +sanita -deleted";
        $tag['match'] = $match;
        $filter['tag'] = $tag;

        // $filter['tag'] = ['match' => "+sanita -deleted"];
        $filter = json_encode($filter);
        $query['filter'] = $filter;
        $req = $req->withQueryParams($query);

        // La query appena costruita la usiamo anche nella URI
        $url = NOTIFY_MESSAGE_STORE_SCHEME . '://' . NOTIFY_MESSAGE_STORE_HOST . '/notify-messagestore/api/v1/users/' . $taxCode . '/messages?' . http_build_query($query);
        $uri = Uri::createFromString($url);
        $req = $req->withUri($uri);

        $http = new Http();
        if (USE_PROXY) $http->setProxy(PROXY);

        $req = $req->withHeader(NOTIFY_HEADER_NAME_AUTH, NOTIFY_AUTH_JWT);
        $req = $req->withHeader(NOTIFY_HEADER_NAME_CF, $_SERVER[HEADER_FIELD_SHIB_CF]);
        $res = $http->call($req);

        return $res;
    }

}