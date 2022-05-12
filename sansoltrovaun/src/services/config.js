


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


export const SERVICES  = {
  HOSPITALS: "HOSPITALS",
  DOCTORS : "DOCTORS",
  PHARMACIES: "PHARMACIES",
  FACILITIES: "FACILITIES",
  STORES: "STORES",
  TEST: 'TEST',
  TEST_DOCTORS: 'TEST_DOCTORS'
}
export const SERVICES_LABELS  = {
  [SERVICES.HOSPITALS]: {
    name: 'struttura',
    type: 'struttura'
  },
  [SERVICES.DOCTORS]: {
    name: 'medico',
    type: ''
  },
  [SERVICES.PHARMACIES]: {
    name: 'farmacia',
    type: 'farmacia'
  },
  [SERVICES.FACILITIES]: {
    name: 'struttura',
    type: 'assistenza'
  },
  [SERVICES.STORES]: {
    name: 'negozio',
    type: 'negozio'
  },
  [SERVICES.TEST]: {
    name: 'struttura',
    type: 'struttura'
  },
  [SERVICES.TEST_DOCTORS]: {
    name: 'medico',
    type: ''
  }
}

export const BASE_PATHS ={
  doctors : '/apisanscerev/api/v1',
  cross: '/apisancross/api/v1',
  trovaun:'/apisantrovaun/api/v1',
  icons: '/statics/la-mia-salute/icone/'
}

export const SEARCH_LIMIT= 20

//****** MEDICI E PEDIATRI *****//

export const DOCTOR_TYPES={
  MMG : 'MMG',
  PLS : 'PLS'
}

export const  DOCTOR_TYPES_LABEL=[
  {
    label: 'Medici di famiglia',
    value: 'MMG'
  },
  {
    label: 'Pediatri',
    value: 'PLS'
  },
]

//****** Ospedali e case di cura ****///
export const HOSPITAL_TYPES={
  TS_01 : 'TS_01',
  TS_02 : 'TS_02'
}

export const HOSPITALS_ICONS={
  [HOSPITAL_TYPES.TS_01] : 'casa-cura',
  [HOSPITAL_TYPES.TS_02]: 'ospedale',
}


//****** Strutture sanitarie ****///
export const FACILITIES_TYPES= {
  TPA_201: 'TPA_201',
  TPA_202: 'TPA_202',
  TPA_203: 'TPA_203',
  TPA_205: 'TPA_205',
  TPA_206: 'TPA_206',
  TPA_207: 'TPA_207',
  TPA_208: 'TPA_208',
  TPA_209: 'TPA_209',
  TPA_210: 'TPA_210',
  TPA_211: 'TPA_211',
  TPA_212: 'TPA_212',
  TPA_213: 'TPA_213',
  TPA_215: 'TPA_215',
  TPA_216: 'TPA_216',
  TPA_220: 'TPA_220',
  TPA_221: 'TPA_221',
  TPA_224: 'TPA_224',
  TPA_226: 'TPA_226',
  TPA_227: 'TPA_227',
  TPA_228: 'TPA_228',
  TPA_229: 'TPA_229',
  TPA_230: 'TPA_230',
  TPA_231: 'TPA_231',
  TPA_233: 'TPA_233',
  TPA_234: 'TPA_234',
  TPA_235: 'TPA_235',
  TPA_301: 'TPA_301',
  TPA_304: 'TPA_304',
  TPA_305: 'TPA_305',
  TPA_306: 'TPA_306',
  TPA_20520: 'TPA_20520'
}

