<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanAssistenzaController;
use Csi\Controllers\LmsCmsController;

$app->group('/apisanassistenza', function () {
    $this->any('/{routes:.+}', ApisanAssistenzaController::class . ':proxy');
});

$app->group('/cms', function () {
    $this->any('/{routes:.+}', LmsCmsController::class . ':proxy');
});