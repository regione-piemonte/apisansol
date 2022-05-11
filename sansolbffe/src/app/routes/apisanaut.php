<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanAutController;

$app->group('/apisanaut', function () {
    $this->any('/{routes:.+}', ApisanAutController::class . ':proxy');
});