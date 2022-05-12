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
  UNKNOWN: "999"
};

// CODICI DELLE OPERAZIONI SULLE ETICHETTE DI UN DOCUMENTO
export const TAG_OPERATION_TYPE_CODE_MAP = {
  ADD: "ASSOCIAZIONE",
  REMOVE: "DISASSOCIAZIONE"
};

// CODICI APPLICATIVI USATI DAL GIALLO DI FSE
export const APP_CODE_MAP = {
  FSE: "FSEDOC",
  PATHOLOGY_EXCEPTION: "FSEESE"
};

export const TAG_TYPE_MAP = {
  // FIXED: "tag_fisso",
  // PERSONAL: "etichetta_personale"
  FIXED: "ANATOMICA",
  PERSONAL: "PERSONALE"
};

export const TAG_FIXED_CODE_MAP = {
  ARMS: 1,
  HAIR: 2,
  BRAIN: 3,
  GALLBLADDER: 4, // Colecisti
  HEART: 5,
  TEETH: 6,
  LIVER: 7, // Fegato
  LEGS: 8,
  ENDOCRINE_GLANDS: 9, // Ghiandole endocrine
  INTESTINE: 10,
  TONGUE: 11,
  HANDS: 12,
  SPLEEN: 13, // Milza
  MUSCLES: 14,
  EYES: 15,
  BONES: 16,
  OVARIES: 17, // Ovaie
  PANCREAS: 18,
  SKIN: 19,
  FEET: 20,
  LUNGS: 21, // Polmoni
  PROSTATE: 22,
  KIDNEYS: 23, // Reni
  BACK: 24,
  CARDIOVASCULAR_SYSTEM: 25,
  IMMUNE_SYSTEM: 26,
  NERVOUS_SYSTEM: 27,
  RESPIRATORY_SYSTEM: 28,
  REPRODUCTIVE_SYSTEM: 29,
  STOMACH: 30
};

// Quali sono le etichette personali che appartengono alla "Testa"?
export const TAG_FIXED_ID_LIST_HEAD = [
  TAG_FIXED_CODE_MAP.HAIR,
  TAG_FIXED_CODE_MAP.BRAIN,
  TAG_FIXED_CODE_MAP.TEETH,
  TAG_FIXED_CODE_MAP.TONGUE,
  TAG_FIXED_CODE_MAP.EYES
];

// Quali sono le etichette personali che appartengono al "Torace"?
export const TAG_FIXED_ID_LIST_CHEST = [
  TAG_FIXED_CODE_MAP.HEART,
  TAG_FIXED_CODE_MAP.LUNGS
];

// Quali sono le etichette personali che appartengono all'"Addome"?
export const TAG_FIXED_ID_LIST_ABDOMEN = [
  TAG_FIXED_CODE_MAP.GALLBLADDER,
  TAG_FIXED_CODE_MAP.LIVER,
  TAG_FIXED_CODE_MAP.INTESTINE,
  TAG_FIXED_CODE_MAP.SPLEEN,
  TAG_FIXED_CODE_MAP.PANCREAS,
  TAG_FIXED_CODE_MAP.KIDNEYS,
  TAG_FIXED_CODE_MAP.STOMACH
];

// Quali sono le etichette personali che appartengono al "Bacino"?
export const TAG_FIXED_ID_LIST_PELVIS = [
  TAG_FIXED_CODE_MAP.OVARIES,
  TAG_FIXED_CODE_MAP.PROSTATE,
  TAG_FIXED_CODE_MAP.REPRODUCTIVE_SYSTEM
];

// Quali sono le etichette personali che appartengono agli "Arti"?
export const TAG_FIXED_ID_LIST_LIMBS = [
  TAG_FIXED_CODE_MAP.ARMS,
  TAG_FIXED_CODE_MAP.LEGS,
  TAG_FIXED_CODE_MAP.HANDS,
  TAG_FIXED_CODE_MAP.FEET
];

