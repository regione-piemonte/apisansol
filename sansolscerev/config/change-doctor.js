/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

let config = {};

config.assistanceStatus = {
  ACTIVE: 'ATTIVA',
  INACTIVE: 'NON ATTIVA',

};

config.assistanceTypes ={
  UNLIMITED : 'ILLIMITATA',
  TEMPORARY: 'TEMPORANEA',
  EXPIRED: 'SCADUTA',
  NOASSISTANCE:'NESSUNA ASSISTENZA'
};

config.manageMonitoring = {
  ADD: 'A',
  DELETE: 'D'
};

config.gender={
  M : { label: 'Maschio', value:'M'},
  F : { label: 'Femmina', value:'F'},
};

config.doctorsType={
  PLS : 'PLS',
  MMG : 'MMG'
};

config.doctorsTypeLabel={
  PLS : 'Pediatri',
  MMG : 'Medici'
};



config.availabilityTypesMessage_MMG = {
    MMG_000 :  {
      isSelectable: false,
      bgColor:'red-2',
      info:'Il medico non ha attualmente posti disponibili.',
      iconName:'cancel'
    },
    MMG_001 : {
      isSelectable: true,
      bgColor:'info',
      info:"Il medico ha posti disponibili solo per l'assistenza temporanea.",
      iconName:'info'
    },
    MMG_010 : {
      isSelectable: true,
      bgColor:'info',
      info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del tuo familiare.",
      iconName:'info'
    },
    MMG_011 : {
      isSelectable: true,
      bgColor:'info',
      info:"Il medico ha posti disponibili solo per il ricongiungimento familiare oppure per l'assistenza temporanea.",
      iconName:'info'
    },
    MMG_110 : {
      isSelectable: true,
      bgColor:'info',
      info:"il medico ha posti disponibili ma non per l'assistenza temporanea.",
      iconName:'info'
    },
    MMG_111 : {
      isSelectable: true,
      bgColor:'info',
      info:"Il medico ha posti disponibili.",
      iconName:'info'
    }
};

config.availabilityTypesMessage_PLS ={
  PLS_0000 : {
    isSelectable: false,
    bgColor:'red-2',
    info:"Il medico non ha attualmente posti disponibili.",
    iconName:'cancel'
  },
  PLS_0001 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico non ha attualmente posti disponibili, ma è possibile richiedere assistenza temporanea.",
    iconName:'info'
  },
  PLS_0010 : {
    isSelectable: true,
    bgColor:'red-2',
    info:"Il medico non ha attualmente posti disponibili.",
    iconName:'cancel'
  },
  PLS_0011 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico non ha attualmente posti disponibili, ma è possibile richiedere assistenza temporanea.",
    iconName:'info'
  },
  PLS_0100 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del  familiare. Non sono disponibili posti per i bambini al di sotto dei 6 anni.",
    iconName:'info'
  },
  PLS_0101 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del  familiare. Non sono disponibili posti per i bambini al di sotto dei 6 anni. È possibile richiedere l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_0110 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del tuo familiare.",
    iconName:'info'
  },
  PLS_0111 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico ha posti disponibili solo per il ricongiungimento familiare: puoi chiedere la scelta in deroga indicando i dati del tuo familiare. È possibile richiedere l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_1100 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico ha posti disponibili solo per i bambini che abbiano già compiuto i 6 anni. Non è ammessa l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_1101 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico ha posti disponibili solo per i bambini che abbiano già compiuto i 6 anni o per i casi in cui è ammessa l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_1110 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico ha posti disponibili, ma non per i casi in cui è prevista l'assistenza temporanea.",
    iconName:'info'
  },
  PLS_1111 : {
    isSelectable: true,
    bgColor:'info',
    info:"Il medico ha posti disponibili.",
    iconName:'info'
  },

};

config.DomicileReasons={
  LAVORO : '1',
  STUDIO : '2',
  CURA: '3',
  RICONGIUNGIMENTO_DEROGA: '4',
  RICONGIUNGIMENTO: '5',
  SALUTE:'6'
};


config.RequestStates={

  BOZZA : '1',
  INVIATA: '2',
  ANNULLATA: '3',
  IN_LAVORAZIONE: '4',
  IN_REVISIONE: '5',
  COMPLETATA: '6',
  RESPINTA: '7',
  CHIUSA: '8'
};

