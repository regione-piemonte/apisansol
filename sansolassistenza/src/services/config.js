/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const IS_DEV = process.env.APP_IS_DEV;
export const IS_TEST = process.env.APP_IS_TEST;
export const IS_ALPHA_CERT = process.env.APP_IS_ALPHA_CERT;
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


export const TYPE_PRESCRIPTIONS = [
  {
    label: 'Farmaceutica',
    value: 'farmaceutica'
  },
  {
    label: 'Specialistica',
    value: 'specialistica'
  }
]
export const TYPE_USER = [
  {
    label: 'Autenticato',
    value: 'autenticato'
  },
  {
    label: 'Non Autenticato',
    value: 'anonimo'
  }
]
export const TYPE_DELEGATIONS = [
  {
    label: 'Delega Adulto',
    value: 'adulto'
  },
  {
    label: 'Delega Minore',
    value: 'minore'
  }
]
export const TICKET_LENGTH = 27
// export const ACCEPTED_FILES_TYPES = ['application/pdf','application/doc','application/msword','application/docx',
//   'application/excel','application/xlsx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip',
//   'image/png','image/gif','image/jpeg']
// export const ACCEPTED_FILES_EXTENSIONS =   ['.pdf', '.doc', '.docx','.xls', '.xlsx', '.zip', '.png', '.gif', '.jpeg']
// export const MAX_SIZE_FILE = 1048576
export const TYPE_ACCESS_OPTIONS = [
  {
    label: 'SPID',
    value: 'spid'
  },
  {
    label: 'CIE',
    value: 'cie'
  },
  {
    label: 'TNS',
    value: 'tns'
  },
  {
    label: 'credenziale rilasciata da Certification Autority',
    value: 'cretification_authority'
  }
]

export const APP_SERVICES_MAP = {
  ROL: 'ritiroreferti',
  ESENRED: 'ESENRED',
  PRESCRIPTIONS: 'promem',
  PTW: 'PTW',
  DELEGATIONS: 'deleghe',
  CELIAC: 'BUONO_CELIACHIA',
  ACCESS: 'HOME',
  SCEREV: 'SCEREV',
  SIRVA: 'SIRVA',
  CONSENSI: 'CONSENSI',
  COVID: 'SOLCOVID',
  ESENPAT: 'ESENPAT',
  SCREENING: 'riscre',
  RESERVATIONS: 'RESERVATIONS',
  TROVAUN: 'TROVAUN',
  FFE: 'FFE',
  FSE: 'FSE',
  TAC: 'FSETAC',
  ESCON: 'ESTRATTO_CONTO',
  FARAB: 'FARAB'
}

export const MESSAGE_AUTHOR_MAP = {
  STATUS: IS_PROD ?  'automatico' : 'stato' ,
  OPERATOR: 'operatore',
  CITIZEN: 'cittadino',
  ASSIGNMENT: 'assegnazione'
}

export const REQUEST_STATUS_MAP = {
  NEW: '1',
  OPEN: '2',
  PENDING: '9',
  SOLVED: '8',
  CLOSE: '4'
}


export const ADDITIONAL_INFO_LABEL = '*@*informazioni aggiuntive*@*'
export const ASSISTANCE_TREE_PATH_TAG = '*@*percorso albero degli aiuti*@*'

export const CSI_GROUP= {
  id: 2,
  description: 'Regione Piemonte'
}
