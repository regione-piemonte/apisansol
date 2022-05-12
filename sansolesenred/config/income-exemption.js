/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

let config = {};

config.statuss = {
  UNDER_PROCESSING: 'L',
  NOT_VALID: 'N',
  VALID: 'V',
  REVOKED: 'R',
  REVOKED_WITH_BLOCK: 'B',
  EXPIRED: 'S'
};

config.status2Label = {
  [config.statuss.UNDER_PROCESSING]: 'In lavorazione',
  [config.statuss.NOT_VALID]: 'Non valido',
  [config.statuss.VALID]: 'In corso di validità',
  [config.statuss.REVOKED]: 'Revocata',
  [config.statuss.REVOKED_WITH_BLOCK]: 'Revocata con blocco',
  [config.statuss.EXPIRED]: 'Scaduta'
};


// Quali sono gli stati considerati positivi?
config.positiveStatuss = [config.statuss.VALID,];
// Quali sono gli stati considerati negativi?
config.negativeStatuss = [
  config.statuss.NOT_VALID,
  config.statuss.REVOKED,
  config.statuss.REVOKED_WITH_BLOCK,
  config.statuss.EXPIRED
];

// Quali sono gli stati che permettono la revoca dell'esenzione?
config.revocableStatuss = [config.statuss.VALID,];

// quanti giorni prima consideriamo un report vicino alla scadenza?
config.expiringDays = 30;


export default config;