config.RequestStatesLabel={
 BOZZA: {
   bgColor:'info',
   msg:`Richiesta in bozza, allega la documentazione necessaria prima di inviarla.`,
  },
  INVIATA:{
    bgColor:'info',
    msg:`Richiesta inviata, attendi che venga elaborata da un operatore dell'ASL.`,
  },
  IN_LAVORAZIONE:{
    bgColor:'info',
    msg:`Richiesta inviata, attendi che venga elaborata da un operatore dell'ASL.`,
  },
  IN_REVISIONE:{
    bgColor:'red-2',
    msg:`Richiesta da modificare, controlla le indicazioni fornite dall'operatore dell'ASL.`,
  }
};

config.fixedAttachments=[
  {
    tipo : '1',
    descrizione: 'Carta Identità del delegante - Fronte',
    stranieri: false
  },
  {
    tipo : '2',
    descrizione: 'Carta Identità del delegante - Retro',
    stranieri: false
  },

  {
    tipo : '3',
    descrizione: 'Consenso del medico',
    stranieri: false
  },
  {
    tipo : '4',
    descrizione: 'Documentazione clinica (firmata digitalmente)',
    stranieri: false
  },
  {
    tipo : '5',
    descrizione: 'Modulo di richiesta firmato dal delegante',
    stranieri: false
  },
  {
    tipo : '18',
    descrizione: 'Revoca medico precedente',
    stranieri: false
  }
];


config.derogationType={
  TERRITORIALE: {
    msg:`Il medico che hai scelto appartiene ad un ambito territoriale diverso da quello del tuo domicilio.
        Se desideri proseguire nella scelta dovrai allegare, anche in un secondo momento, il consenso firmato del nuovo medico.
         Una volta completata, la tua richiesta verrà presa in carico dagli operatori del servizio.`,
  },
  ASSOCIAZIONE:{
    msg:`Il medico che hai scelto appartiene alla stessa associazione medici del tuo medico precedente.
    Se desideri proseguire nella scelta dovrai allegare, anche in un secondo momento, il consenso firmato del nuovo medico.
     Una volta completata, la tua richiesta verrà presa in carico dagli operatori del servizio.`,
  },
  PLS:{
    msg:`Il medico che hai scelto è un Pediatra.
    Secondo il regolamento regionale gli assistiti di età compresa tra i 14 ed i 16 anni possono richiedere un medico Pediatra in deroga  allegando, anche in un secondo momento, il consenso firmato del medico.
    Una volta completata, la tua richiesta verrà presa in carico dagli operatori del servizio.`,
  },
  MMG:{
    msg:`Il medico che hai scelto è un Medico di Medicina Generale.
Secondo il regolamento regionale gli assistiti di età compresa tra i 6 ed i 14 anni possono richiedere un Medico di Medicina Generale in deroga  allegando, anche in un secondo momento, il consenso firmato del medico.
Una volta completata, la tua richiesta verrà presa in carico dagli operatori del servizio.`,
  }
};


config.relationshipOptions=[
  { label: 'Coniuge', value: 'CONIUGE' },
  { label: 'Figlio', value: 'FIGLIO' },
  { label: 'Genitore', value: 'GENITORE' },
  { label: 'Fratello', value: 'FRATELLO' },
  { label: 'Sorella', value: 'SORELLA' },
  { label: 'Cugino/a', value: 'CUGINO' },
  { label: 'Zio/a', value: 'ZIO' },
  { label: 'Suocero/a', value: 'SUOCERO/A' },
  { label: 'Nuora', value: 'NUORA' },
  { label: 'Genero', value: 'GENERO' },
  { label: 'Cognato/a', value: 'COGNATO/A' },
  { label: 'Nonno/a', value: 'NONNO' },
  { label: 'Nipote', value: 'NIPOTE' },
  { label: 'Convivente', value: 'CONVIVENTE' },
  { label: 'Altro', value: 'ALTRO' }
];

config.streetTypes = [
  {
    full_string: 'via',
    abbreviation: 'v.'
  },
  {
    full_string: 'corso',
    abbreviation: 'c.so'
  },
  {
    full_string: 'corso',
    abbreviation: 'c.'
  },
  {
    full_string: 'piazza',
    abbreviation: 'p.zza'
  },
  {
    full_string: 'strada',
    abbreviation: 'st.'
  },
];


export default config
