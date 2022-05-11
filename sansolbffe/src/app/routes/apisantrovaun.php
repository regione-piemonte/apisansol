<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanTrovaUnController;

$app->group('/apisantrovaun', function () {
    $this->get('/api/v1/tipologie-ospedale', ApisanTrovaUnController::class . ':tipologieOspedale');
    $this->get('/api/v1/tipologie-assistenza', ApisanTrovaUnController::class . ':tipologieAssistenza');
    $this->get('/api/v1/tipologie-punto-vendita', ApisanTrovaUnController::class . ':tipologiePuntiVendita');
    $this->any('/{routes:.+}', ApisanTrovaUnController::class . ':proxy');
});



