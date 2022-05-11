<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

const DEBUG = true;
// Stabilisce se le chiamate forwardate ai back-end devono passare attraverso un proxy o meno
const USE_PROXY = false;
// Attiva/Disattiva la normalizzazione degli header della request
const HEADER_NORMALIZE = true;
// Permette di attivare/disattivare la possibilità di utilizzare i back-end di mocks
const MOCKS_ENABLED = true;

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
const AUTH_OVERRIDABLE_WHITELIST_USER = ['*'];
// Indica quali applicativi possono usufruire della funzionalità "Simula utente"
const AUTH_OVERRIDABLE_WHITELIST_APPLICATION = ['*'];

// MATOMO
// ---------------------------------------------------------------------------------------------------------------------
const MATOMO_SCHEMA = 'SCHEMA';
const MATOMO_HOST = 'HOST';
const MATOMO_PATH = 'PATH';
const MATOMO_SITE_ID = 99999;
const MATOMO_AUTH_TOKEN = 'TOKEN';

// LOGS
// ---------------------------------------------------------------------------------------------------------------------
// Abilita/Disabilita i log
const LOG = true;
define('LOG_ROOT', implode(DIRECTORY_SEPARATOR, [PATH_VH_ROOT, 'app', 'logs', 'la-mia-salute', 'bff']));
const LOGS_IGNORABLE_USERS = [];

// Abilita/Disablita i log delle cURL
const LOG_CURL = true;
define('LOG_CURL_FILE_PATH', implode(DIRECTORY_SEPARATOR, [LOG_ROOT, 'request.log']));
const LOG_CURL_CHANNEL = 'request';
const LOG_CURL_MAX_FILES = 7;
const LOG_CURL_PAYLOAD = true;

// Abilita/Disablita i log degli accessi
const LOG_ACCESS = true;
define('LOG_ACCESS_FILE_PATH', implode(DIRECTORY_SEPARATOR, [LOG_ROOT, 'access.log']));
const LOG_ACCESS_CHANNEL = 'access';
const LOG_ACCESS_MAX_FILES = 7;

// Abilita/Disablita i log degli errori
const LOG_ERROR = true;
define('LOG_ERROR_FILE_PATH', implode(DIRECTORY_SEPARATOR, [LOG_ROOT, 'error.log']));
const LOG_ERROR_CHANNEL = 'error';
const LOG_ERROR_MAX_FILES = 7;
const LOG_ERROR_PAYLOAD = true;
const LOG_ERROR_BODY = true;

// Abilita/Disablita i log dei JSON
const LOG_JSON = true;
define('LOG_JSON_FILE_PATH', implode(DIRECTORY_SEPARATOR, [LOG_ROOT, 'json.log']));
const LOG_JSON_CHANNEL = 'json';
const LOG_JSON_MAX_FILES = 7;
const LOG_JSON_PAYLOAD = false;
const LOG_JSON_PAYLOAD_ON_ERROR = true;
const LOG_JSON_COOKIES = false;
const LOG_JSON_COOKIES_ON_ERROR = true;
const LOG_JSON_BODY = false;
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
const PUBLIC_TRANSPORT_HOST = 'SCHEME';
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
const TIPOLOGIE_ESENZIONE = 'URL';
const TIPOLOGIE_DOCUMENTI = 'URL';
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

// TROVA UN
const APISANTROVAUN_SCHEME = 'SCHEME';
const APISANTROVAUN_HOST = 'HOST';
const APISANTROVAUN_PORT = null;
const APISANTROVAUN_USER = 'USER';
const APISANTROVAUN_PASS = 'PASS';
const URL_JSON_TIPOLOGIE_OSPEDALE = 'URL';
const URL_JSON_TIPOLOGIE_ASSISTENZA = 'URL';
const URL_JSON_TIPOLOGIE_PUNTI_VENDITA = 'URL';

// ESTRATTO CONTO
const APISANFFE_SCHEME = 'SCHEME';
const APISANFFE_HOST = 'HOST';
const APISANFFE_PORT = null;
const APISANFFE_USER = 'USER';
const APISANFFE_PASS = 'PASS';

