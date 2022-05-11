<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\BffController;
use Csi\Controllers\FrontEndConfigController;
use Csi\Controllers\OtpController;

$app->group('/bff', function () {

    // SESSION
    $this->get('/login[/{path:.*}]', BffController::class . ':login');
    $this->get('/logout', BffController::class . ':logout');
    $this->get('/identity', BffController::class . ':identity');

    // OTP
    $this->post('/otp', OtpController::class . ':generate');
    $this->get('/otp/verify', OtpController::class . ':verify');
    $this->get('/otp/channels/sms/attempts-left', OtpController::class . ':attemptsLeft');

    // CONFIG FRONT-END
    $this->get('/apps', FrontEndConfigController::class . ':getFrontEndConfigList');
    $this->post('/apps', FrontEndConfigController::class . ':postFrontEndConfig');
    $this->get('/apps/{nome_app}', FrontEndConfigController::class . ':getFrontEndConfig');
    $this->put('/apps/{nome_app}', FrontEndConfigController::class . ':putFrontEndConfig');
    $this->delete('/apps/{nome_app}', FrontEndConfigController::class . ':deleteFrontEndConfig');
});


