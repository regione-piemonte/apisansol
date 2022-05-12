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
  UPDATED: "AGGIORNATA"
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
  FSE_NOT_CONSENT: "008",
  FSE_NOT_CONSENT_DO_NOT_ASK: "016",
  UNKNOWN: "999"
};

//SCREENING

export const APPOINTMENT_TYPES  = {
  CV : "CV",
  MX: "MX",
  CR: "CR"
}

export const APPOINTMENT_TYPES_LABEL = {
  [APPOINTMENT_TYPES.CV] : "citologico",
  [APPOINTMENT_TYPES.MX]: "mammografico",
  [APPOINTMENT_TYPES.CR]: "colon-retto"
}

export const APPOINTMENT_TYPES_NAME = {
  [APPOINTMENT_TYPES.CV] : "screening del tumore del collo dell'utero",
  [APPOINTMENT_TYPES.MX]: "screening del tumore della mammella",
  [APPOINTMENT_TYPES.CR]: "Screening del tumore del colon - retto"
}

export const SCREENING_INFO = {
  [APPOINTMENT_TYPES.CV] : ` I test per lo screening del tumore del collo dell'utero sono il
        Pap-test, offerto ogni 3 anni alle donne di età compresa tra i
        25 e i 30 anni e il test per Papilloma virus (HPV-DNA test)
        offerto ogni 5 anni alle donne tra i 30 e i 64 anni.`,
  [APPOINTMENT_TYPES.MX]: ` Lo screening per la diagnosi precoce del tumore mammario si
                rivolge alle donne di età compresa tra i 50 e i 69 anni e si
                esegue con una mammografia ogni 2 anni.`
}

export const CONTACTS_TYPES={
  EMAIL : 'indirizzo email',
  ADDRESS : 'indirizzo postale',
  LANDLINE_PHONE : 'numero di telefono',
  MOBILE_PHONE : 'numero cellulare'
}

export const STATUS_CODES={
  BLOCK : 'B',
  FREE: 'L'
}

export const APPOITNMENT_VISIBILITY_CODES = {
  VISIBILE: 'SI',
  HIDDEN: 'NO',
  PARTIALLY_VISIBILE: 'UO'
}

export const FSE_VISIBILILY_CODES={
  VISIBILE : 'N',
  HIDDEN: 'S'
}

export const FSE_SERVICE_CODE = 'FSEPREV'

export const DELEGATION_RANK_CODES = {
  STRONG: 'FORTE',
  WEAK: 'DEBOLE',
};
export const PIEDMONT_COORDS = {
  lat: 45.060735,
  lon: 7.923549
}

// Indica se attivare i nuovi messaggi di arruolamento
export const IS_NEW_ENROLLABLE_ACTIVE = true;

