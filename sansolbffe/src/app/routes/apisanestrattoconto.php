<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanFfeController;
use Csi\Middleware\ResponsePdfErrorMiddleware;

$app->group('/apisanffe', function () {
    $this->post('/api/v1/cittadini/{cit_id}/ticket-pagati/{ticket_id}/richiesta-rimborso/pdf', ApisanFfeController::class . ':getRefundDocuments')->add(new ResponsePdfErrorMiddleware());
    $this->any('/{routes:.+}', ApisanFfeController::class . ':proxy');

});