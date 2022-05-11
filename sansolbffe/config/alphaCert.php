<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

const DEBUG = false;
// Stabilisce se le chiamate forwardate ai back-end devono passare attraverso un proxy o meno
const USE_PROXY = true;
// Attiva/Disattiva la normalizzazione degli header della request
const HEADER_NORMALIZE = true;
// Permette di attivare/disattivare la possibilità di utilizzare i back-end di mocks
const MOCKS_ENABLED = false;

// CORS
// ---------------------------------------------------------------------------------------------------------------------
// Abilita/Disabilita la gestione dei CORS
// @see https://developer.mozilla.org/it/docs/Web/HTTP/CORS
// @see https://www.html5rocks.com/en/tutorials/cors/
const CORS_ENABLED = true;
// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
const CORS_ALLOWED_ORIGINS = ['CORS_ALLOWED_ORIGINS'];

// AUTH
// ---------------------------------------------------------------------------------------------------------------------
// Abilita/Disabilita il login automatico. Utile in fase di sviluppo
const AUTH_AUTO = false;
// Concede/Inibisce al client la possibilità di impostare l'utente loggato direttamente nella request. Utile per debug
const AUTH_OVERRIDABLE = true;
// Indica quali utenti possono usufruire della funzionalità "Simula utente"
const AUTH_OVERRIDABLE_WHITELIST_USER = [
];
// Indica quali applicativi possono usufruire della funzionalità "Simula utente"
const AUTH_OVERRIDABLE_WHITELIST_APPLICATION = [];

// MATOMO
// ---------------------------------------------------------------------------------------------------------------------
const MATOMO_SCHEMA = 'SCHEMA';
const MATOMO_HOST = 'HOST';
const MATOMO_PATH = 'PATH';
const MATOMO_SITE_ID = 999999;
const MATOMO_AUTH_TOKEN = 'TOKEN';

// LOGS
// ---------------------------------------------------------------------------------------------------------------------
// Abilita/Disabilita i log
const LOG = true;
define('LOG_ROOT', implode(DIRECTORY_SEPARATOR, [PATH_VH_ROOT, 'app', 'logs', 'la-mia-salute-alpha-cert', 'bff']));
const LOGS_IGNORABLE_USERS = [];

// Abilita/Disablita i log delle cURL
const LOG_CURL = true;
define('LOG_CURL_FILE_PATH', implode(DIRECTORY_SEPARATOR, [LOG_ROOT, 'request.log']));
const LOG_CURL_CHANNEL = 'request';
const LOG_CURL_MAX_FILES = 3;
const LOG_CURL_PAYLOAD = true;

// Abilita/Disablita i log degli accessi
const LOG_ACCESS = true;
define('LOG_ACCESS_FILE_PATH', implode(DIRECTORY_SEPARATOR, [LOG_ROOT, 'access.log']));
const LOG_ACCESS_CHANNEL = 'access';
const LOG_ACCESS_MAX_FILES = 3;

// Abilita/Disablita i log degli errori
const LOG_ERROR = true;
define('LOG_ERROR_FILE_PATH', implode(DIRECTORY_SEPARATOR, [LOG_ROOT, 'error.log']));
const LOG_ERROR_CHANNEL = 'error';
const LOG_ERROR_MAX_FILES = 3;
const LOG_ERROR_PAYLOAD = true;
const LOG_ERROR_BODY = true;

// Abilita/Disablita i log dei JSON
const LOG_JSON = true;
define('LOG_JSON_FILE_PATH', implode(DIRECTORY_SEPARATOR, [LOG_ROOT, 'json.log']));
const LOG_JSON_CHANNEL = 'json';
const LOG_JSON_MAX_FILES = 3;
const LOG_JSON_PAYLOAD = true;
const LOG_JSON_PAYLOAD_ON_ERROR = true;
const LOG_JSON_COOKIES = true;
const LOG_JSON_COOKIES_ON_ERROR = true;
const LOG_JSON_BODY = true;
const LOG_JSON_BODY_ON_ERROR = true;

