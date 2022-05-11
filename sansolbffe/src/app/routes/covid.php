<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\CovidController;

$app->group('/covid', function () {
    $this->get('/api/v1/me', CovidController::class . ':anonymousSubjectDetail');
    $this->put('/api/v1/me/contatti', CovidController::class . ':anonymousUpdateContacts');
});


$app->group('/solcovidapisrv', function () {
    $this->get('/api/anonimo/logout', CovidController::class . ':anonymousLogout');
    $this->get('/api/anonimo/cittadino', CovidController::class . ':anonymousSubjectDetail');
    $this->put('/api/anonimo/cittadino/{id}/contatti', CovidController::class . ':anonymousUpdateContacts');

    $this->post('/api/autenticazione/otp', CovidController::class . ':otpCreate');
    $this->post('/api/autenticazione/otp/verifica', CovidController::class . ':otpVerify');

    // API ESPOSTE DA APISANFSE
    $this->get('/api/cittadini/{taxCode}/documenti/{id}/verifica-documento-scaricabile', CovidController::class . ':reportVerify');
    $this->get('/api/cittadini/{taxCode}/referti/pdf', CovidController::class . ':documentRolDownload');
    $this->get('/api/cittadini/{taxCode}/documenti/{id}/documento', CovidController::class . ':documentFseDownload');


    $this->any('/{routes:.+}', CovidController::class . ':proxy');
});