// Quali sono le etichette personali che non possono essere associate a parti del corpo
export const TAG_FIXED_ID_LIST_OTHER = [
  TAG_FIXED_CODE_MAP.ENDOCRINE_GLANDS,
  TAG_FIXED_CODE_MAP.MUSCLES,
  TAG_FIXED_CODE_MAP.BONES,
  TAG_FIXED_CODE_MAP.SKIN,
  TAG_FIXED_CODE_MAP.BACK,
  TAG_FIXED_CODE_MAP.CARDIOVASCULAR_SYSTEM,
  TAG_FIXED_CODE_MAP.IMMUNE_SYSTEM,
  TAG_FIXED_CODE_MAP.NERVOUS_SYSTEM,
  TAG_FIXED_CODE_MAP.RESPIRATORY_SYSTEM
];

export const DOCUMENT_CATEGORY_MAP = {
  FSE: "FSE",
  PERSONAL: "PERSONALE"
};

export const DOCUMENT_HIDE_TYPE_MAP = {
  FSE: "DOC",
  PERSONAL: "DOCPER",
  EXEMPTION: "ESE",
  SCREENING: "SCR"
};

export const ASSOCIATION_OPERATION_TYPE_MAP = {
  NRE: "NRE",
  EPISODE_PS: "NUMERO_PASSAGGIO_PS",
  EPISODE_SDO: "NUMERO_SDO"
};

export const HIDE_OPERATION_TYPE_MAP = {
  HIDE: "OSCURAMENTO",
  UNHIDE: "DEOSCURAMENTO"
};

export const DOCUMENT_COUNTS_TYPE_MAP = {
  EPISODE: "EPISODIO",
  FSE: "AREA_BLU",
  TAG: "ETICHETTA"
};

export const DOCUMENT_SIGN_CODE_MAP = {
  GOLD: "G",
  SILVER: "S",
  BRONZE: "B"
};

export const DOCUMENT_DOCTOR_TYPE_MAP = {
  REFERENT: "R",
  VALIDATING: "V"
};

export const DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP = {
  // TEXT: "string",
  TEXT: "TRASCRIZIONE",
  ATTACHMENT: "ALLEGATO"
};

export const DOCUMENT_IMAGE_OS_MAP = {
  WINDOWS: "WINDOWS",
  UNIX: "UNIX",
  MAC: "MAC"
};

// TIPOLOGIE DOCUMENTO
// ---------------------------------------------------------------------------------------------------------------------
// Mappa dei possibili tipi di documento
export const DOCUMENT_TYPE_CODE_MAP = {
  // 1       DEA_VERBALE         VERBALE PS
  VERBAL: "DEA_VERBALE",
  // 2       DEA_TRIAGE          TRIAGE
  TRIAGE: "DEA_TRIAGE",
  // 3       REFERTO             REFERTO
  REPORT: "REFERTO",
  // 4       ANAMNESI            ANAMNESI
  HISTORY: "ANAMNESI",
  // 5       SDO                 SDO
  SDO: "SDO",
  // 6       LET_DIMISSIONE      LETTERA DI DIMISSIONE
  DISCHARGE: "LET_DIMISSIONE",
  // 7       REFERTO_CICLO       REFERTO-CICLO
  CYCLE_REPORT: "REFERTO_CICLO",
  // 8       ATTO_OPERATORIO     ATTO OPERATORIO
  OPERATIVE_ACT: "ATTO_OPERATORIO",
  // 9       REFERTO_LIS         REFERTO LIS
  LIS_REPORT: "REFERTO_LIS",
  // 10      REFERTO_RIS         REFERTO REFERTO DI RADIOLOGIA
  RADIOLOGY_REPORT: "REFERTO_RIS",
  // 11      REFERTO_AP          REFERTO DI ANATOMIA PATOLOGICA
  PATHOLOGICAL_ANATOMY_REPORT: "REFERTO_AP",
  // 12      34105-7             LETTERA DI DIMISSIONE OSPEDALIERA
  DISCHARGE_LETTER: "34105-7",
  // 13      59258-4             VERBALE DI PRONTO SOCCORSO
  FIRST_AID_REPORT: "59258-4",
  // 14      11502-2             REFERTO DI LABORATORIO
  LAB_REPORT: "11502-2",
  // 15      68604-8             REFERTO DI RADIOLOGIA
  RADIOLOGY_REPORT_2: "68604-8",
  // 16      11526-1             REFERTO DI ANATOMIA PATOLOGICA
  PATHOLOGICAL_ANATOMY_REPORT_2: "11526-1",
  // 17      11488-4             REFERTO SPECIALISTICO
  SPECIALIZED_REPORT: "11488-4",
  // CODICI DI RICETTE che non hanno a che fare con ROL
  // 18      57833-6             PRESCRIZIONE FARMACEUTICA
  // 23      57832-8             PRESCRIZIONE DIAGNOSTICA O SPECIALISTICA
  // 24      29304-3             EROGAZIONE FARMACEUTICA
  // 26      81223-0             EROGAZIONE SPECIALISTICA
  // CODICI DI VACCINAZIONI che non hanno a che fare con ROL
  // 27      REG-87273-9         SCHEDA VACCINALE
  VACCINATION_CARD: "REG-87273-9",
  VACCINATION_CARD_2: "87273-9",
  // 28      REG-82593-5         CERTIFICATO VACCINALE
  VACCINATION_CERTIFICATE: "REG-82593-5",
  VACCINATION_CERTIFICATE_2: "82593-5"
};