// DATABASE
// ---------------------------------------------------------------------------------------------------------------------
const DB_TYPE = 'mysql';
const DB_NAME = 'NAME';
const DB_USER = 'USER';
const DB_PASS = 'PASS';
const DB_HOST = 'HOST';
const DB_PORT = 'PORT';
const DB_TABLE_PREFIX = '';
const DB_CHARSET = 'utf8';

// CONFIGURAZIONE SHIBBOLETH
// ---------------------------------------------------------------------------------------------------------------------
const SHIBBOLETH_LOGOUT_URL = 'URL';

// CONFIGURAZIONE API
// ---------------------------------------------------------------------------------------------------------------------
const MOCKS_SCHEME = 'SCHEME';
const MOCKS_HOST = 'HOST';
const MOCKS_PORT = null;

// CMS PORTALE
const CMS_SCHEME = 'SCHEME';
const CMS_HOST = 'HOST';
const CMS_PORT = null;

// COVID
const COVID_SCHEME = 'SCHEME';
const COVID_HOST = 'HOST';
const COVID_PORT = null;
const COVID_USER = 'USER';
const COVID_PASS = 'PASS';

// MEZZI PUBBLICI
const PUBLIC_TRANSPORT_SCHEME = 'SCHEME';
const PUBLIC_TRANSPORT_HOST = 'HOST';
const PUBLIC_TRANSPORT_PORT = null;

// API TRASVERSALI
const APISANCROSS_SCHEME = 'SCHEME';
const APISANCROSS_HOST = 'HOST';
const APISANCROSS_PORT = null;
const APISANCROSS_USER = 'USER';
const APISANCROSS_PASS = 'PASS';

// PROFILO UTENTE
const APISANPROF_SCHEME = 'SCHEME';
const APISANPROF_HOST = 'HOST';
const APISANPROF_PORT = null;
const APISANPROF_USER = 'USER';
const APISANPROF_PASS = 'PASS';

// ROL, ARRUOLAMENTO e CONSENSO
const APISANFSE_SCHEME = 'SCHEME';
const APISANFSE_HOST = 'HOST';
const APISANFSE_PORT = null;
const APISANFSE_USER = 'USER';
const APISANFSE_PASS = 'PASS';

// TACCUINO
const APISANTAC_SCHEME = 'SCHEME';
const APISANTAC_HOST = 'HOST';
const APISANTAC_PORT = null;
const APISANTAC_USER = 'USER';
const APISANTAC_PASS = 'PASS';

// PAGAMENTO TICKET
const APISANPAG_SCHEME = 'SCHEME';
const APISANPAG_HOST = 'HOST';
const APISANPAG_PORT = null;
const APISANPAG_USER = 'USER';
const APISANPAG_PASS = 'PASS';

// DELEGHE
const APISANAUT_SCHEME = 'SCHEME';
const APISANAUT_HOST = 'HOST';
const APISANAUT_PORT = null;
const APISANAUT_USER = 'USER';
const APISANAUT_PASS = 'PASS';

// RICETTE
const APISANRIC_SCHEME = 'SCHEME';
const APISANRIC_HOST = 'HOST';
const APISANRIC_PORT = null;
const APISANRIC_USER = 'USER';
const APISANRIC_PASS = 'PASS';
// JSON statici per API verde/rosso
const TIPOLOGIE_RICETTE = 'URL';
const STATI_RICETTE = 'URL';

// ESENZIONI DA REDDITO
const APISANESENRED_SCHEME = 'SCHEME';
const APISANESENRED_HOST = 'HOST';
const APISANESENRED_PORT = null;
const APISANESENRED_USER = 'USER';
const APISANESENRED_PASS = 'PASS';

// CONSENSI
const APISANCONS_SCHEME = 'SCHEME';
const APISANCONS_HOST = 'HOST';
const APISANCONS_PORT = null;
const APISANCONS_USER = 'USER';
const APISANCONS_PASS = 'PASS';