// FARMACIE ABITUALI
const APISANFARAB_SCHEME = 'SCHEME';
const APISANFARAB_HOST = 'HOST';
const APISANFARAB_PORT = null;
const APISANFARAB_USER = 'USER';
const APISANFARAB_PASS = 'PASS';


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


const NOTIFY_AUTH_JWT = 'JWT';
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
            'tipologia'=> 'ASL',
            'gruppo_id' => null
        ],
        [
            'id' => 204,
            'nuovo' => true,
            'nre_attivo' => true,
            'descrizione' => 'ASL TO4 (Distretti di Ciriè, Chivasso-San Mauro, Settimo Torinese, Ivrea, Cuorgnè)',
            'tipologia'=> 'ASL',
            'gruppo_id' => null
        ],
        [
            'id' => 205,
            'nuovo' => true,
            'nre_attivo' => true,
            'descrizione' => 'ASL TO5 (Chieri, Carmagnola, Moncalieri, Nichelino)',
            'tipologia'=> 'ASL',
            'gruppo_id' => null
        ],
        [
            'id' => 206,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'ASL Vc (Vercelli)',
            'tipologia'=> 'ASL',
            'gruppo_id' => null
        ],
        ['id' => 207, 'nuovo' => true, 'nre_attivo' => true, 'descrizione' => 'ASL BI (Biella)', 'tipologia'=> 'ASL',  'gruppo_id' => null],
        ['id' => 208, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL NO (Novara)', 'tipologia'=> 'ASL',  'gruppo_id' => null],
        ['id' => 209, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL VCO (Verbano Cusio Ossola)', 'tipologia'=> 'ASL',  'gruppo_id' => null],
        [
            'id' => 210,
            'nuovo' => true,
            'nre_attivo' => true,
            'descrizione' => 'ASL CN1 (Cuneo, Borgo S.Dalmazzo-Dronero, Mondovì, Ceva, Savigliano-Fossano, Saluzzo)',
            'tipologia'=> 'ASL',
            'gruppo_id' => null
        ],
        ['id' => 211, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL CN2 (Alba e Bra)', 'tipologia'=> 'ASL',  'gruppo_id' => null],
        [
            'id' => 212,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'ASL AT (Asti Centro, Asti Nord, Asti Sud)',
            'tipologia'=> 'ASL',
            'gruppo_id' => null
        ],
        ['id' => 213, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL AL (Alessandria)', 'tipologia'=> 'ASL', 'gruppo_id' => 2],
        [
            'id' => 301,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'ASL Città di TORINO (ex Asl To1, Asl To2)',
            'tipologia'=> 'ASL',
            'gruppo_id' => null
        ],
        [
            'id' => 904,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera Universitaria "San Luigi" di Orbassano',
            'tipologia'=> 'ASO',
            'gruppo_id' => null
        ],
        [
            'id' => 905,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera Universitaria "Maggiore della Carità" di Novara',
            'tipologia'=> 'ASO',
            'gruppo_id' => null
        ],
        [
            'id' => 906,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera "Santa Croce" di Cuneo',
            'tipologia'=> 'ASO',
            'gruppo_id' => null
        ],
        [
            'id' => 907,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera "Ss. Antonio e Biagio e Cesare Arrigo" di Alessandria',
            'gruppo_id' => null
        ],
        [
            'id' => 908,
            'nuovo' => true,
            'nre_attivo' => true,
            'descrizione' => 'Azienda Ospedaliera "Ordine Mauriziano" di Torino',
            'tipologia'=> 'ASO',
            'gruppo_id' => null
        ],
        [
            'id' => 909,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'Azienda Ospedaliera Universitaria "Città della Salute e della Scienza" di Torino',
            'tipologia'=> 'ASO',
            'gruppo_id' => null
        ],
        [
            'id' => 996,
            'nuovo' => true,
            'nre_attivo' => false,
            'descrizione' => 'COQ - Centro Ortopedico di Quadrante',
            'tipologia'=> 'ASO',
            'gruppo_id' => null
        ],
        ['id' => 501, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 501',  'gruppo_id' => null],
        ['id' => 502, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 502',  'gruppo_id' => null],
        ['id' => 503, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 503',  'gruppo_id' => null],
        ['id' => 504, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 504',  'gruppo_id' => null],
        ['id' => 505, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 505',  'gruppo_id' => null],
        ['id' => 506, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 506',  'gruppo_id' => null],
        ['id' => 507, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 507',  'gruppo_id' => null],
        ['id' => 508, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 508',  'gruppo_id' => null],
        ['id' => 509, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 509',  'gruppo_id' => null],
        ['id' => 510, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 510',  'gruppo_id' => null],
        ['id' => 511, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 511',  'gruppo_id' => null],
        ['id' => 512, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 512', 'gruppo_id' => null],
        ['id' => 513, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 513',  'gruppo_id' => null],
        ['id' => 514, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 514',  'gruppo_id' => null],
        ['id' => 515, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 515',  'gruppo_id' => null],
        ['id' => 516, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 516',  'gruppo_id' => null],
        ['id' => 517, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 517',  'gruppo_id' => null],
        ['id' => 518, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 518',  'gruppo_id' => null],
        ['id' => 519, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 519',  'gruppo_id' => null],
        ['id' => 520, 'nuovo' => true, 'nre_attivo' => false, 'descrizione' => 'ASL 520',  'gruppo_id' => null],
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
    ["asr_id" => 908, "prefisso" => "S90801"],
    ["asr_id" => 908, "prefisso" => "L90801"],
    ["asr_id" => 908, "prefisso" => "A90801"],
    ["asr_id" => 908, "prefisso" => "R90801"],
    ["asr_id" => 204, "prefisso" => "R20495"]
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
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL TO3 (Distretti Pinerolo, Val Susa-Val Sangone, Area Metropolitana Nord-Centro-Sud)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 204,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL TO4 (Distretti di Ciriè, Chivasso-San Mauro, Settimo Torinese, Ivrea, Cuorgnè)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],

    ],
    [
        'id' => 205,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL TO5 (Chieri, Carmagnola, Moncalieri, Nichelino)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 206,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL Vc (Vercelli)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 207,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL BI (Biella)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [   'id' => 208,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL NO (Novara)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [   'id' => 209,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL VCO (Verbano Cusio Ossola)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 210,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL CN1 (Cuneo, Borgo S.Dalmazzo-Dronero, Mondovì, Ceva, Savigliano-Fossano, Saluzzo)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [   'id' => 211,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL CN2 (Alba e Bra)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 212,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL AT (Asti Centro, Asti Nord, Asti Sud)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [   'id' => 213,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL AL (Alessandria)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 301,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'ASL Città di TORINO (ex Asl To1, Asl To2)',
        'tipologia' => 'ASL',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 904,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'Azienda Ospedaliera Universitaria "San Luigi" di Orbassano',
        'tipologia' => 'ASO',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 905,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'Azienda Ospedaliera Universitaria "Maggiore della Carità" di Novara',
        'tipologia' => 'ASO',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 906,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'Azienda Ospedaliera "Santa Croce" di Cuneo',
        'tipologia' => 'ASO',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 907,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'Azienda Ospedaliera "Ss. Antonio e Biagio e Cesare Arrigo" di Alessandria',
        'tipologia' => 'ASO',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 908,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'Azienda Ospedaliera "Ordine Mauriziano" di Torino',
        'tipologia' => 'ASO',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 909,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'Azienda Ospedaliera Universitaria "Città della Salute e della Scienza" di Torino',
        'tipologia' => 'ASO',
        'visibile_applicazioni' => [],
    ],
    [
        'id' => 897,
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'descrizione' => 'Presidio Sanitario Ospedale Cottolengo',
        'tipologia' => 'ASO',
        'visibile_applicazioni' => [ ],
    ],
    [
        'id' => 996,
        'descrizione' => 'COQ - Centro Ortopedico di Quadrante',
        'tipologia' => 'ASO',
        'gruppo_id' => null,
        'gruppo_id_esterno' => null,
        'visibile_applicazioni' => [],
    ],
];