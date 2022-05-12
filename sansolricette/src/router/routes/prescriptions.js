/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config';

export const FAQ = {
  path: 'faq',
  name: 'prescriptionsHelpFaq',
  component: () => import('pages/prescriptions/PageHelpFaq'),
  meta: {
    prettyName: 'FAQ',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const CONTACTS = {
  path: 'contatti',
  name: 'prescriptionsHelpContacts',
  component: () => import('pages/prescriptions/PageHelpContacts'),
  meta: {
    prettyName: 'Contatti',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const HELP = {
  path: 'aiuto',
  name: 'prescriptionsHelp',
  component: () => import('pages/prescriptions/PageHelp'),
  meta: {
    prettyName: 'Aiuto',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  },
  // children: [
  //   CONTACTS,
  //   FAQ
  // ]
};

export const PRESCRIPTION_DETAIL = {
  path: ':id',
  name: 'prescriptionDetail',
  component: () => import('pages/prescriptions/PagePrescription'),
  meta: {
    prettyName: 'Dettaglio ricetta',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const PRESCRIPTIONS_HIDDEN = {
  path: 'nascoste',
  name: 'prescriptionHistory',
  component: () => import('pages/prescriptions/PagePrescriptionsHidden'),
  meta: {
    prettyName: 'Ricette nascoste',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const PRESCRIPTIONS_ARCHIVE = {
  path: 'archivio',
  name: 'prescriptionArchive',
  component: () => import('pages/prescriptions/PagePrescriptionsArchive'),
  meta: {
    prettyName: 'Archivio ricette',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const PRESCRIPTIONS_DRUGS = {
  path: 'farmaci',
  name: 'prescriptionDrugs',
  component: () => import('pages/prescriptions/PagePrescriptionsDrugs'),
  meta: {
    prettyName: 'Farmaci',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const PRESCRIPTIONS_VISIT = {
  path: 'specialistiche',
  name: 'prescriptionsHomeTabsPrescriptionVisit',
  component: () => import('pages/prescriptions/PagePrescriptionsVisits'),
  meta: {
    prettyName: 'Visite',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};


export const PRESCRIPTIONS = {
  path: '',
  name: 'prescriptionHome',
  component: () => import('pages/prescriptions/PagePrescriptions'),
  redirect: PRESCRIPTIONS_VISIT,
  meta: {
    prettyName: 'Ricette',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  },
  children: [
    PRESCRIPTIONS_VISIT,
    PRESCRIPTIONS_DRUGS,
    PRESCRIPTIONS_HIDDEN,
    PRESCRIPTIONS_ARCHIVE
  ]
}

export const APP = {
  path: 'ricette',
  name: 'prescriptionsApp',
  component: () => import('pages/prescriptions/AppPrescriptions'),
  redirect: PRESCRIPTIONS,
  meta: {
    prettyName: 'Ricette',
    appServiceCode: config.global.appServiceCodes.prescriptions,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  },
  children: [
    PRESCRIPTIONS,
    CONTACTS,
    PRESCRIPTION_DETAIL,
  ]
};
