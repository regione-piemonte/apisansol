<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanRiscreController;

$app->group('/apisanscreen', function () {
    $this->any('/geocoding', ApisanRiscreController::class . ':geocoding');
    $this->get('/api/v1/cittadini/{cit_id}/documenti/{documento_id}', ApisanRiscreController::class . ':download_document');
    $this->any('/{routes:.+}', ApisanRiscreController::class . ':proxy');
});



