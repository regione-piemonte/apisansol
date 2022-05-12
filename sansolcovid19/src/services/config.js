/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const IS_DEV = process.env.APP_IS_DEV;
export const IS_TEST = process.env.APP_IS_TEST;
export const IS_PROD = process.env.APP_IS_PROD;

export const DELEGATION_STATUS_MAP = {
  ACTIVE: "ATTIVA",
  NOT_ACTIVE: "NON ATTIVA",
  REVOKED: "REVOCATA",
  REFUSED: "RIFIUTATA",
  IS_EXPIRING: "IN_SCADENZA",
  EXPIRED: "SCADUTA",
  UPDATED: "AGGIORNATA",
};

export const ENROLLMENT_CODES = {
  // Il soggetto  ha chiesto che non gli venisse più suggerito l’apertura del fascicolo.
  DO_NOT_ASK_ME_AGAIN: "000",
  // Il soggetto non è piemontese
  NO_PIEDMONT: "001",
  // Il soggetto non è maggiorenne
  NO_ADULT: "002",
  // Il soggetto ha un FSE con alimentazione a SI
  FSE_APPROVED: "003",
  // Il soggetto è piemontese, maggiorenne ma non ha un FSE
  NO_FSE: "004",
  // Il soggetto è piemontese, maggiorenne ma ha un FSE con alimentazione valorizzata a NO
  FSE_NOT_APPROVED: "005",
  UNKNOWN: "999",
};

export const EVENT_TYPE_CODE_MAP = {
  HOME_ISOLATION: 1,
  HOSPITALIZED: 2,
  TRANSFERRED_INTERNAL: 3,
  TRANSFERRED_ETERNAL: 4,
  DEAD: 5,
  HEALED: 6,
  TEST_WAITING: 8,
  POST_HOSPITALIZATION: 9,
  HOME_ASSIGNMENT: 10,
  REPORTED: 11,
  IN_CHARGE: 12,
  LEAVED: 13,
  MORE_INFO: 14,
  ISOLATION: 15,
  HOME_ISOLATION_DISPOSED: 16,
  HOME_ASSIGNMENT_DISPOSED: 17,
  DEAD_NO_COVID: 18,
  QUARANTINE_VACCINATION_BEFORE_120_DAYS: 21,
  QUARANTINE_VACCINATION_AFTER_120_DAYS: 22,
  QUARANTINE_VACCINATION_NONE: 23,
  QUARANTINE_TO_BE_EXPLORED: 24,
  ISOLATION_TO_BE_EXPLORED: 25,
  END_OF_QUARANTINE: 26,
};

export const CONDUCT_OBLIGATIONS_CODE_MAP= [
  EVENT_TYPE_CODE_MAP.HOME_ISOLATION_DISPOSED,
  EVENT_TYPE_CODE_MAP.HOME_ASSIGNMENT_DISPOSED,
  EVENT_TYPE_CODE_MAP.ISOLATION_TO_BE_EXPLORED,
  EVENT_TYPE_CODE_MAP.QUARANTINE_VACCINATION_NONE,
  EVENT_TYPE_CODE_MAP.QUARANTINE_VACCINATION_AFTER_120_DAYS,
  EVENT_TYPE_CODE_MAP.QUARANTINE_TO_BE_EXPLORED,
  EVENT_TYPE_CODE_MAP.ISOLATION
]


// Configurazione per i tamponi normali
export const SWAB_RESULT_STATUS_MAP = {
  PENDING: 1,
  POSITIVE: 2,
  NEGATIVE: 4,
  SUSPENDED: 6,
  UNSUITABLE: 7,
  NOT_RECEIVED: 8,
  UNKNOWN: 9,
  UNSURE: 10,
};

export const SWAB_RESULT_STATUS_LABEL_MAP = {
  PENDING: "Non disponibile",
  POSITIVE: "Positivo",
  NEGATIVE: "Negativo",
  SUSPENDED: "Sospeso",
  UNSUITABLE: "Non idoneo",
  NOT_RECEIVED: "Non pervenuto",
  UNKNOWN: "Indeterminato",
  UNSURE: "Dubbio",
  [SWAB_RESULT_STATUS_MAP.PENDING]: "Non disponibile",
  [SWAB_RESULT_STATUS_MAP.POSITIVE]: "Positivo",
  [SWAB_RESULT_STATUS_MAP.NEGATIVE]: "Negativo",
  [SWAB_RESULT_STATUS_MAP.SUSPENDED]: "Sospeso",
  [SWAB_RESULT_STATUS_MAP.UNSUITABLE]: "Non idoneo",
  [SWAB_RESULT_STATUS_MAP.NOT_RECEIVED]: "Non pervenuto",
  [SWAB_RESULT_STATUS_MAP.UNKNOWN]: "Indeterminato",
  [SWAB_RESULT_STATUS_MAP.UNSURE]: "Dubbio",
};

// Configurazione per i tamponi di screening
export const SWAB_SCREEN_RESULT_STATUS_MAP = {
  PENDING: null,
  POSITIVE: "P",
  NEGATIVE: "N",
  UNKNOWN: "I",
};

export const SWAB_SCREEN_RESULT_STATUS_LABEL_MAP = {
  PENDING: "In corso",
  POSITIVE: "Positivo",
  NEGATIVE: "Negativo",
  UNKNOWN: "Indeterminato",
  [SWAB_SCREEN_RESULT_STATUS_MAP.PENDING]: "In corso",
  [SWAB_SCREEN_RESULT_STATUS_MAP.POSITIVE]: "Positivo",
  [SWAB_SCREEN_RESULT_STATUS_MAP.NEGATIVE]: "Negativo",
  [SWAB_SCREEN_RESULT_STATUS_MAP.UNKNOWN]: "Indeterminato",
};

export const SWAB_TYPE_CODE_MAP = {
  NORMAL: "TAMPONE",
  FAST_A: "TAMPONE_RAPIDO_A",
  FAST_B: "TAMPONE_RAPIDO_B",
  SEROLOGICAL: "SIEROLOGICO",
  SALIVARY: "TAMP_MOLECOLARE_SALIV"
};

export const CONTACT_VALIDATOR_TYPE_MAP = {
  OPERATOR: "OPERATORE",
  CITIZEN: "CITTADINO",
  DELEGATOR: "CITTADINO_DELEGATO",
};

export const REPORT_VERIFIABLE_CL_LIST = [
  'asono',
  'codice_uo',
  'dma.alr2',
  'dma.asoal',
  'dma.asocn',
  'dma.asocnr2',
  'dma.at',
  'dma.biella',
  'dma.cdss',
  'dma.clto3r2',
  'dma.cn1',
  'dma.cn1r2',
  'dma.cn2r2',
  'dma.maur2',
  'dma.no',
  'dma.nor2',
  'dma.pvnorepo',
  'dma.pvrepo',
  'dma.slui',
  'dma.to',
  'dma.to4',
  'dma.to5',
  'dma.to5r2',
  'dma.vco',
  'to4r2',
  'vcr2',
  // CL solo di test
  'CL1X'
];
