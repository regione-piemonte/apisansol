<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanRicController;

$app->group('/apisanpresc/ricette', function () {
    $this->get('/api/v1/stati-ricette', ApisanRicController::class . ':stati_ricette');
    $this->get('/api/v1/tipologie-ricette', ApisanRicController::class . ':tipologie_ricette');
    $this->any('/{routes:.+}', ApisanRicController::class . ':proxy');
});



