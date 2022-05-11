<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi;

use Csi\Log\GuzzleMiddlewareRequestCurl;
use Csi\Utils\Utils;
use Ramsey\Uuid\Uuid;
use Slim\Http\Headers;
use Slim\Http\Request;
use Slim\Http\RequestBody;
use Slim\Http\Uri;

class SendMessage
{

    public function __construct()
    {

    }

    public function sms($cf, $phone, $content)
    {
        $message = ['phone' => $phone, 'content' => $content];
        $this->send($cf, 'sms', $message);
    }

    /**
     * @param string $cf
     * @param string $to
     * @param string $subject
     * @param string $body
     */
    public function email($cf, $to, $subject, $body)
    {
        $message = [
            'to' => $to,
            'subject' => $subject,
            'body' => $body,
            'template_id' => NOTIFY_EMAIL_TEMPLATE_ID,
        ];
        $this->send($cf, 'email', $message, true, 'high');
    }

    public function send($cf, $type, $message, $trusted = true, $priority = null)
    {
        $http = new Http();
        if (USE_PROXY) $http->setProxy(PROXY);
        $http->after('prepare_body', new GuzzleMiddlewareRequestCurl());

        $uri = new Uri(
            NOTIFY_MESSAGE_BROKER_SCHEME,
            NOTIFY_MESSAGE_STORE_HOST,
            NOTIFY_MESSAGE_BROKER_PORT,
            NOTIFY_MESSAGE_BROKER_BASE_PATH . 'topics/messages'
        );
        $headers = new Headers();
        $body = new RequestBody();
        $req = new Request('POST', $uri, $headers, [], [], $body);

        $payload = [
            'uuid' => Uuid::uuid4()->toString(),
            'payload' => [
                'id' => Uuid::uuid4()->toString(),
                'user_id' => $cf,
                $type => $message,
                // trusted = true
                // Per inviare la notifica ignorando il modulo di preferenze.
                // Questo implica che devono essere impostati i contatti necessari
                // per sapere a chi inviare mail/sms/push
                'trusted' => $trusted
            ],
        ];

        if ($priority !== null) {
            $payload["priority"] = $priority;
        }

        $req = $req->withHeader('Content-Type', 'application/json');
        $req = $req->withHeader(APISAN_HEADER_NAME_SERVICE_CODE, APISAN_HEADER_VALUE_SERVICE_CODE);
        $req = $req->withHeader(NOTIFY_HEADER_NAME_AUTH, NOTIFY_AUTH_JWT);

        if (Auth::isShibbolethSessionEnabled()) {
            $user = Auth::getShibbolethIdentity();
            $req = $req->withHeader(NOTIFY_HEADER_NAME_CF, $user['cf']);
        }

        $stream = Utils::string2Stream(json_encode($payload));
        $stream = new \Slim\Http\Stream($stream);
        $req = $req->withBody($stream);
        $req = $req->withParsedBody($payload);
        $res = $http->call($req);
    }
}