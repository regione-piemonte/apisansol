<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// ENVIRONMENT DETECTION
// ---------------------------------------------------------------------------------------------------------------------
const ENVIRONMENT_DEV = 'development';
const ENVIRONMENT_TEST = 'test';
const ENVIRONMENT_TEST_CERT = 'test-cert';
const ENVIRONMENT_TEST_COLL = 'test-coll';
const ENVIRONMENT_TEST_NIV = 'test-niv';
const ENVIRONMENT_ALPHA = 'alpha';
const ENVIRONMENT_ALPHA_CERT = 'alpha-cert';
const ENVIRONMENT_PROD = 'prod';
const ENVIRONMENT_PROD_NIV = 'prod-niv';

// Stabiliamo prima di tutto l'ambiente su cui l'applicativo sta girando
if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false
    || strpos($_SERVER['SERVER_SOFTWARE'], 'Development Server') !== false) {

    define('ENVIRONMENT', ENVIRONMENT_DEV);

} elseif (strpos($_SERVER['HTTP_HOST'], 'tst-') !== false) {

    if (strpos($_SERVER['HTTP_REFERER'] ?? '', '-cert') !== false) {
        define('ENVIRONMENT', ENVIRONMENT_TEST_CERT);
    } elseif (strpos($_SERVER['HTTP_REFERER'] ?? '', 'ptw-rimborsi') !== false) {
        define('ENVIRONMENT', ENVIRONMENT_TEST_CERT);
    } elseif (strpos($_SERVER['HTTP_REFERER'] ?? '', '-coll') !== false) {
        define('ENVIRONMENT', ENVIRONMENT_TEST_COLL);
    } else {
        define('ENVIRONMENT', ENVIRONMENT_TEST);
    }

} elseif (strpos($_SERVER['HTTP_HOST'], 'ts-') !== false) { // NIVOLA TEST

    define('ENVIRONMENT', ENVIRONMENT_TEST_NIV);

} elseif (strpos($_SERVER['HTTP_REFERER'] ?? '', '-alpha') !== false) {

    if (strpos($_SERVER['HTTP_REFERER'], '-cert') !== false) {
        define('ENVIRONMENT', ENVIRONMENT_ALPHA_CERT);
    } else {
        define('ENVIRONMENT', ENVIRONMENT_ALPHA);
    }

} else {

    // var_dump($_SERVER['SERVER_NAME']);
    if (strpos($_SERVER['SERVER_NAME'] ?? '', 'nivolapiemonte') !== false) {
        define('ENVIRONMENT', ENVIRONMENT_PROD_NIV);
    } else {
        define('ENVIRONMENT', ENVIRONMENT_PROD);
    }

}

define('IS_DEVELOPMENT', ENVIRONMENT === ENVIRONMENT_DEV);
define('IS_TEST', ENVIRONMENT === ENVIRONMENT_TEST);
define('IS_TEST_CERT', ENVIRONMENT === ENVIRONMENT_TEST_CERT);
define('IS_TEST_NIV', ENVIRONMENT === ENVIRONMENT_TEST_NIV);
define('IS_ALPHA', ENVIRONMENT === ENVIRONMENT_ALPHA);
define('IS_ALPHA_CERT', ENVIRONMENT === ENVIRONMENT_ALPHA_CERT);
define('IS_PRODUCTION', ENVIRONMENT === ENVIRONMENT_PROD);
define('IS_PRODUCTION_NIV', ENVIRONMENT === ENVIRONMENT_PROD_NIV);

// CARICAMENTO CONFIGURAZIONI E MONKEY PATCHES
// ---------------------------------------------------------------------------------------------------------------------
require_once __DIR__ . '/common.php';

switch (ENVIRONMENT) {
    case ENVIRONMENT_DEV:
        require_once __DIR__ . '/dev.php';
        break;
    case ENVIRONMENT_TEST:
        require_once __DIR__ . '/test.php';
        break;
    case ENVIRONMENT_TEST_CERT:
        require_once __DIR__ . '/testCert.php';
        break;
    case ENVIRONMENT_TEST_COLL:
        require_once __DIR__ . '/testColl.php';
        break;
    case ENVIRONMENT_TEST_NIV:
        require_once __DIR__ . '/testNiv.php';
        break;
    case ENVIRONMENT_ALPHA:
        require_once __DIR__ . '/alpha.php';
        break;
    case ENVIRONMENT_ALPHA_CERT:
        require_once __DIR__ . '/alphaCert.php';
        break;
    case ENVIRONMENT_PROD:
        require_once __DIR__ . '/prod.php';
        break;
    case ENVIRONMENT_PROD_NIV:
        require_once __DIR__ . '/prodNiv.php';
        break;
}
