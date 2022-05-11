<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanCrossController;

$app->group('/apisancross', function () {
    $this->get('/api/v1/mezzi-pubblici/fermate', ApisanCrossController::class . ':stopList');
    $this->get('/api/v1/mezzi-pubblici/fermate/{id}', ApisanCrossController::class . ':stopDetail');
    $this->get('/api/v1/mezzi-pubblici/fermate/{id}/linee/{linea_id}', ApisanCrossController::class . ':stopRouteDetail');
    $this->get('/api/v1/regioni', ApisanCrossController::class . ':regioni');
    $this->any('/{routes:.+}', ApisanCrossController::class . ':proxy');
});