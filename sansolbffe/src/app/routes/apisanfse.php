<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanFseController;
use Csi\Controllers\ApisanTacController;
use Csi\Middleware\ResponsePdfErrorMiddleware;

$app->group('/apisantacc', function () {
    $this->any('/{routes:.+}', ApisanTacController::class . ':proxy');
});

$app->group('/apisanfse', function () {
    $this->post('/{routes:.+}/stampe/accessi', ApisanFseController::class. ':accessListPdf')->add(new ResponsePdfErrorMiddleware());
    $this->get('/{routes:.+}/documenti/{documentId}/documento', ApisanFseController::class. ':documentPdf')->add(new ResponsePdfErrorMiddleware());
    $this->get('/{routes:.+}/documenti/{documentId}/documento-personale', ApisanFseController::class. ':documentPersonalPdf')->add(new ResponsePdfErrorMiddleware());
    $this->get('/{routes:.+}/referti/pdf', ApisanFseController::class. ':proxy')->add(new ResponsePdfErrorMiddleware());
    $this->get('/{routes:.+}/referti/{idreferto}/pdf', ApisanFseController::class. ':reportPdf')->add(new ResponsePdfErrorMiddleware());
    $this->get('/{routes:.+}/informativa-ultima/pdf', ApisanFseController::class. ':lastPolicyPdf')->add(new ResponsePdfErrorMiddleware());
    $this->any('/{routes:.+}', ApisanFseController::class . ':proxy');
});