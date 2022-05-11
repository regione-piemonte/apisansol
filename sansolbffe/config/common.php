<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

const PROXY = 'URL';

define('PATH_VH_ROOT', implode(DIRECTORY_SEPARATOR, [$_SERVER['DOCUMENT_ROOT'], '..']));
define('PATH_PROJECT_ROOT', implode(DIRECTORY_SEPARATOR, [__DIR__, '..']));

// HEADERS
// ---------------------------------------------------------------------------------------------------------------------
const HEADER_FIELD_SHIB_NOME = 'HTTP_SHIB_IDENTITA_NOME';
const HEADER_FIELD_SHIB_COGNOME = 'HTTP_SHIB_IDENTITA_COGNOME';
const HEADER_FIELD_SHIB_CF = 'HTTP_SHIB_IDENTITA_CODICEFISCALE';
const HEADER_FIELD_SHIB_RISCONTRO = 'HTTP_SHIB_IDENTITA_RISCONTRO';
const HEADER_FIELD_SHIB_COMMUNITY = 'HTTP_SHIB_COMMUNITY';
const HEADER_FIELD_SHIB_LIVELLO = 'HTTP_SHIB_IDENTITA_LIVAUTH';

// HEADERS
// Nomi e valori standard degli headers HTTP
// ---------------------------------------------------------------------------------------------------------------------
const HEADER_NAME_REQUEST_ID = 'X-Request-Id';
const HEADER_NAME_FORWARDED_FOR = 'X-Forwarded-For';

// Quali sono gli header da andare a leggere per ottenere le informazioni sull'utente loggato con Shibboleth?
const AUTH_HEADER_NAME_CF = 'Shib-Identita-Codicefiscale';
const AUTH_HEADER_NAME_COGNOME = 'Shib-Identita-Cognome';
const AUTH_HEADER_NAME_NOME = 'Shib-Identita-Nome';
const AUTH_HEADER_NAME_RISCONTRO = 'Shib-Identita-Riscontro';

const APISAN_HEADER_NAME_SERVICE_CODE = 'X-Codice-Servizio';
const APISAN_HEADER_VALUE_SERVICE_CODE = 'SANSOL';

const NOTIFY_HEADER_NAME_AUTH = 'X-Authentication';
const NOTIFY_HEADER_NAME_CF = 'Shib-Iride-IdentitaDigitale';


// CORS
// Configurazione sui CORS comuni a tutti gli ambienti
// ---------------------------------------------------------------------------------------------------------------------
// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
const CORS_ALLOWED_HEADERS = [
    'X-Requested-With',
    'X-Request-Id',
    'X-Front-End-Version',
    'X-Front-End-Page',
    'X-Front-End-Route',
    'X-Front-End-Application',
    'X-Bff-Mocks',
    'Content-Type',
    'Accept',
    'Origin',
    'Authorization',
];
// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
const CORS_ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
const CORS_ALLOW_CREDENTIALS = true;
// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
const CORS_EXPOSE_HEADERS = [
    '*',
    // Elenchiamo anche tutti gli header esposti
    // perché Explorer e Safari non supportano la wildcard *
    'Content-Type',
    'Content-Length',
    'Date',
    'Expires',
    'Pragma',
    'Cache-Control',
    'Content-Disposition',
    'X-Request-Id',
    'X-Mocks',
    'X-Total-Elements',
    'X-Total-Pages',
    'X-Page',
    'X-Page-Size',
    'Total-Elements',
    'Total-Elements-Not-Noticed',
    'Total-Elements-Not-Read',
    'Total-Pages',
    'Current-Page',
    'Next-Page',
    'Page-Size',
];

// UTENTI DEMO
// ---------------------------------------------------------------------------------------------------------------------
const IDENTITY_DEMO_20 = ['nome' => 'DEMO 20', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00B77B000F'];
// @NOTE: DEMO 21 potrebbe causare conflitti dal momento che viene usato anche da altri per testare UNP
const IDENTITY_DEMO_21 = ['nome' => 'DEMO 21', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11B000J'];
const IDENTITY_DEMO_22 = ['nome' => 'DEMO 22', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11C000K'];
const IDENTITY_DEMO_23 = ['nome' => 'DEMO 23', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11D000L'];
const IDENTITY_DEMO_24 = ['nome' => 'DEMO 24', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11E000M'];
const IDENTITY_DEMO_25 = ['nome' => 'DEMO 25', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11F000N'];
const IDENTITY_DEMO_26 = ['nome' => 'DEMO 26', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11G000O'];
const IDENTITY_DEMO_27 = ['nome' => 'DEMO 27', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11H000P'];
const IDENTITY_DEMO_28 = ['nome' => 'DEMO 28', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11I000Q'];
const IDENTITY_DEMO_29 = ['nome' => 'DEMO 29', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11J000R'];
const IDENTITY_DEMO_30 = ['nome' => 'DEMO 30', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11K000S'];
const IDENTITY_DEMO_31 = ['nome' => 'DEMO 31', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11L000T'];
const IDENTITY_DEMO_32 = ['nome' => 'DEMO 32', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11M000U'];
const IDENTITY_DEMO_33 = ['nome' => 'DEMO 33', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11N000V'];
const IDENTITY_DEMO_34 = ['nome' => 'DEMO 34', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11O000W'];
const IDENTITY_DEMO_35 = ['nome' => 'DEMO 35', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11R000Z'];
const IDENTITY_DEMO_36 = ['nome' => 'DEMO 36', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11S000A'];
const IDENTITY_DEMO_37 = ['nome' => 'DEMO 37', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11T000B'];
const IDENTITY_DEMO_38 = ['nome' => 'DEMO 38', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11U000C'];
const IDENTITY_DEMO_39 = ['nome' => 'DEMO 39', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11V000D'];
const IDENTITY_DEMO_40 = ['nome' => 'DEMO 40', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11P000X'];
const IDENTITY_DEMO_43 = ['nome' => 'DEMO 43', 'cognome' => 'CSI PIEMONTE', 'cf' => 'AAAAAA00A11Q000Y'];

const DEFAULT_IDENTITY = IDENTITY_DEMO_20;
