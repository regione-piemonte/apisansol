<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanProfController;

$app->group('/apisanprof', function () {
    $this->any('/{routes:.+}/verifica-team', ApisanProfController::class . ':verifyTeam');
    $this->any('/{routes:.+}', ApisanProfController::class . ':proxy');
});
