/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

let config = {};

// Proxy verso tutte le variabili d'ambiente impostate
config.envs = process.env;

// Costanti utili per definire l'ambiente in vui gira l'applicativo
config.isDevelopment = config.envs.ENVIRONMENT === 'development';
config.isTest = ['test', 'test-cert'].includes(config.envs.ENVIRONMENT);
config.isAlpha = ['alpha', 'alpha-cert'].includes(config.envs.ENVIRONMENT);
config.isProduction = config.envs.ENVIRONMENT === 'production';
config.areMocksEnabled = config.envs.MOCKS_ENABLED === true;

// BUILD_NUMBER e GIT_TAG_NAME sono delle variabili d'ambiente impostate dalla CI/CD
const getVersion = () => {
  // if (config.isDevelopment) return 'dev'
  // if (config.isTest) return config.envs.__ENV.BUILD_NUMBER
  // return config.envs.__ENV.GIT_TAG_NAME || `${config.envs.__ENV.GIT_BRANCH_NAME}/${config.envs.__ENV.GIT_COMMIT}`
  return config.envs.__ENV.npm_package_version
};

config.version = getVersion();

// ---------------------------------------------------------------------------------------------------------------------
config.oldServicesHosts = {
  secure: 'HOST',
  www: 'HOST',
  isan: 'HOST',
  screen: 'HOST',
  esenred: 'HOST',
  sansol: 'HOST',
};

config.oldServicesUrls = {
  home: 'URL',
  fascicolo_sanitario: `${config.oldServicesHosts.isan}/URL`,
  fascicolo_finanziario: `${config.oldServicesHosts.secure}/URL`,
  fascicolo_finanziario_nuovo: 'URL',
  cambio_medico: `${config.oldServicesHosts.secure}/URL`,
  screening: `${config.oldServicesHosts.screen}/URL`,
  taccuino: `${config.oldServicesHosts.isan}/URL`,
  documenti: `${config.oldServicesHosts.isan}/URL`,
  profilo: `${config.oldServicesHosts.secure}/URL`,
  trovaun_medici: `URL`,
  trovaun_strutture: `URL`,
  ritiro_referti: `${config.oldServicesHosts.isan}/URL`,
  prenotazione_visite: `${config.oldServicesHosts.secure}/URL`,
  pagamento_ticket_anonimo: `${config.oldServicesHosts.secure}/URL`,
  pagamento_ticket_anonimo_richiesta: `${config.oldServicesHosts.secure}/URL`,
  pagamento_ticket_anonimo_ricevuta: `${config.oldServicesHosts.secure}/URL`,
  pagamento_ticket_autenticato: `${config.oldServicesHosts.secure}/URL`,
  esenzione_reddito: `${config.oldServicesHosts.esenred}/URL`,
};

config.logoutUrls = {
  sansol: `${config.oldServicesHosts.sansol}/URL`,
  isan: `${config.oldServicesHosts.isan}/URL`,
  secure: `${config.oldServicesHosts.secure}/URL`,
  screen: `${config.oldServicesHosts.screen}/URL`,
  cup: `URL`
};


config.cupHome = 'URL';
config.cupLogin = 'URL';
config.cupSafariFix = 'URL';

// url di download dello zip dei referti. Come parametro prende 'idPaccetto' e 'pin' nella query string:
config.urlReportZipDownload = 'URL';

// impostare qui i base path delle API usate per le chiamate AJAX
config.basePaths = {
  apiCross: 'URL',
  bff: 'URL',
  delegations: 'URL',
  enrollment: 'URL',
  healthPayments: 'URL',
  incomeExemption: 'URL',
  messages: 'URL',
  onlineReports: 'URL',
  preferences: 'URL',
  profile: 'URL',
  prescriptions: 'URL',
  consents: 'URL',
  vaccinations: 'URL',
  pathologyExemption: 'URL',
  changeDoctor: 'URL',
  covid: 'URL'
};