// Quali sono i tipi di referto che possono essere pagati?
export const DOCUMENT_TYPE_CODE_LIST_PAYABLE = Object.values(
  DOCUMENT_TYPE_CODE_MAP
);

// quali sono i tipi di referto per cui è disponibile download delle immagini?
export const DOCUMENT_TYPE_CODE_LIST_IMAGE_DOWNLOADABLE = [
  DOCUMENT_TYPE_CODE_MAP.RADIOLOGY_REPORT,
  DOCUMENT_TYPE_CODE_MAP.RADIOLOGY_REPORT_2
];

// PAGAMENTO
// ---------------------------------------------------------------------------------------------------------------------
export const PAYMENT_STATUS_CODE_MAP = {
  // Il cittadino ha pagato completamente il documento
  PAYED: "S",
  // Il cittadino non ha ancora pagato il documento
  NOT_PAYED: "N",
  // Il cittadino ha pagato solo parzialmente il documento
  PARTIALLY_PAYED: "P",
  // Non si conosce lo stato attuale del pagamento
  UNDEFINED: "U",
  // Il cittadino è esente dal pagamento del documento
  EXEMPT: "E",
  // Al cittadino spetta un rimborso per questo documento
  REFUND: "R",
  // Questo documento è sempre scaricabile. Indipendentemente dal fatto che
  // debba essere pagato o meno
  FREE: "F"
};

export const PAYMENT_STATUS_LABEL_MAP = {
  [PAYMENT_STATUS_CODE_MAP.PAYED]: "Pagato",
  [PAYMENT_STATUS_CODE_MAP.NOT_PAYED]: "Da pagare",
  [PAYMENT_STATUS_CODE_MAP.PARTIALLY_PAYED]: "Pagato parzialmente",
  [PAYMENT_STATUS_CODE_MAP.UNDEFINED]: "in fase di aggiornamento",
  [PAYMENT_STATUS_CODE_MAP.EXEMPT]: "Esente",
  [PAYMENT_STATUS_CODE_MAP.REFUND]: "Da rimborsare"
};

export const DOCUMENT_EXPIRING_DAYS = 5;

// Quali sono gli stati di pagamento per cui è ammesso il download del pagamento?
export const PAYMENT_STATUS_CODE_LIST_DOWNLOADABLE_PDF = [
  null,
  PAYMENT_STATUS_CODE_MAP.PAYED,
  PAYMENT_STATUS_CODE_MAP.EXEMPT,
  PAYMENT_STATUS_CODE_MAP.UNDEFINED,
  PAYMENT_STATUS_CODE_MAP.FREE,
  PAYMENT_STATUS_CODE_MAP.REFUND
];

// Quali sono gli stati per cui considerare il pagamento come "da effettuare"?
export const PAYMENT_STATUS_CODE_LIST_PAYABLE = [
  PAYMENT_STATUS_CODE_MAP.NOT_PAYED,
  PAYMENT_STATUS_CODE_MAP.PARTIALLY_PAYED
];

