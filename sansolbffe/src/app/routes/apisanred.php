<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanRedController;

$app->group('/apisanesen', function () {
    $this->any('/api/v1/cittadini/{cf}/esenzioni/{id}/pdf', ApisanRedController::class . ':exemptionPdf');
    $this->any('/{routes:.+}', ApisanRedController::class . ':proxy');
});
