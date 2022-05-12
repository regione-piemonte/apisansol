/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config';
import store from '@store/index';

export const HOME = {
  path: '',
  name: 'changeDoctorHome',
  component: () => import('pages/change-doctor/PageAuthHome'),
  meta: {
    prettyName: 'Home',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};


export const NEW_ADDRESS = {
  path: 'cambia-indirizzi',
  name: 'changeAuthAddress',
  component: () => import('pages/change-doctor/PageAuthChangeAddress'),
  meta: {
    prettyName: 'Cambia indirizzi',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};


export const DOCTOR_DETAIL = {
  path: 'medici/:id',
  name: 'changeDoctorDetail',
  component: () => import('pages/change-doctor/PageDoctorDetail'),
  meta: {
    prettyName: 'Scheda medico',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const SEARCH_DOCTOR = {
  path: 'cerca-medici',
  name: 'changeDoctorSearch',
  component: () => import('pages/change-doctor/PageChangeDoctorSearch'),
  meta: {
    prettyName: 'Cerca medico',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};


export const SEARCH_DOCTOR_RESULTS = {
  path: 'medici',
  name: 'changeDoctorResults',
  component: () => import('pages/change-doctor/PageChangeDoctorResults'),
  meta: {
    prettyName: 'Elenco medici',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const RENEW_ASSISTANCE = {
  path: 'richiesta/:id/rinnovo-assistenza',
  name: 'renewAssistance',
  component: () => import('pages/change-doctor/PageRenewAssistance'),
  meta: {
    prettyName: 'Rinnovo Assistenza',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const DOCTOR_ANOTHER_REGION = {
  path: 'richiesta/:id/medico-altra-regione',
  name: 'doctorAnotherRegion',
  component: () => import('pages/change-doctor/PageDoctorAnotherRegion'),
  meta: {
    prettyName: 'Medico altra regione',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const ADDITIONAL_INFORMATION = {
  path: 'richiesta/:id/informazioni-supplementari',
  name: 'additionalInformation',
  component: () => import('pages/change-doctor/PageAdditionalInformation'),
  meta: {
    prettyName: 'Informazioni supplementari',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const FAMILY_REUNIFICATION = {
  path: 'richiesta/:id/ricongiungimento-familiare',
  name: 'familyReunification',
  component: () => import('pages/change-doctor/PageFamilyReunification'),
  meta: {
    prettyName: 'Ricongiungimento familiare',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const CONFIRM_DOCTOR_CHOICE = {
  path: 'richiesta/:id/conferma-scelta',
  name: 'confirmChoice',
  component: () => import('pages/change-doctor/PageChangeDoctorConfirmChoice'),
  meta: {
    prettyName: 'Conferma scelta',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const DOCUMENTATION_REQUIRED = {
  path: 'richiesta/:id/allegati',
  name: 'documentationRequired',
  component: () => import('pages/change-doctor/PageDocumentationRequired'),
  meta: {
    prettyName: 'Richiesta Documentazione',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const REQUEST_FEEDBACK = {
  path: 'richiesta-completata',
  name: 'requestFeedback',
  component: () => import('pages/change-doctor/PageChangeDoctorFeedback'),
  meta: {
    prettyName: 'Richiesta completata',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const REQUEST_DOCTOR_NOT_AVAILABLE = {
  path: 'richiesta/richiesta-rifiutata',
  name: 'doctorNotAvailable',
  component: () => import('pages/change-doctor/PageChangeDoctorNotAvailable'),
  meta: {
    prettyName: 'Posti non disponibili',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  }
};

export const FAQ = {
  path: 'faq',
  name: 'changeDoctorHelpFaq',
  component: () => import('pages/change-doctor/PageHelpFaq'),
  meta: {
    prettyName: 'Faq',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    isPublic: true,
    analyticsIgnore: true
  }
};

export const CONTACTS = {
  path: 'contatti',
  name: 'changeDoctorHelpContacts',
  component: () => import('pages/change-doctor/PageHelpContacts'),
  meta: {
    prettyName: 'Contatti',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    isPublic: true,
    analyticsIgnore: true
  }
};

export const HELP = {
  path: 'aiuto',
  name: 'changeDoctorHelp',
  component: () => import('pages/change-doctor/PageHelp'),
  meta: {
    prettyName: 'Help',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    isPublic: true,
    analyticsIgnore: true
  },
  children: [
    CONTACTS,
    FAQ
  ]
};


export const POLICY = {
  path: 'policy',
  name: 'changeDoctorPolicy',
  component: () => import('pages/change-doctor/PagePolicy'),
  meta: {
    prettyName: 'Policy',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true,
    isPublic: true,
  }
};

export const APP = {
  path: 'il-mio-medico',
  name: 'AppChangeDoctor',
  redirect: HOME,
  component: () => import('pages/change-doctor/AppChangeDoctor'),
  meta: {
    prettyName: 'Il mio medico',
    appServiceCode: config.global.appServiceCodes.changeDoctor,
    analyticsIgnore: true
  },
  children: [
    HOME,
    SEARCH_DOCTOR,
    SEARCH_DOCTOR_RESULTS,
    DOCTOR_DETAIL,
    NEW_ADDRESS,
    RENEW_ASSISTANCE,
    DOCTOR_ANOTHER_REGION,
    ADDITIONAL_INFORMATION,
    FAMILY_REUNIFICATION,
    DOCUMENTATION_REQUIRED,
    REQUEST_FEEDBACK,
    CONFIRM_DOCTOR_CHOICE,
    REQUEST_DOCTOR_NOT_AVAILABLE,
    FAQ,
    CONTACTS,
    HELP,
    POLICY

  ]

};



