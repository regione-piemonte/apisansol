<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\NotifyMessageBrokerController;

// @TODO cambiare in 'notify-mb' quando il servizio sarà disponibile
//$app->group('/notify-mb', function () {
$app->group('/redis-wrapper', function () {
    $this->any('/{routes:.+}', NotifyMessageBrokerController::class . ':proxy');
});