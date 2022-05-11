<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanScerevController;

$app->group('/apisanscerev', function () {
    $this->get('/api/v1/disclaimer', ApisanScerevController::class . ':disclaimer');
    $this->any('/api/v1/medici/_search', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/api/v1/ambulatori', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/api/v1/medici/{id}', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/api/v1/medici/{id}/associazioni', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/api/v1/cittadinanze', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/api/v1/motivazioni-domicilio', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/api/v1/tipologie-medico', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/api/v1/disponibilita', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/api/v1/cittadini/{cit_id}/tesserino-medico/pdf', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/cittadini/{cit_id}/cambio-medico/richiesta/{richiesta_id}/rettifica', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/cittadini/{cit_id}/info/richiesta-cambio', ApisanScerevController::class . ':proxyNoMocks');
    $this->any('/cittadini/{cit_id}/medico', ApisanScerevController::class . ':proxyNoMocks');
    $this->post('/api/v1/cittadini/{cit_id}/modulo-delegante/pdf', ApisanScerevController::class . ':getDelegatorPdf');
    $this->any('/{routes:.+}', ApisanScerevController::class . ':proxy');
});


