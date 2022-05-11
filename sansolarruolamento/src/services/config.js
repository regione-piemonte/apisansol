/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

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

export const DELEGATION_STATUS_VALID =[
  DELEGATION_STATUS_MAP.ACTIVE,
  DELEGATION_STATUS_MAP.IS_EXPIRING
]

export const TEAM_PREFIX = "8038000";
export const TEAM_LENGTH = 13;
