<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// DIC configuration
use Psr\Container\ContainerInterface;

const CONTAINER_ORM = 'eloquent';
const CONTAINER_STOPWATCH = 'STOPWATCH';

$container = $app->getContainer();

$container[CONTAINER_STOPWATCH] = function (ContainerInterface $c) {
    return new Tuupola\Middleware\ServerTiming\Stopwatch();
};

$container[CONTAINER_ORM] = function (ContainerInterface $c) {
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection([
        'driver' => DB_TYPE,
        'host' => DB_HOST,
        'port' => DB_PORT,
        'database' => DB_NAME,
        'username' => DB_USER,
        'password' => DB_PASS,
        'charset' => DB_CHARSET,
        'collation' => 'utf8_unicode_ci',
        'prefix' => DB_TABLE_PREFIX,
    ]);

    $capsule->setAsGlobal();
    $capsule->getConnection()->enableQueryLog();
    $capsule->getConnection()->setEventDispatcher(new \Illuminate\Events\Dispatcher);
    $capsule->getConnection()->listen(function ($query) use ($c) {
        $stopwatch = $c->get(CONTAINER_STOPWATCH);
        $stopwatch->set('DB', $query->time);
    });

    $capsule->bootEloquent();
    return $capsule;
};

// CONTROLLERS
// ---------------------------------------------------------------------------------------------------------------------
$container[\Csi\Controllers\BffController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\BffController($orm);
};

$container[\Csi\Controllers\LmsController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsController($orm);
};

$container[\Csi\Controllers\LmsApplicationController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsApplicationController($orm);
};

$container[\Csi\Controllers\LmsApplicationMenuController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsApplicationMenuController($orm);
};

$container[\Csi\Controllers\LmsAnalyticsController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsAnalyticsController($orm);
};

$container[\Csi\Controllers\LmsUserInformationController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsUserInformationController($orm);
};

$container[\Csi\Controllers\LmsDelegableController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsDelegableController($orm);
};

$container[\Csi\Controllers\LmsAslController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsAslController($orm);
};

$container[\Csi\Controllers\LmsFseController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsFseController($orm);
};

$container[\Csi\Controllers\OtpController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\OtpController($orm);
};

$container[\Csi\Controllers\FrontEndConfigController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\FrontEndConfigController($orm);
};

$container[\Csi\Controllers\LmsUserApplicationController::class] = function (ContainerInterface $c) {
    $orm = $c->get(CONTAINER_ORM);
    return new \Csi\Controllers\LmsUserApplicationController($orm);
};

// ERRORI
// ---------------------------------------------------------------------------------------------------------------------
// Per mostrare gli errori di SLIM quando siamo in sviluppo
// Dobbiamo avere un handler che aggiunge gli header per i CORS anche nelle response di errore
if (IS_DEVELOPMENT) {
    $container['errorHandler'] = function (ContainerInterface $c) {
        $settings = $c->get('settings');
        $displayErrorDetails = $settings['displayErrorDetails'];
        return new \Csi\ErrorHandler($displayErrorDetails);
    };

    $container['phpErrorHandler'] = function (ContainerInterface $c) {
        $settings = $c->get('settings');
        $displayErrorDetails = $settings['displayErrorDetails'];
        return new \Csi\PhpErrorHandler($displayErrorDetails);
    };
}