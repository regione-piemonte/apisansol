<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

require_once __DIR__ . '/../config/config.php';
require __DIR__ . '/../vendor/autoload.php';

//session_start([
//    'name' => 'LMS_BFF_SESSION_ID',
//    'cookie_secure' => IS_DEVELOPMENT ? false : true,
//    'cookie_httponly' => true,
//    // A noi interessa solamente l'id della sessione per
//    // tracciare anche le sessioni degli utenti anonimi.
//    // Decommentare o impostare a false questo valore significa
//    // rallentare SIGNIFICATIVAMENTE l'applicazione perché
//    // chiamate AJAX parallele relative alla stessa sessione in realtà si accodano
//    'read_and_close'  => true,
//]);

// Instantiate the app
$settings = require __DIR__ . '/../src/app/settings.php';
$app = new \Slim\App($settings);

// Set up dependencies
require __DIR__ . '/../src/app/dependencies.php';

// Register middleware
require __DIR__ . '/../src/app/middleware.php';

// Register routes
require __DIR__ . '/../src/app/routes.php';

// Run app
$app->run();