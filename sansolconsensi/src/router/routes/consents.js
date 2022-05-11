/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config';

export const HOME = {
  path: '',
  name: 'consentsHome',
  component: () => import('pages/consents/PageConsentsHome'),
  meta: {
    prettyName: 'Home',
    appServiceCode: config.global.appServiceCodes.consents,
    analyticsIgnore: true,
    showEnrollmentAlert:true,
    isVisibleToMinor: true,
  }
};

export const CONSENT_DETAIL = {
  path: ':id',
  name: 'ConsentDetail',
  component: () => import('pages/consents/PageConsent'),
  meta: {
    prettyName: 'Dettaglio consenso',
    appServiceCode: config.global.appServiceCodes.consents,
    analyticsIgnore: true,
    showEnrollmentAlert:true,
    isVisibleToMinor: true,
  }
};

export const CONSENT_DETAIL_FSE = {
  path: 'fse',
  name: 'ConsentDetailFse',
  component: () => import('pages/consents/PageConsentFse'),
  meta: {
    prettyName: 'Dettaglio consenso',
    appServiceCode: config.global.appServiceCodes.consents,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const CONSENT_POLICY_FSE = {
  path: 'fse/informativa-privacy',
  name: 'ConsentDetailFsePolicy',
  component: () => import('pages/consents/PageConsentFsePolicy'),
  meta: {
    prettyName: 'Fse Informativa privacy',
    appServiceCode: config.global.appServiceCodes.consents,
    analyticsIgnore: true,
    showEnrollmentAlert:true,
    isVisibleToMinor: true,
  }
};

export const CONSENT_SUCCESS = {
  path: ':id/successo',
  name: 'ConsentSuccess',
  component: () => import('pages/consents/PageConsentSuccess'),
  meta: {
    prettyName: 'Consenso attivato',
    appServiceCode: config.global.appServiceCodes.consents,
    analyticsIgnore: true,
    showEnrollmentAlert:true,
    isVisibleToMinor: true,
  }
};

export const CONSENT_SUCCESS_FSE = {
  path: 'fse/successo',
  name: 'ConsentSuccessFse',
  component: () => import('pages/consents/PageConsentFseSuccess'),
  meta: {
    prettyName: 'Consenso attivato',
    appServiceCode: config.global.appServiceCodes.consents,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const FAQ = {
  path: 'faq',
  name: 'consentsHelpFaq',
  component: () => import('pages/consents/PageHelpFaq'),
  meta: {
    prettyName: 'Faq',
    appServiceCode: config.global.appServiceCodes.consents,
    isPublic: true,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const CONTACTS = {
  path: 'contatti',
  name: 'consentsHelpContacts',
  component: () => import('pages/consents/PageHelpContacts'),
  meta: {
    prettyName: 'Contatti',
    appServiceCode: config.global.appServiceCodes.consents,
    isPublic: true,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};



export const APP = {
  path: 'consensi',
  name: 'consentsApp',
  redirect: HOME,
  component: () => import('pages/consents/AppConsents'),
  meta: {
    prettyName: 'Gestione consensi',
    appServiceCode: config.global.appServiceCodes.consents,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  },
  children: [
    HOME,
    CONTACTS,
    CONSENT_DETAIL_FSE,
    CONSENT_DETAIL,
    CONSENT_POLICY_FSE,
    CONSENT_SUCCESS_FSE,
    CONSENT_SUCCESS,
  ]

};


