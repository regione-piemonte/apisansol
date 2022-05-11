<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanVaccinazioniController;

$app->group('/apisanvac', function () {
    $this->post('/{routes:.+}/spostamento/richiesta', ApisanVaccinazioniController::class . ':forbidden');
    $this->put('/{routes:.+}/spostamento', ApisanVaccinazioniController::class . ':forbidden');
    $this->post('/{routes:.+}/revoca/richiesta', ApisanVaccinazioniController::class . ':forbidden');
    $this->post('/{routes:.+}/revoca', ApisanVaccinazioniController::class . ':forbidden');
    $this->post('/{routes:.+}/autocontribuzioni', ApisanVaccinazioniController::class . ':autocontribution');
    $this->any('/{routes:.+}', ApisanVaccinazioniController::class . ':proxy');
});