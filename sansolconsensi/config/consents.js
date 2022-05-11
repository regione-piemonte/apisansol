/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

let config = {};

config.availableStatuses = {
  ACTIVATED: 'A',
  REVOKED: 'R',
  NOT_EXPRESSED: 'NON ESPRESSO',
  EXPIRED: 'S'
};
config.reverseAvailableStatuses = {
  A: 'Attivo',
  R: 'Revocato',
  N: 'Non espresso',
  S: 'Scaduto',
};

config.types = {
  REGIONAL: 'R',
  CORPORATE: 'A'
};
config.color = {
  A: 'green-10',
  N: 'grey',
  R: 'negative',
  S: 'negative',
};


config.consentsTypes={
  SUPPLY : 'consenso_alimentazione',
  CONSULTATION: 'consenso_consultazione',
  PREVIOUS: 'consenso_pregresso'
}

config.consentTypesMessages={
  [config.consentsTypes.SUPPLY]: {
    CONSENT: `Confermi di voler dare il consenso all'alimentazione dei tuoi documenti sanitari?`,
    NO_CONSENT:  `Confermi di voler togliere il consenso all'alimentazione dei tuoi documenti sanitari?`,
  },
  [config.consentsTypes.CONSULTATION]: {
    CONSENT: `Confermi di voler dare il consenso alla consultazione dei tuoi documenti da parte degli operatori sanitari?`,
    NO_CONSENT:  `Confermi di voler togliere il consenso alla consultazione dei tuoi documenti da parte degli operatori sanitari?`,
  },
  [config.consentsTypes.PREVIOUS]: {
    CONSENT: `Confermi di voler dare il consenso al recupero dei tuoi documenti pregressi?`,
    NO_CONSENT:  `Confermi di voler togliere il consenso al recupero dei tuoi documenti pregressi?`,
  }
}

export default config
