<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Middleware\CaptchaMiddleware;
use Csi\Middleware\CorsMiddleware;
use Csi\Middleware\LogMiddleware;
use Csi\Middleware\ClientInjectableMiddleware;
use Csi\Middleware\MocksMiddleware;
use Csi\Middleware\RequestCleaningMiddleware;
use Csi\Middleware\RequestForwardedForMiddleware;
use Csi\Middleware\RequestIdMiddleware;
use Csi\Middleware\ResponseEnvMiddleware;
use Csi\Middleware\UserOverrideMiddleware;
use Csi\Middleware\HeadersNormalizeMiddleware;
use Tuupola\Middleware\ServerTimingMiddleware;

// @see https://gist.github.com/betweenbrain/d337caa01b2067f7b8aa
// I Middleware vengono eseguiti in modalità LIFO (Last in first out), cioè l'ultimo aggiunto è il primo
// ad essere eseguito, mentre il primo aggiunto è l'ultimo ad essere eseguito

// Eseguito per ultimo
//----------------------------------------------------------------------------------------------------------------------

// Ripulisce la request da quei parametri necessari solo al BFF e non ai servizi di back-end
$app->add(new RequestCleaningMiddleware());

// Aggiunge alla response un header che rappresenta l'ambiente su cui
// sta lavorando il BFF
$app->add(new ResponseEnvMiddleware());

// Controlla se la URL chiamata deve essere protetta da captcha o meno
// ed eventualmente effettua il controllo di validità del captcha
$app->add(new CaptchaMiddleware());

// @deprecated
// Permette al client di governare alcuni comportamenti del BFF
$app->add(new ClientInjectableMiddleware());

// Permette al client di passare dei cookie che
// dicono su quali URL abilitare i mocks
if (MOCKS_ENABLED) $app->add(new MocksMiddleware());

// Permette di iniettare automaticamente un'autenticazione di default
// e permette al client di sovrascrivere a piacimento l'autenticazione
// passando dei parametri nella query string oppure nei cookie
if (AUTH_AUTO || AUTH_OVERRIDABLE) $app->add(new UserOverrideMiddleware());

// Aggiunge gli header CORS alla risposta
if (CORS_ENABLED) $app->add(new CorsMiddleware());

// Calcola ed aggiunge l'header X-Forwarded-For alla richiesta
$app->add(new RequestForwardedForMiddleware());

// Se non esiste aggiunge l'header X-Request-Id alla richiesta
$app->add(new RequestIdMiddleware());

// Normalizza i nomi degli header HTTP della request da "HTTP_NOME_HEADER" a "Nome-Header"
if (HEADER_NORMALIZE) $app->add(new HeadersNormalizeMiddleware());

// Aggiunge un middleware che logga su file diverse informazioni relative sia alla richiesta che alla risposta
if (LOG) $app->add(new LogMiddleware());

// @see https://github.com/tuupola/server-timing-middleware
// Per avere dei timing accurati, aggiungerlo sempre come primo middleware eseguito
$app->add(new ServerTimingMiddleware($app->getContainer()->get(CONTAINER_STOPWATCH)));

// ---------------------------------------------------------------------------------------------------------------------
// Eseguito per primo
