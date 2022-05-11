<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// @see https://www.slimframework.com/docs/v3/objects/application.html#application-configuration
$config = [
    'settings' => [
        'httpVersion' => '1.1', // Default: '1.1'
        'responseChunkSize' => IS_DEVELOPMENT ? 32768 : 4096, // Default: 4096
        'outputBuffering' => 'append', // Default: 'append'
        'determineRouteBeforeAppMiddleware' => false, // Default: false
        'displayErrorDetails' => IS_PRODUCTION ? false : true, // Default: false
        'addContentLengthHeader' => false, // Default: true
        'routerCacheFile' => false, // Default: false
    ],
];


return $config;