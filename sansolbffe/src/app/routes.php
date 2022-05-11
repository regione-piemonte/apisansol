<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

// REGISTRAZIONE DELLE ROUTES
// ---------------------------------------------------------------------------------------------------------------------
require_once __DIR__ . '/routes/bff.php';
require_once __DIR__ . '/routes/lms.php';

require_once __DIR__ . '/routes/apisancross.php';
require_once __DIR__ . '/routes/apisanprof.php';
require_once __DIR__ . '/routes/apisanfse.php';
require_once __DIR__ . '/routes/apisanpag.php';
require_once __DIR__ . '/routes/apisanaut.php';
require_once __DIR__ . '/routes/apisanric.php';

require_once __DIR__ . '/routes/notifymb.php';
require_once __DIR__ . '/routes/notifymessagestore.php';
require_once __DIR__ . '/routes/notifypreferences.php';

require_once __DIR__ . '/routes/apisanred.php';
require_once __DIR__ . '/routes/apisanconsensi.php';

require_once __DIR__ . '/routes/apisanvaccinazioni.php';
require_once __DIR__ . '/routes/apisanpat.php';
require_once __DIR__ . '/routes/apisanscerev.php';
require_once __DIR__ . '/routes/apisanriscre.php';
require_once __DIR__ . '/routes/apisantrovaun.php';
require_once __DIR__ . '/routes/apisanceliachia.php';
require_once __DIR__ . '/routes/apisanestrattoconto.php';
require_once __DIR__ . '/routes/apisanassistenza.php';
require_once __DIR__ . '/routes/apisanfarab.php';

require_once __DIR__ . '/routes/covid.php';

// Permette di verificare che il BFF sia up and running
$app->any('/is-alive', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {
    return $response->withStatus(200)->withJson('OK');
});

// Permette di zippare tutti i log di "ieri" e rimuove tutti i file zippati
$app->get('/logs-zip', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {

    $date = \Carbon\Carbon::yesterday()->toDateString();

    $zipFilename = $date . '.zip';
    $zipFilepath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $zipFilename]);

    $globPattern = '*-' . $date . '.log';
    $globPattern = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $globPattern]);
    $globOptions = [
        'remove_all_path' => true
    ];

    $glob = glob($globPattern);

    if ($glob !== false) {
        foreach ($glob as $filename) {
            $zip = new ZipArchive();
            $zip->open($filename . '.zip', ZipArchive::CREATE);
            $zip->addFile($filename);
            $zip->close();
        }
    }


//    $zip = new ZipArchive();
//    $zip->open($zipFilepath, ZipArchive::CREATE);
//    $files = $zip->addGlob($globPattern, GLOB_ERR, $globOptions);
//    $zip->close();
//
//    // Una volta completato lo ZIP cancelliamo i file zippati
//    if ($files != false) {
//        foreach ($files as $file) {
//            if (is_file($file)) {
//                unlink($file);
//            }
//        }
//    }

    return $response->withStatus(200)->withJson('OK');
});

// Permette di zippare tutti i log di "ieri" e rimuove tutti i file zippati
$app->get('/logs-zip/access', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {

    $date = \Carbon\Carbon::yesterday()->toDateString();

    $zipFilename = 'access-' . $date . '.zip';
    $zipFilepath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $zipFilename]);

    $fileName = 'access-' . $date . '.log';
    $filePath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $fileName]);

    $zip = new ZipArchive();
    $zip->open($zipFilepath, ZipArchive::CREATE);
    $zip->addFile($filePath, $fileName);
    $zip->close();

    // Una volta completato lo ZIP cancelliamo i file zippati
    if (is_file($filePath)) {
        // rename($filePath, $filePath . '.bck');
        unlink($filePath);
    }

    return $response->withStatus(200)->withJson('OK');
});

$app->get('/logs-zip/error', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {

    $date = \Carbon\Carbon::yesterday()->toDateString();

    $zipFilename = 'error-' . $date . '.zip';
    $zipFilepath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $zipFilename]);

    $fileName = 'error-' . $date . '.log';
    $filePath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $fileName]);

    $zip = new ZipArchive();
    $zip->open($zipFilepath, ZipArchive::CREATE);
    $zip->addFile($filePath, $fileName);
    $zip->close();

    // Una volta completato lo ZIP cancelliamo i file zippati
    if (is_file($filePath)) {
        // rename($filePath, $filePath . '.bck');
        unlink($filePath);
    }

    return $response->withStatus(200)->withJson('OK');
});

