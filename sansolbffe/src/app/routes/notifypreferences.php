<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\NotifyPreferencesController;

$app->group('/notify-preferences', function () {
    $this->any('/{routes:.+}', NotifyPreferencesController::class . ':proxy');
});