export const FACILITIES_ICONS={
  [FACILITIES_TYPES.TPA_201]: 'farmacia',
  [FACILITIES_TYPES.TPA_202]: 'infermieristica',
  [FACILITIES_TYPES.TPA_203]: 'radiografia',
  [FACILITIES_TYPES.TPA_205]: 'recupero-riabilitazione-funzionale',
  [FACILITIES_TYPES.TPA_206]: 'consultorio-materno-infantile',
  [FACILITIES_TYPES.TPA_207]: 'psichiatrica',
  [FACILITIES_TYPES.TPA_208]: 'serd',
  [FACILITIES_TYPES.TPA_209]: 'aids',
  [FACILITIES_TYPES.TPA_210]: 'stabilimenti-idrotermali',
  [FACILITIES_TYPES.TPA_211]: 'medico-rsa',
  [FACILITIES_TYPES.TPA_212]: 'disabilita',
  [FACILITIES_TYPES.TPA_213]: 'disabilita-psichica',
  [FACILITIES_TYPES.TPA_215]: 'sisp',
  [FACILITIES_TYPES.TPA_216]: 'spresal',
  [FACILITIES_TYPES.TPA_220]: 'centro-dialisi',
  [FACILITIES_TYPES.TPA_221]: 'centro-salute-mentale',
  [FACILITIES_TYPES.TPA_224]: 'stetoscopio',
  [FACILITIES_TYPES.TPA_226]: 'mano-cuore',
  [FACILITIES_TYPES.TPA_227]: 'residenza-disabili',
  [FACILITIES_TYPES.TPA_228]: 'paziente-letto',
  [FACILITIES_TYPES.TPA_229]: 'diabetologica-1',
  [FACILITIES_TYPES.TPA_230]: 'diabetologica-2',
  [FACILITIES_TYPES.TPA_231]: 'diabetologica-ambulatorio',
  [FACILITIES_TYPES.TPA_233]: 'pillole',
  [FACILITIES_TYPES.TPA_234]: 'ospedale',
  [FACILITIES_TYPES.TPA_235]: 'cavs',
  [FACILITIES_TYPES.TPA_301]: 'riabilitazione-neurologica',
  [FACILITIES_TYPES.TPA_304]: 'riabilitazione-motoria',
  [FACILITIES_TYPES.TPA_305]: 'riabilitazione-psico-sensoriale',
  [FACILITIES_TYPES.TPA_306]: 'neuropsichiatria-infantile',
  [FACILITIES_TYPES.TPA_20520]: 'centro-prelievo',
}


export const DOCTORS_ICONS={
  pediatra_uomo : 'pediatra-uomo',
  pediatra_donna : 'pediatra-donna',
  medico_uomo: 'medico-uomo',
  medico_donna: 'medico-donna'
}


//****** PUNTI VENITA CELIACHIA ****///
export const STORES_TYPES={
  __G__D__O : '__G__D__O',
  __N__e__S__p__P : '__N__e__S__p__P',
  PHARMACIES: 'farmacie'
}

export const PHARMACIES_TYPE={
  codice:'farmacie',
  descrizione: 'Farmacie'
}


export const STORES_ICONS={
  [STORES_TYPES.PHARMACIES] : 'farmacia',
  [STORES_TYPES.__N__e__S__p__P]: 'negozio-celiachia',
  [STORES_TYPES.__G__D__O]: 'negozio-grande-distribuzione'
}


export const AVAILABILITY_PRODUCTS_PHARMACIES={
  AVAILABLE: 'S',
  NOT_AVAILABLE: 'N',
  UNKNOWN: 'U'
}



export const AVAILABILITY_MESSAGE_MMG = {
  MMG_000 :  {
    isSelectable: false,
    color:'negative',
    info:'Il medico non ha attualmente posti disponibili.',
    iconName:'cancel'
  },
  MMG_001 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per l'assistenza temporanea.",
    iconName:'info'
  },
  MMG_010 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del tuo familiare.",
    iconName:'info'
  },
  MMG_011 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare oppure per l'assistenza temporanea.",
    iconName:'info'
  },
  MMG_110 : {
    isSelectable: true,
    color:'info',
    info:"il medico ha posti disponibili ma non per l'assistenza temporanea.",
    iconName:'info'
  },
  MMG_111 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili.",
    iconName:'info'
  }
};

export const AVAILABILITY_MESSAGE_PLS ={
  PLS_0000 : {
    isSelectable: false,
    color:'red-2',
    info:"Il medico non ha attualmente posti disponibili.",
    iconName:'cancel'
  },
  PLS_0001 : {
    isSelectable: true,
    color:'info',
    info:"Il medico non ha attualmente posti disponibili, ma è possibile richiedere assistenza temporanea.",
    iconName:'info'
  },
  PLS_0010 : {
    isSelectable: true,
    color:'negative',
    info:"Il medico non ha attualmente posti disponibili.",
    iconName:'cancel'
  },
  PLS_0011 : {
    isSelectable: true,
    color:'info',
    info:"Il medico non ha attualmente posti disponibili, ma è possibile richiedere assistenza temporanea.",
    iconName:'info'
  },
  PLS_0100 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del  familiare. Non sono disponibili posti per i bambini al di sotto dei 6 anni.",
    iconName:'info'
  },
  PLS_0101 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del  familiare. Non sono disponibili posti per i bambini al di sotto dei 6 anni. È possibile richiedere l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_0110 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del tuo familiare.",
    iconName:'info'
  },
  PLS_0111 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del tuo familiare. È possibile richiedere l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_1100 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per i bambini che abbiano già compiuto i 6 anni. Non è ammessa l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_1101 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili solo per i bambini che abbiano già compiuto i 6 anni o per i casi in cui è ammessa l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_1110 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili, ma non per i casi in cui è prevista l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_1111 : {
    isSelectable: true,
    color:'info',
    info:"Il medico ha posti disponibili.",
    iconName:'info'
  },

};