// ESENZIONI PER PATOLOGIE
const APISANESENPAT_SCHEME = 'SCHEME';
const APISANESENPAT_HOST = 'HOST';
const APISANESENPAT_PORT = null;
const APISANESENPAT_USER = 'USER';
const APISANESENPAT_PASS = 'PASS';
// JSON statici per API verde/rosso
const TIPOLOGIE_DOCUMENTI = 'URL';
const TIPOLOGIE_ESENZIONE = 'URL';
const STATI_ESENZIONE = 'URL';
const MOTIVAZIONI_ANNULLAMENTO = 'URL';
const MOTIVAZIONI_REVOCA = 'URL';
const DISCLAIMER_MALATTIE_RARE = 'URL';
const DISCLAIMER_TRATTAMENTO_DATI = 'URL';
const DOCUMENTO_TIPOLOGIE_IN = 'URL';
const DOCUMENTO_TIPOLOGIE_MC = 'URL';
const DOCUMENTO_TIPOLOGIE_MR = 'URL';
const DIAGNOSI_MR = 'URL';
const DIAGNOSI_IN = 'URL';
const DIAGNOSI_MC = 'URL';
const DIAGNOSI_AL = 'URL';
const ESENZIONI_AL = 'URL';
const ESENZIONI_MR = 'URL';
const ESENZIONI_MC = 'URL';
const ESENZIONI_IN = 'URL';
const TIPOLOGIE_INVALIDITA = 'URL';


// VACCINAZIONI
const APISANVAC_SCHEME = 'SCHEME';
const APISANVAC_HOST = 'HOST';
const APISANVAC_PORT = null;
const APISANVAC_USER = 'USER';
const APISANVAC_PASS = 'PASS';

// CAMBIO MEDICO
const APISANSCEREV_SCHEME = 'SCHEME';
const APISANSCEREV_HOST = 'HOST';
const APISANSCEREV_PORT = null;
const APISANSCEREV_USER = 'USER';
const APISANSCEREV_PASS = 'PASS';
const DISCLAIMER_SCEREV = 'URL';

// PREVENZIONE SERENA (SCREENING)
const APISANRISCRE_SCHEME = 'SCHEME';
const APISANRISCRE_HOST = 'HOST';
const APISANRISCRE_PORT = null;
const APISANRISCRE_USER = 'USER';
const APISANRISCRE_PASS = 'PASS';

// CELIACHIA
const APISANCELIACHIA_SCHEME = 'SCHEME';
const APISANCELIACHIA_HOST = 'HOST';
const APISANCELIACHIA_PORT = null;
const APISANCELIACHIA_USER = 'USER';
const APISANCELIACHIA_PASS = 'PASS';

// ESTRATTO CONTO
const APISANFFE_SCHEME = 'SCHEME';
const APISANFFE_HOST = 'HOST';
const APISANFFE_PORT = null;
const APISANFFE_USER = 'USER';
const APISANFFE_PASS = 'PASS';

// FARMACIA ABITUALE
const APISANFARAB_SCHEME = 'SCHEME';
const APISANFARAB_HOST = 'HOST';
const APISANFARAB_PORT = null;
const APISANFARAB_USER = 'USER';
const APISANFARAB_PASS = 'PASS';

// TROVA UN
const APISANTROVAUN_SCHEME = 'SCHEME';
const APISANTROVAUN_HOST = 'HOST';
const APISANTROVAUN_PORT = null;
const APISANTROVAUN_USER = 'USER';
const APISANTROVAUN_PASS = 'PASS';
const URL_JSON_TIPOLOGIE_OSPEDALE = 'URL';
const URL_JSON_TIPOLOGIE_ASSISTENZA = 'URL';
const URL_JSON_TIPOLOGIE_PUNTI_VENDITA = 'URL';

// NOTIFICATORE
const NOTIFY_MESSAGE_BROKER_SCHEME = 'SCHEME';
const NOTIFY_MESSAGE_BROKER_HOST = 'HOST';
const NOTIFY_MESSAGE_BROKER_PORT = null;
const NOTIFY_MESSAGE_BROKER_BASE_PATH = 'PATH';

