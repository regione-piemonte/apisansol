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

export const ENROLLMENT_CODE_MAP = {
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
  UNKNOWN: "999"
};

export const instanceType = {
  Spostamento: 'SPOSTAMENTO',
  Revoca: 'REVOCA',
  Omissione: 'OMISSIONE',
  Differimento: 'DIFFERIMENTO',
};

export const instanceStatus = {
  DOC_PRESO_IN_CARICO: "1",
  SPO_PRESO_IN_CARICO: "17",
  REV_PRESO_IN_CARICO: "13",
  DOC_DA_VALUTARE: "2",
  SPO_DA_VALUTARE: "18",
  REV_DA_VALUTARE: "14",
  DOC_Confermato: "3",
  DOC_Annullato: "4",
  REV_Confermato: "15",
  REV_Annullato: "16",
  SPO_Confermato: "19",
  SPO_Annullato: "20",
  REA_Proposta: "5",
  REA_Presa_In_Carico: "6",
};

export const FORMAT_DATE = "DD/MM/YYYY";

// Indica se attivare i nuovi messaggi di arruolamento
export const IS_NEW_ENROLLABLE_ACTIVE = true;



export const COVID_VACCINATIONS_CODES =['COV', 'COV_AZ', 'COV_MOD', 'COV_PF', 'COV_JJ']

// finché il campo tipoCentro su /centri-vaccinali è obbligatorio, passare ilparamentro T = tutti
export const VACCINATION_CENTER_FILTER = "T"
