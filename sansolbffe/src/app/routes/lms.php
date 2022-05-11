<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\BffController;
use Csi\Controllers\LmsAnalyticsController;
use Csi\Controllers\LmsApplicationController;
use Csi\Controllers\LmsApplicationMenuController;
use Csi\Controllers\LmsCmsController;
use Csi\Controllers\LmsController;
use Csi\Controllers\LmsDelegableController;
use Csi\Controllers\LmsDevelopmentController;
use Csi\Controllers\LmsFseController;
use Csi\Controllers\LmsICalendarController;
use Csi\Controllers\LmsUserApplicationController;
use Csi\Controllers\LmsUserInformationController;
use Csi\Controllers\LmsAslController;
use Csi\Controllers\OtpController;
use Csi\Middleware\RouteProtectedAdminMiddleware;
use Csi\Middleware\RouteProtectedMiddleware;

$app->group('/lms', function () {
    $this->get('/ping1', BffController::class . ':ping');
    $this->get('/ping2', BffController::class . ':ping');
    $this->get('/ping3', BffController::class . ':ping');
    $this->get('/ping4', BffController::class . ':ping');
    $this->get('/ping5', BffController::class . ':ping');
    $this->get('/ping6', BffController::class . ':ping');
    $this->get('/ping7', BffController::class . ':ping');
    $this->get('/ping8', BffController::class . ':ping');
    $this->get('/ping9', BffController::class . ':ping');

    // SESSIONE
    // --------
    $this->get('/api/v1/login[/{path:.*}]', BffController::class . ':login');
    $this->get('/api/v1/logout', BffController::class . ':logout');
    $this->get('/api/v1/identity', BffController::class . ':identity');

    // OTP
    // ---
    $this->post('/api/v1/otp', OtpController::class . ':generate');
    $this->get('/api/v1/otp/verify', OtpController::class . ':verify');
    $this->get('/api/v1/otp/channels/sms/attempts-left', OtpController::class . ':attemptsLeft');

    // CONFIGUAZIONE E GESTIONE APPLICAZIONI
    // -------------------------------------
    $this->get('/api/v1/configurazione', LmsController::class . ':configuration');
    $this->get('/api/v1/applicazioni', LmsApplicationController::class . ':list');
    $this->get('/api/v1/applicazioni/{id}', LmsApplicationController::class . ':detail');
    $this->put('/api/v1/applicazioni/{id}', LmsApplicationController::class . ':editList')->add(new RouteProtectedMiddleware())->add(new RouteProtectedAdminMiddleware());
    $this->post('/api/v1/applicazioni', LmsApplicationController::class . ':create')->add(new RouteProtectedMiddleware())->add(new RouteProtectedAdminMiddleware());
    $this->delete('/api/v1/applicazioni/{id}', LmsApplicationController::class . ':delete')->add(new RouteProtectedMiddleware())->add(new RouteProtectedAdminMiddleware());

    $this->post('/api/v1/cittadini/{cf}/applicazioni-preferite', LmsApplicationController::class . ':starredCreate');
    $this->get('/api/v1/cittadini/{cf}/applicazioni-preferite', LmsApplicationController::class . ':starredList');
    $this->delete('/api/v1/cittadini/{cf}/applicazioni-preferite/{id}', LmsApplicationController::class . ':starredDelete');

    $this->get('/api/v1/icalendar/download', LmsICalendarController::class . ':download');

    $this->get('/api/v1/applicazione-categorie', LmsApplicationController::class . ':categoryList');
    $this->get('/api/v1/applicazione-gruppi', LmsApplicationController::class . ':groupList');

    $this->post('/api/v1/applicazioni-menu', LmsApplicationMenuController::class . ':create')->add(new RouteProtectedMiddleware())->add(new RouteProtectedAdminMiddleware());
    $this->get('/api/v1/applicazioni-menu', LmsApplicationMenuController::class . ':list');
    $this->get('/api/v1/applicazioni-menu/{id}', LmsApplicationMenuController::class . ':detail');
    $this->put('/api/v1/applicazioni-menu/{id}', LmsApplicationMenuController::class . ':edit')->add(new RouteProtectedMiddleware())->add(new RouteProtectedAdminMiddleware());
    $this->delete('/api/v1/applicazioni-menu/{id}', LmsApplicationMenuController::class . ':delete')->add(new RouteProtectedMiddleware())->add(new RouteProtectedAdminMiddleware());

    $this->get('/api/v1/informazioni-utenti', LmsUserInformationController::class . ':list');
    $this->get('/api/v1/informazioni-utenti/{id}', LmsUserInformationController::class . ':detail');
    $this->patch('/api/v1/informazioni-utenti/{id}', LmsUserInformationController::class . ':patch');

    $this->get('/api/v1/delegabili', LmsDelegableController::class . ':list');
    $this->get('/api/v1/delegabili/{id}', LmsDelegableController::class . ':detail');
    $this->put('/api/v1/delegabili/{id}', LmsDelegableController::class . ':edit')->add(new RouteProtectedMiddleware())->add(new RouteProtectedAdminMiddleware());
    $this->post('/api/v1/delegabili', LmsDelegableController::class . ':create')->add(new RouteProtectedMiddleware())->add(new RouteProtectedAdminMiddleware());

    $this->get('/api/v1/lista-asl', LmsAslController::class . ':list');

    $this->get('/api/v1/cittadini/{cf}/informazioni-applicazioni', LmsUserApplicationController::class . ':list');
    $this->post('/api/v1/cittadini/{cf}/informazioni-applicazioni/{app_id}', LmsUserApplicationController::class . ':createOrEdit');
    $this->delete('/api/v1/cittadini/{cf}/informazioni-applicazioni/{id}', LmsApplicationController::class . ':delete');


});

$app->group('/lms-analitica', function () {
    $this->get('/api/v1/accessi/_aggiornamento', LmsAnalyticsController::class . ':updateAccessData');
    $this->put('/api/v1/accessi/{appCode}', LmsAnalyticsController::class . ':increaseAppAccess');
});

$app->group('/lms-cms', function () {
    $this->get('/api/v1[/{path:.*}]', LmsCmsController::class . ':proxy');
});


$app->group('/development', function () {
    $this->get('/api/v1/utenti', LmsDevelopmentController::class . ':userList');
});

$app->group('/lms-fse', function () {
    $this->get('/api/v1/decodifiche/accessi', LmsFseController::class . ':accessDecodeList');
});
