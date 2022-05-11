<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\NotifyMessageStoreController;

$app->group('/notify-messagestore', function () {
    $this->get('/api/v1/users/{taxCode}/messages-lms', NotifyMessageStoreController::class . ':getList');
    $this->get('/api/v1/users/{taxCode}/messages-unseen', NotifyMessageStoreController::class . ':getUnseen');
    $this->put('/api/v1/users/{taxCode}/messages-unseen', NotifyMessageStoreController::class . ':setUnseen');
    $this->any('/{routes:.+}', NotifyMessageStoreController::class . ':proxy');
});