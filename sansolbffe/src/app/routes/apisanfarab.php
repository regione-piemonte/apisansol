<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanFarabController;

$app->group('/apisanfarm', function () {
    $this->any('/{routes:.+}', ApisanFarabController::class . ':proxy');
});


