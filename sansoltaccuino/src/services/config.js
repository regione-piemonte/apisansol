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

export const DELEGATION_GRADE_MAP = {
  STRONG: "FORTE",
  WEAK: "DEBOLE"
};

export const FSE_ENROLLMENT_CODES = {
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

export const ENTITY_CODE_MAP = {
  DETECTION: "RILEVAZIONI", // fatto
  SYMPTOMS: "SINTOMI", // fatto
  PAINS: "DOLORI", // fatto
  EVENTS: "EVENTI", // fatto
  DRUGS: "FARMACI", // fatto
  DIET: "DIETA",
  STRUCTURE_CONTACT: "CONTATTI_STRUTTURA" // fatto
};

export const GROUP_CODE_MAP = {
  PRESSURE: "PRES_GR", // fatto
  WEIGHT: "PESO_GR", // fatto
  TEMPERATURE: "TEMP_GR", // fatto
  INSULIN: "INS_GR", // fatto
  GLYCEMIA: "GLIC_GR", // fatto
  OXYMETRY: "OSS_GR", // fatto
  CHOLESTEROL: "COL_GR", // fatto
  HEMOGLOBIN: "EMO_GR", // fatto
  BREATH_FREQ: "FREQ_RESP_GR" // fatto
};

export const DESCRIPTOR_CODE_MAP = {
  DIASTOLIC_PRESSURE: "PRES_DIA", // fatto
  SYSTOLIC_PRESSURE: "PRES_SIST", // fatto
  HEART_RATE: "FREQ_CARD", // fatto
  OXYMETRY: "OSS", // fatto
  GLYCEMIA: "GLIC", // fatto
  INSULIN: "INS", // fatto
  INSULIN_FARM: "INS_FARM", // fatto
  TEMPERATURE: "TEMP", // fatto
  WEIGHT: "PESO", // fatto
  BREATH_FREQ: "FREQ_RESP", // fatto
  WAIST_CIRC: "CIRC_VITA", // fatto
  HEIGHT: "ALT", // fatto
  CHOLESTEROL_HDL: "COL_HDL", // fatto
  CHOLESTEROL_LDL: "COL_LDL", // fatto
  CHOLESTEROL_TOT: "COL_TOT", // fatto
  TRIGLYCERIDES: "TRIGL", // fatto
  HEMO_GLYCEMIA: "EMO_GLIC" // fatto
};

export const UNIT_CODE_MAP = {
  KG: "kg",
  C: "°C",
  CM: "cm",
  MMHG: "mmHg",
  BPM: "bpm",
  MGDL: "mg/dL",
  MMOLL: "mmol/L",
  SPO2: "SpO2%",
  PERCENTAGE: "%",
  UI: "UI",
  APM: "atti per minuto"
};

export const DETECTION_MODE_CODE_MAP = {
  AUT: "AUT",
  MMG_PLS: "MMG/PLS",
  ASR: "AZ_SAN",
  FARM: "FARM",
  OTHER: "ALTRO"
};

export const DETECTION_MODE_LABEL_MAP = {
  [DETECTION_MODE_CODE_MAP.AUT]: "Autonoma",
  [DETECTION_MODE_CODE_MAP.MMG_PLS]: "Medico / Pediatra",
  [DETECTION_MODE_CODE_MAP.ASR]: "Azienda sanitaria",
  [DETECTION_MODE_CODE_MAP.FARM]: "Farmacia",
  [DETECTION_MODE_CODE_MAP.OTHER]: "Altro"
};

export const STRUCTURE_TYPE_CODE_MAP = {
  ASR: "STRUT_SAN",
  NO_CONVENTIONAL: "MNC"
};

// Indica se attivare i nuovi messaggi di arruolamento
export const IS_NEW_ENROLLABLE_ACTIVE = true;
