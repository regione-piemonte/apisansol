/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config';

export const FAQ = {
  path: 'faq',
  name: 'incomeExemptionHelp',
  component: () => import('pages/income-exemption/PageHelpFaq'),
  meta: {
    prettyName: 'faq',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    isPublic: true,
    analyticsIgnore: true
  }
};

export const CONTACTS = {
  path: 'contatti',
  name: 'onlineExemptionContacts',
  component: () => import('pages/income-exemption/PageHelpContacts'),
  meta: {
    prettyName: 'Contatti',
    appServiceCode: config.global.appServiceCodes.onlineReports,
    isPublic: true,
    analyticsIgnore: true
  }
};



export const HELP = {
  path: 'aiuto',
  name: 'onlineExemptionHelp',
  component: () => import('pages/income-exemption/PageHelp'),
  meta: {
    prettyName: 'Help',
    appServiceCode: config.global.appServiceCodes.onlineReports,
    isPublic: true,
    analyticsIgnore: true
  },
  // children: [
  //   CONTACTS,
  //   FAQ
  // ]
};

export const POLICY = {
  path: 'informativa-privacy',
  name: 'onlineExemptionPolicy',
  component: () => import('pages/income-exemption/PagePolicy'),
  meta: {
    prettyName: 'Policy',
    appServiceCode: config.global.appServiceCodes.onlineReports,
    analyticsIgnore: true,
    isPublic: true,
    privacy:true
  }
};

export const EXEMPTION_LIST = {
  path: '',
  name: 'incomeExemptionList',
  component: () => import('pages/income-exemption/PageExemptionList'),
  meta: {
    prettyName: 'Home',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    analyticsIgnore: true
  }
};

export const EXEMPTION_DETAIL = {
  path: ':id',
  name: 'incomeExemptionDetail',
  component: () => import('pages/income-exemption/PageExemption'),
  meta: {
    prettyName: 'Dettaglio esenzione',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    analyticsIgnore: true
  }
};

export const EXEMPTION_REVOKE = {
  path: ':id/revoca',
  name: 'incomeExemptionRevoke',
  component: () => import('pages/income-exemption/PageExemptionRevoke'),
  meta: {
    prettyName: 'Revoca esenzione',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    analyticsIgnore: true
  }
};

export const NEW = {
  path: 'nuova',
  name: 'newIncomeExemption',
  component: () => import('pages/income-exemption/PageNewIncomeExemption'),
  meta: {
    prettyName: 'Nuova esenzione',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    analyticsIgnore: true
  }
};

export const NEW_FOR_YOU = {
  path: 'nuova/per-te',
  name: 'newIncomeExemptionForYou',
  component: () => import('pages/income-exemption/PageNewIncomeExemptionForYou'),
  meta: {
    prettyName: 'Nuova esenzione per te',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    analyticsIgnore: true
  }
};

export const NEW_FOR_FAMILY = {
  path: 'nuova/per-un-familiare',
  name: 'newIncomeExemptionForFamily',
  component: () => import('pages/income-exemption/PageNewIncomeExemptionForFamily'),
  meta: {
    prettyName: 'Nuova esenzione per un familiare',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    analyticsIgnore: true
  }
};

export const NEW_SUCCESS = {
  path: 'nuova/per-te/:id/successo',
  alias: 'nuova/per-un-familiare/:id/successo',
  name: 'newIncomeExemptionSuccess',
  component: () => import('pages/income-exemption/PageNewIncomeExemptionSuccess'),
  props: true,
  meta: {
    prettyName: 'Esenzione creata',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    analyticsIgnore: true
  }
};


export const APP = {
  path: 'esenzioni-per-reddito',
  name: 'incomeExemptionApp',
  component: () => import('pages/income-exemption/AppIncomeExemption'),
  redirect: EXEMPTION_LIST,
  meta: {
    prettyName: 'Esenzioni per reddito',
    appServiceCode: config.global.appServiceCodes.incomeExemption,
    analyticsIgnore: true
  },
  children: [
    POLICY,
    EXEMPTION_LIST,
    NEW,
    NEW_FOR_YOU,
    NEW_FOR_FAMILY,
    NEW_SUCCESS,
    EXEMPTION_DETAIL,
    EXEMPTION_REVOKE,
    CONTACTS,

    //HELP,
  ],

};
