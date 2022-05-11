<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanConsensiController;

$app->group('/apisancons', function () {
    $this->any('/{routes:.+}', ApisanConsensiController::class . ':proxy');
});