$app->get('/logs-zip/json', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {

    $date = \Carbon\Carbon::yesterday()->toDateString();

    $zipFilename = 'json-' . $date . '.zip';
    $zipFilepath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $zipFilename]);

    $fileName = 'json-' . $date . '.log';
    $filePath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $fileName]);

    $zip = new ZipArchive();
    $zip->open($zipFilepath, ZipArchive::CREATE);
    $zip->addFile($filePath, $fileName);
    $zip->close();

    // Una volta completato lo ZIP cancelliamo i file zippati
    if (is_file($filePath)) {
        // rename($filePath, $filePath . '.bck');
        unlink($filePath);
    }

    return $response->withStatus(200)->withJson('OK');
});

$app->get('/logs-zip/request', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {

    $date = \Carbon\Carbon::yesterday()->toDateString();

    $zipFilename = 'request-' . $date . '.zip';
    $zipFilepath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $zipFilename]);

    $fileName = 'request-' . $date . '.log';
    $filePath = implode(DIRECTORY_SEPARATOR, [LOG_ROOT, $fileName]);

    $zip = new ZipArchive();
    $zip->open($zipFilepath, ZipArchive::CREATE);
    $zip->addFile($filePath, $fileName);
    $zip->close();

    // Una volta completato lo ZIP cancelliamo i file zippati
    if (is_file($filePath)) {
        // rename($filePath, $filePath . '.bck');
        unlink($filePath);
    }

    return $response->withStatus(200)->withJson('OK');
});

$app->get('/logs-zip/cron-renew', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {

    $TOKEN = '47a022797589ccd79bfe07d1690222fe';
    $URL_DISABLE = 'https://www.easycron.com/rest/disable';
    $URL_ENABLE = 'https://www.easycron.com/rest/enable';
    $CRON_ID_ZIP_JSON = 3035208;
    $CRON_ID_ZIP_REQUEST = 3035210;
    $CRON_ID_ZIP_ACCESS = 2993676;
    $CRON_ID_ZIP_ERROR = 3035206;

    $client = new GuzzleHttp\Client(['verify' => false, 'proxy' => PROXY]);

    $client->request('GET', $URL_DISABLE, ['query' => ['token' => $TOKEN, 'id' => $CRON_ID_ZIP_JSON]]);
    $client->request('GET', $URL_DISABLE, ['query' => ['token' => $TOKEN, 'id' => $CRON_ID_ZIP_REQUEST]]);
    $client->request('GET', $URL_DISABLE, ['query' => ['token' => $TOKEN, 'id' => $CRON_ID_ZIP_ACCESS]]);
    $client->request('GET', $URL_DISABLE, ['query' => ['token' => $TOKEN, 'id' => $CRON_ID_ZIP_ERROR]]);

    usleep(1500);

    $client->request('GET', $URL_ENABLE, ['query' => ['token' => $TOKEN, 'id' => $CRON_ID_ZIP_JSON]]);
    $client->request('GET', $URL_ENABLE, ['query' => ['token' => $TOKEN, 'id' => $CRON_ID_ZIP_REQUEST]]);
    $client->request('GET', $URL_ENABLE, ['query' => ['token' => $TOKEN, 'id' => $CRON_ID_ZIP_ACCESS]]);
    $client->request('GET', $URL_ENABLE, ['query' => ['token' => $TOKEN, 'id' => $CRON_ID_ZIP_ERROR]]);

    return $response->withStatus(200)->withJson('OK');
});

$app->get('/logs-zip/clean', function (ServerRequestInterface $request, ResponseInterface $response, array $args) {

    // $minDate = \Carbon\Carbon::now()->subMonths(1)->startOfDay();
    $minDate = \Carbon\Carbon::now()->subDays(14)->startOfDay();
    $fileSystemIterator = new FilesystemIterator(LOG_ROOT);

    $deletedList = [];

    foreach ($fileSystemIterator as $fileInfo) {
        if ($fileInfo->getExtension() !== 'zip') {
            continue;
        }

        $filename = $fileInfo->getFilename();
        // echo $filename;
        $fileDate = $filename;
        $fileDate = ltrim($fileDate, 'access-');
        $fileDate = ltrim($fileDate, 'error-');
        $fileDate = ltrim($fileDate, 'json-');
        $fileDate = ltrim($fileDate, 'request-');
        $fileDate = rtrim($fileDate, '.zip');
        // $fileDate = rtrim($fileDate, '.log');

        try {
            $fileDate = \Carbon\Carbon::createFromFormat('Y-m-d', $fileDate);
            if ($fileDate->lessThan($minDate)) {
                $deletedList[] = $fileInfo->getRealPath();
                unlink($fileInfo->getRealPath());
            }
        } catch (Exception $exception) {

        }

    }


    return $response->withStatus(200)->withJson($deletedList);
});