const NOTIFY_PREFERENCES_SCHEME = 'SCHEME';
const NOTIFY_PREFERENCES_HOST = 'HOST';
const NOTIFY_PREFERENCES_PORT = null;

const NOTIFY_MESSAGE_STORE_SCHEME = 'SCHEME';
const NOTIFY_MESSAGE_STORE_HOST = 'HOST';
const NOTIFY_MESSAGE_STORE_PORT = null;

const NOTIFY_AUTH_JWT= 'JWT';
const NOTIFY_EMAIL_TEMPLATE_ID = 'ID';

// PTW
// ---------------------------------------------------------------------------------------------------------------------
const PTW = [
    'ASR_LIST' => [
        [
            'id' => 203,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'ASL TO3 (Distretti Pinerolo, Val Susa-Val Sangone, Area Metropolitana Nord-Centro-Sud)',
            'tipologia'=> 'ASL'
        ],
        [
            'id' => 204,
            'nuovo' => true,
            'nre_attivo' => true,
            'descrizione' => 'ASL TO4 (Distretti di Ciriè, Chivasso-San Mauro, Settimo Torinese, Ivrea, Cuorgnè)',
            'tipologia'=> 'ASL'
        ],
        [
            'id' => 205,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'ASL TO5 (Chieri, Carmagnola, Moncalieri, Nichelino)',
            'tipologia'=> 'ASL'
        ],
        [
            'id' => 206,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'ASL Vc (Vercelli)',
            'tipologia'=> 'ASL'
        ],
        ['id' => 207, 'nuovo' => true, 'nre_attivo' => true, 'descrizione' => 'ASL BI (Biella)', 'tipologia'=> 'ASL'],
        ['id' => 208, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL NO (Novara)', 'tipologia'=> 'ASL'],
        ['id' => 209, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL VCO (Verbano Cusio Ossola)', 'tipologia'=> 'ASL'],
        [
            'id' => 210,
            'nuovo' => true,
            'nre_attivo' => true,
            'descrizione' => 'ASL CN1 (Cuneo, Borgo S.Dalmazzo-Dronero, Mondovì, Ceva, Savigliano-Fossano, Saluzzo)',
            'tipologia'=> 'ASL'
        ],
        ['id' => 211, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL CN2 (Alba e Bra)', 'tipologia'=> 'ASL'],
        [
            'id' => 212,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'ASL AT (Asti Centro, Asti Nord, Asti Sud)',
            'tipologia'=> 'ASL'
        ],
        ['id' => 213, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL AL (Alessandria)', 'tipologia'=> 'ASL'],
        [
            'id' => 301,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'ASL Città di TORINO (ex Asl To1, Asl To2)',
            'tipologia'=> 'ASL'
        ],
        [
            'id' => 904,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera Universitaria "San Luigi" di Orbassano',
            'tipologia'=> 'ASO'
        ],
        [
            'id' => 905,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera Universitaria "Maggiore della Carità" di Novara',
            'tipologia'=> 'ASO'
        ],
        [
            'id' => 906,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera "Santa Croce" di Cuneo',
            'tipologia'=> 'ASO'
        ],
        [
            'id' => 907,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera "Ss. Antonio e Biagio e Cesare Arrigo" di Alessandria',
            'tipologia'=> 'ASO'
        ],
        [
            'id' => 908,
            'nuovo' => true,
            'nre_attivo' => true,
            'descrizione' => 'Azienda Ospedaliera "Ordine Mauriziano" di Torino',
            'tipologia'=> 'ASO'
        ],
        [
            'id' => 909,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera Universitaria "Città della Salute e della Scienza" di Torino',
            'tipologia'=> 'ASO'
        ],
        [
            'id' => 996,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'COQ - Centro Ortopedico di Quadrante',
            'tipologia'=> 'ASO'
        ],
    ]
];

const PTW_PRINTABLE_REMINDER = [
    ["asr_id" => 204, "prefisso" => "L20405"],
    ["asr_id" => 204, "prefisso" => "R20401"],
    ["asr_id" => 204, "prefisso" => "R20410"],
    ["asr_id" => 204, "prefisso" => "R20420"],
    ["asr_id" => 204, "prefisso" => "R20430"],
    ["asr_id" => 204, "prefisso" => "R20450"],
    ["asr_id" => 204, "prefisso" => "R20470"],
    ["asr_id" => 204, "prefisso" => "S20401"],
    ["asr_id" => 204, "prefisso" => "S20410"],
    ["asr_id" => 204, "prefisso" => "S20420"],
    ["asr_id" => 204, "prefisso" => "S20430"],
    ["asr_id" => 205, "prefisso" => "R20550"],
    ["asr_id" => 205, "prefisso" => "R20570"],
    ["asr_id" => 205, "prefisso" => "S20530"],
    ["asr_id" => 206, "prefisso" => "A20605"],
    ["asr_id" => 206, "prefisso" => "L20605"],
    ["asr_id" => 206, "prefisso" => "R20650"],
    ["asr_id" => 206, "prefisso" => "R20670"],
    ["asr_id" => 206, "prefisso" => "S20601"],
    ["asr_id" => 206, "prefisso" => "S20605"],
    ["asr_id" => 206, "prefisso" => "S20640"],
    ["asr_id" => 206, "prefisso" => "S20650"],
    ["asr_id" => 207, "prefisso" => "R20750"],
    ["asr_id" => 207, "prefisso" => "R20770"],
    ["asr_id" => 208, "prefisso" => "A20805"],
    ["asr_id" => 208, "prefisso" => "L20805"],
    ["asr_id" => 208, "prefisso" => "R20801"],
    ["asr_id" => 208, "prefisso" => "R20805"],
    ["asr_id" => 208, "prefisso" => "R20810"],
    ["asr_id" => 208, "prefisso" => "R20820"],
    ["asr_id" => 208, "prefisso" => "R20830"],
    ["asr_id" => 208, "prefisso" => "R20850"],
    ["asr_id" => 208, "prefisso" => "R20870"],
    ["asr_id" => 208, "prefisso" => "S20801"],
    ["asr_id" => 208, "prefisso" => "S20805"],
    ["asr_id" => 208, "prefisso" => "S20810"],
    ["asr_id" => 208, "prefisso" => "S20820"],
    ["asr_id" => 208, "prefisso" => "S20830"],
    ["asr_id" => 209, "prefisso" => "A20905"],
    ["asr_id" => 209, "prefisso" => "L20905"],
    ["asr_id" => 209, "prefisso" => "R20950"],
    ["asr_id" => 209, "prefisso" => "R20970"],
    ["asr_id" => 209, "prefisso" => "S20905"],
    ["asr_id" => 209, "prefisso" => "S20930"],
    ["asr_id" => 209, "prefisso" => "S20940"],
    ["asr_id" => 212, "prefisso" => "R21250"],
    ["asr_id" => 212, "prefisso" => "R21270"],
    ["asr_id" => 213, "prefisso" => "A21301"],
    ["asr_id" => 213, "prefisso" => "L21301"],
    ["asr_id" => 213, "prefisso" => "R21350"],
    ["asr_id" => 213, "prefisso" => "R21370"],
    ["asr_id" => 213, "prefisso" => "S21301"],
    ["asr_id" => 213, "prefisso" => "S21340"],
    ["asr_id" => 301, "prefisso" => "R30150"],
    ["asr_id" => 301, "prefisso" => "R30170"],
    ["asr_id" => 905, "prefisso" => "A90505"],
    ["asr_id" => 905, "prefisso" => "L90505"],
    ["asr_id" => 905, "prefisso" => "S90505"],
    ["asr_id" => 907, "prefisso" => "S90701"],
];


// SECURITY
// ---------------------------------------------------------------------------------------------------------------------
const RE_CAPTCHA_SECRET = 'SECRET';

// Una lista di endpoint per cui controllare i captcha
//  - method: Il metodo delle richiesta da controllare
//  - pattern: una regex che esprime la url dell'endoint da controllare
const CAPTCHA_ENDPOINTS = [
    ['method' => 'GET', 'pattern' => '/\/apisanpag\/.+\/utenti\/.+\/pagamenti-sanitari/'],
    ['method' => 'GET', 'pattern' => '/\/apisanpag\/.+\/captcha-temp/'],
    ['method' => 'POST', 'pattern' => '/\/solcovidapisrv\/.+\/otp$/'],
];

//LISTA ASL TRASVERSALE
const ASL_LIST = [
    [
        'id' => 203,
        'descrizione' => 'ASL TO3 (Distretti Pinerolo, Val Susa-Val Sangone, Area Metropolitana Nord-Centro-Sud)',
        'tipologia' => 'ASL'
    ],
    [
        'id' => 204,
        'descrizione' => 'ASL TO4 (Distretti di Ciriè, Chivasso-San Mauro, Settimo Torinese, Ivrea, Cuorgnè)',
        'tipologia' => 'ASL'
    ],
    [
        'id' => 205,
        'descrizione' => 'ASL TO5 (Chieri, Carmagnola, Moncalieri, Nichelino)',
        'tipologia' => 'ASL'
    ],
    [
        'id' => 206,
        'descrizione' => 'ASL Vc (Vercelli)',
        'tipologia' => 'ASL'
    ],
    ['id' => 207, 'descrizione' => 'ASL BI (Biella)', 'tipologia' => 'ASL'],
    ['id' => 208, 'descrizione' => 'ASL NO (Novara)', 'tipologia' => 'ASL'],
    ['id' => 209,
        'descrizione' => 'ASL VCO (Verbano Cusio Ossola)', 'tipologia' => 'ASL'],
    [
        'id' => 210,
        'descrizione' => 'ASL CN1 (Cuneo, Borgo S.Dalmazzo-Dronero, Mondovì, Ceva, Savigliano-Fossano, Saluzzo)',
        'tipologia' => 'ASL'
    ],
    ['id' => 211, 'descrizione' => 'ASL CN2 (Alba e Bra)', 'tipologia' => 'ASL'],
    [
        'id' => 212,
        'descrizione' => 'ASL AT (Asti Centro, Asti Nord, Asti Sud)',
        'tipologia' => 'ASL'
    ],
    ['id' => 213, 'descrizione' => 'ASL AL (Alessandria)', 'tipologia' => 'ASL'],
    [
        'id' => 301,
        'descrizione' => 'ASL Città di TORINO (ex Asl To1, Asl To2)',
        'tipologia' => 'ASL'
    ],
    [
        'id' => 904,
        'descrizione' => 'Azienda Ospedaliera Universitaria "San Luigi" di Orbassano',
        'tipologia' => 'ASO'
    ],
    [
        'id' => 905,
        'descrizione' => 'Azienda Ospedaliera Universitaria "Maggiore della Carità" di Novara',
        'tipologia' => 'ASO'
    ],
    [
        'id' => 906,
        'descrizione' => 'Azienda Ospedaliera "Santa Croce" di Cuneo',
        'tipologia' => 'ASO'
    ],
    [
        'id' => 907,
        'descrizione' => 'Azienda Ospedaliera "Ss. Antonio e Biagio e Cesare Arrigo" di Alessandria',
        'tipologia' => 'ASO'
    ],
    [
        'id' => 908,
        'descrizione' => 'Azienda Ospedaliera "Ordine Mauriziano" di Torino',
        'tipologia' => 'ASO'
    ],
    [
        'id' => 909,
        'descrizione' => 'Azienda Ospedaliera Universitaria "Città della Salute e della Scienza" di Torino',
        'tipologia' => 'ASO'
    ],
    [
        'id' => 897,
        'descrizione' => 'Presidio Sanitario Ospedale Cottolengo',
        'tipologia' => 'ASO'
    ],
];