config.appServiceCodes = config.envs.APP_SERVICES_CODES;


config.appServiceCode2Label = {
  [config.appServiceCodes.onlineReports]: 'Ritiro referti e immagini con accesso facilitato',
  [config.appServiceCodes.healthPayments]: 'Pagamenti sanitari',
  [config.appServiceCodes.incomeExemption]: 'Esenzione per reddito',
  [config.appServiceCodes.delegations]: 'Deleghe',
  [config.appServiceCodes.prescriptions]: 'Ricette dematerializzate',
  [config.appServiceCodes.consents]: 'Consensi',
  [config.appServiceCodes.vaccinations]: 'Vaccinazioni',
  [config.appServiceCodes.pathologyExemption]: 'Esenzioni per patologie',
  [config.appServiceCodes.changeDoctor]: 'Il mio medico',
  [config.appServiceCodes.asr]: 'Notifiche dalle tue strutture sanitarie',
  [config.appServiceCodes.covid]: 'Covid 19',
  [config.appServiceCodes.fse]: 'Fascicolo sanitario elettronico',
};

// Questa configurazione serve per la gestione dei mocks dinamici del BFF
// Tramite questa configurazione sappiamo cosa mostrare nella pagina di selezione dei servizi da mockare
// e sappiamo qual è il path delle API associato al servizio da mockare
config.mockableServices = [
  {label: 'Consensi', code: 'CONSENSI', apiPath: config.basePaths.consents},
  {label: 'Vaccinazioni', code: 'SIRVA', apiPath: config.basePaths.vaccinations},
  {label: 'Deleghe', code: 'deleghe', apiPath: config.basePaths.delegations},
  {label: 'Esenzione per reddito', code: 'ESENRED', apiPath: config.basePaths.incomeExemption},
  {label: 'Pagamenti sanitari', code: 'PTW', apiPath: config.basePaths.healthPayments},
  {label: 'Ritiro referti e immagini ed arruolamento', code: 'ROL', apiPath: config.basePaths.onlineReports},
  {label: 'Ricette', code: 'promem', apiPath: config.basePaths.prescriptions},
  {label: 'ApisanCross', code: 'apisan', apiPath: config.basePaths.apiCross},
  {label: 'Esenzione per patologie', code: 'esenpat', apiPath: config.basePaths.pathologyExemption},
  {label: 'Il mio medico', code: 'scerev', apiPath: config.basePaths.changeDoctor},
];


// Quali sono i tag base da usare per filtrare i messaggi del message store?
config.unpMessageStoreTags = {
  topic: 'sanita',
  deleted: 'deleted',
  seen: 'noticed'
};
// Quali sono i tags per cui filtrare i messaggi ricevuti da UNP?
config.unpMessageStoreTag = '+sanita -deleted';
// Qual è il tag che identifica un messaggio come "visto"?
config.unpMessageStoreSeenTag = 'noticed';
// Quali sono i tag per cui filtrare la lista dei servizi disponibili su UNP?
config.unpServicesTag = 'sanita';
// Header custom del servizio message store che contiene dei metadati
config.unpMessageStoreHeaderNames = {
  unseenCount: 'total-elements-not-noticed',
  unreadCount: 'total-elements-not-read',
  totalCount: 'total-elements',
  pagesCount: 'total-pages',
  currentPageNumber: 'current-page',
  nextPageUrl: 'next-page',
  pageLength: 'page-size',
};

// FIREBASE CONFIGS
// ---------------------------------------------------------------------------------------------------------------------
config.firebase = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  databaseURL: "DB_URL",
  projectId: "ID",
  storageBucket: "STORAGE",
  messagingSenderId: "SENDER_ID"
};

config.errorContacts = false;
config.isToUpdate = false;

config.appCodeMapNew = {
  ESENPAT : "ESENPAT_OLD"
}

config.isNewEnrollableActive = true;

export default config
