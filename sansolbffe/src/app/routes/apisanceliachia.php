<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanCeliachiaController;

$app->group('/apisanceliachia', function () {
    $this->any('/{routes:.+}', ApisanCeliachiaController::class . ':proxy');
});