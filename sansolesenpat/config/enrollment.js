/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

let config = {};

config.termsAndConditionsVersion = '010^0252';

config.codes = {
  // Il soggetto  ha chiesto che non gli venisse più suggerito l’apertura del fascicolo.
  DO_NOT_ASK_ME_AGAIN: '000',
  // Il soggetto non è piemontese
  NO_PIEDMONT: '001',
  // Il soggetto non è maggiorenne
  NO_ADULT: '002',
  // Il soggetto ha un FSE con alimentazione a SI
  FSE_APPROVED: '003',
  // Il soggetto è piemontese, maggiorenne ma non ha un FSE
  NO_FSE: '004',
  // Il soggetto è piemontese, maggiorenne ma ha un FSE con alimentazione valorizzata a NO
  FSE_NOT_APPROVED: '005',
  FSE_NOT_CONSENTS: '008',
  FSE_NOT_CONSENTS_2: '009',
  NEW_POLICY: '010',
  NEW_POLICY_DELEGATION: '011',
  OTHER_REGION: '012',
  CONSENT_NOT_AUTHORIZED: '013',
  DATA_TRANSFER: '014',
  FSE_ACTIVATED: '016',
  UNKNOWN: '999',
};


config.serviceCodes = {
  name: 'CODE'
}

config.enrollmentFlowUrl=  "/la-mia-salute/arruolamento/#/";

export default config;