// IMMAGINE
// ---------------------------------------------------------------------------------------------------------------------
// Mappa dei possibili stati della richiesta del download dell'immagine
export const IMAGE_STATUS_CODE_MAP = {
  NULL: null,
  ERRORE_WS: "ERRORE_WS",
  NON_PRESENTE: "RICHIESTA_NON_PRESENTE",
  SCARICATO: "SCARICATO",
  DA_ELABORARE: "DA_ELABORARE",
  ELAB_IN_CORSO: "ELAB_IN_CORSO",
  DISPONIBILE: "DISPONIBILE",
  INVIO_MAIL_IN_CORSO: "INVIO_MAIL_IN_CORSO",
  ERRORE_INVIO_MAIL: "ERRORE_INVIO_MAIL",
  NOTIFICATO: "NOTIFICATO",
  COMPOSIZIONE_PACCHETTO_SOSPESA: "COMPOSIZIONE_PACCHETTO_SOSPESA",
  ERRORE_COMPONI_PACCHETTO: "ERRORE_COMPONI_PACCHETTO",
  PACCHETTO_DA_CANCELLARE: "PACCHETTO_DA_CANCELLARE",
  PACCHETTO_IN_CANCELLAZIONE: "PACCHETTO_IN_CANCELLAZIONE",
  CANCELLAZIONE_PACCHETTO_SOSPESA: "CANCELLAZIONE_PACCHETTO_SOSPESA",
  ERRORE_IN_CANCELLAZIONE_PACCHETTO: "ERRORE_IN_CANCELLAZIONE_PACCHETTO",
  PACCHETTO_CANCELLATO: "PACCHETTO_CANCELLATO"
};

// quali sono gli stati dell'immagine per cui l'utente può prenotarla?
export const IMAGE_STATUS_CODE_LIST_BOOKABLE = [
  IMAGE_STATUS_CODE_MAP.NULL,
  IMAGE_STATUS_CODE_MAP.NON_PRESENTE,
  IMAGE_STATUS_CODE_MAP.PACCHETTO_DA_CANCELLARE,
  IMAGE_STATUS_CODE_MAP.PACCHETTO_IN_CANCELLAZIONE,
  IMAGE_STATUS_CODE_MAP.PACCHETTO_CANCELLATO,
  IMAGE_STATUS_CODE_MAP.CANCELLAZIONE_PACCHETTO_SOSPESA,
  IMAGE_STATUS_CODE_MAP.ERRORE_IN_CANCELLAZIONE_PACCHETTO
];

// Quali sono gli stati per cui l'immagine risulta "in eleborazione"
export const IMAGE_STATUS_CODE_LIST_IN_ELABORATION = [
  IMAGE_STATUS_CODE_MAP.ELAB_IN_CORSO,
  IMAGE_STATUS_CODE_MAP.DA_ELABORARE,
];


// Quali sono gli stati dell'immagine per cui l'utente deve contattare l'assistenza?
export const IMAGE_STATUS_CODE_LIST_ERROR = [
  IMAGE_STATUS_CODE_MAP.ERRORE_WS,
  IMAGE_STATUS_CODE_MAP.ERRORE_COMPONI_PACCHETTO,
  IMAGE_STATUS_CODE_MAP.COMPOSIZIONE_PACCHETTO_SOSPESA
];

// quali sono gli stati dell'immagine per cui l'utente può scaricarla?
export const IMAGE_STATUS_CODE_LIST_DOWNLOADABLE = [
  IMAGE_STATUS_CODE_MAP.DISPONIBILE,
  IMAGE_STATUS_CODE_MAP.INVIO_MAIL_IN_CORSO,
  IMAGE_STATUS_CODE_MAP.NOTIFICATO,
  IMAGE_STATUS_CODE_MAP.ERRORE_INVIO_MAIL,
  IMAGE_STATUS_CODE_MAP.SCARICATO
];

// Indica se attivare i nuovi messaggi di arruolamento
export const IS_NEW_ENROLLABLE_ACTIVE = true;
