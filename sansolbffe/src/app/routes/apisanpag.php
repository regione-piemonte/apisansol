<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanPagController;

$app->group('/apisanpag', function () {

    // @NOTE: Scorciatoia per ottenere una lista di ASR con i dati necessari al client nella fase di
    //        integrazione mista delle ASL
    $this->get('/api/v1/asr-temp', ApisanPagController::class . ':asrTemp');
    $this->get('/api/v1/captcha-temp', ApisanPagController::class . ':captchaTemp');
    $this->get('/api/v1/promemoria-stampabili', ApisanPagController::class . ':printableReminderTemp');

    // Gestione avviso di pagamento
    $this->get('/api/v1/utenti/{cf}/avviso-pagamento/{npr}', ApisanPagController::class . ':paymentReminder');

    // PROXY
    $this->any('/{routes:.+}', ApisanPagController::class . ':proxy');

});
