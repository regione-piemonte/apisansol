/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config';


export const FAQ = {
  path: 'faq',
  name: 'healthPaymentsHelpFaq',
  component: () => import('pages/health-payments/PageHelpFaq'),
  meta: {
    prettyName: 'Faq',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    isPublic: true,
    analyticsIgnore: true
  }
};


export const CONTACTS = {
  path: 'contatti',
  name: 'health-paymentsHelpContacts',
  component: () => import('pages/health-payments/PageHelpContacts'),
  meta: {
    prettyName: 'Contatti',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    isPublic: true,
    analyticsIgnore: true
  }
};

export const HELP = {
  path: 'aiuto',
  name: 'healthPaymentsHelp',
  component: () => import('pages/health-payments/PageHelp'),
  meta: {
    prettyName: 'Help',
    appServiceCode: config.global.appServiceCodes.healthPayments,
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
  name: 'healthPaymentsPolicy',
  component: () => import('pages/health-payments/PagePolicy'),
  meta: {
    prettyName: 'Policy',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true,
    isPublic: true,
    privacy:true
  }
};

export const QR_CODE = {
  path: 'scansiona-codice-qr',
  name: 'healthPaymentsScanQrCode',
  component: () => import('pages/health-payments/PageScanQrCode'),
  meta: {
    prettyName: 'Scansiona codice QR',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const PAYMENT = {
  path: 'pagamento',
  name: 'healthPaymentsPayment',
  component: () => import('pages/health-payments/PagePayment'),
  meta: {
    prettyName: 'Pagamento',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    isPublic: true,
    analyticsIgnore: true
  }
};


export const PAYMENT_FEEDBACK = {
  path: 'pagamento/feedback',
  name: 'healthPaymentsPaymentFeedback',
  component: () => import('pages/health-payments/PageMdpLandingPage'),
  meta: {
    prettyName: 'Risultato pagamento',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    isPublic: true,
    analyticsIgnore: true
  }
};


export const CART = {
  path: 'carrello',
  name: 'healthPaymentsCart',
  component: () => import('pages/health-payments/PageCart'),
  meta: {
    prettyName: 'Carrello',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    isPublic: true,
    analyticsIgnore: true
  }
};


export const ANONYMOUS_HEALTH_PAYMENTS = {
  path: 'pagamenti-sanitari',
  name: 'healthPaymentsAnonymousHealthPayments',
  component: () => import('pages/health-payments/anonymous/PageAnonymousHealthPayments'),
  meta: {
    prettyName: 'Pagamenti sanitari',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};

export const ANONYMOUS_HEALTH_PAYMENTS_RESULTS = {
  path: 'pagamenti-sanitari/risultati',
  name: 'healthPaymentsAnonymousHealthPaymentsResults',
  component: () => import('pages/health-payments/anonymous/PageAnonymousHealthPaymentsResults'),
  meta: {
    prettyName: 'Pagamenti sanitari trovati',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};

export const ANONYMOUS_OTHER_PAYMENTS = {
  path: 'altri-pagamenti',
  name: 'healthPaymentsAnonymousOtherPayments',
  component: () => import('pages/health-payments/anonymous/PageAnonymousOtherPayments'),
  meta: {
    prettyName: 'Altri pagamenti',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const ANONYMOUS_RECEIPT = {
  path: 'recupera-ricevuta',
  name: 'healthPaymentsAnonymousReceipt',
  component: () => import('pages/health-payments/anonymous/PageAnonymousReceipt'),
  meta: {
    prettyName: 'Recupera ricevuta',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const ANONYMOUS_RECEIPT_RESULTS = {
  path: 'recupera-ricevuta/trovate',
  name: 'healthPaymentsAnonymousReceiptResults',
  component: () => import('pages/health-payments/anonymous/PageAnonymousReceiptResults'),
  meta: {
    prettyName: 'Ricevute trovate',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const ANONYMOUS_WELCOME = {
  path: 'anonimo/benvenuto',
  name: 'healthPaymentsAnonymousWelcome',
  component: () => import('pages/health-payments/anonymous/PageAnonymousWelcome'),
  meta: {
    prettyName: 'Benvenuto',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const ANONYMOUS_HOME = {
  path: 'anonimo',
  name: 'healthPaymentsAnonymousHome',
  component: () => import('pages/health-payments/anonymous/PageAnonymousHome'),
  redirect: ANONYMOUS_HEALTH_PAYMENTS,
  meta: {
    prettyName: 'Utente non autenticato',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  },
  children: [
    ANONYMOUS_HEALTH_PAYMENTS,
    ANONYMOUS_HEALTH_PAYMENTS_RESULTS,
    ANONYMOUS_OTHER_PAYMENTS,
    ANONYMOUS_RECEIPT,
    ANONYMOUS_RECEIPT_RESULTS
  ]
};


export const AUTH_YOUR_HEALTH_PAYMENTS = {
  path: 'paga-per-te',
  name: 'healthPaymentsAuthYourHealthPayments',
  component: () => import('pages/health-payments/auth/PageAuthHealthPaymentsYour'),
  meta: {
    prettyName: 'I tuoi pagamenti sanitari',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const AUTH_OTHER_HEALTH_PAYMENTS = {
  path: 'paga-per-altri',
  name: 'healthPaymentsAuthOtherHealthPayments',
  component: () => import('pages/health-payments/auth/PageAuthHealthPaymentsOther'),
  meta: {
    prettyName: 'Paga per altri',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const AUTH_HEALTH_PAYMENTS = {
  path: 'pagamenti-sanitari',
  name: 'healthPaymentsAuthHealthPayments',
  component: () => import('pages/health-payments/auth/PageAuthHealthPayments'),
  redirect: AUTH_YOUR_HEALTH_PAYMENTS,
  meta: {
    prettyName: 'Pagamenti sanitari',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  },
  children: [
    AUTH_YOUR_HEALTH_PAYMENTS,
    AUTH_OTHER_HEALTH_PAYMENTS,
  ],
};


export const AUTH_OTHER_PAYMENTS = {
  path: 'altri-pagamenti',
  name: 'healthPaymentsAuthOtherPayments',
  component: () => import('pages/health-payments/auth/PageAuthOtherPayments'),
  meta: {
    prettyName: 'Altri pagamenti',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const AUTH_PAYED_PAYMENTS = {
  path: 'pagati',
  name: 'healthPaymentsAuthPayedPayments',
  component: () => import('pages/health-payments/auth/PageAuthPayedPayments'),
  meta: {
    prettyName: 'Già pagati',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
};


export const AUTH_HOME = {
  path: 'autenticato',
  name: 'healthPaymentsAuthHome',
  component: () => import('pages/health-payments/auth/PageAuthHome'),
  redirect: AUTH_HEALTH_PAYMENTS,
  meta: {
    prettyName: 'Utente autenticato',
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  },
  children: [
    AUTH_HEALTH_PAYMENTS,
    AUTH_OTHER_PAYMENTS,
    AUTH_PAYED_PAYMENTS,
  ]
};

export const SELECT_ASR = {
  path: 'seleziona-asl',
  name: 'healthPaymentsSelectAsr',
  component: () => import('pages/health-payments/PageSelectAsr'),
  meta: {
    prettyName: 'Seleziona Asl',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  }
}


export const APP = {
  path: 'pagamenti-sanitari',
  name: 'healthPaymentsApp',
  component: () => import('pages/health-payments/AppHealthPayments'),
  redirect: to => {
    return SELECT_ASR

  },
  meta: {
    prettyName: 'Pagamenti sanitari',
    isPublic: true,
    appServiceCode: config.global.appServiceCodes.healthPayments,
    analyticsIgnore: true
  },
  children: [
    SELECT_ASR,
    ANONYMOUS_WELCOME,
    AUTH_HOME,
    ANONYMOUS_HOME,
    PAYMENT,
    PAYMENT_FEEDBACK,
    CART,
    QR_CODE,
    //CONTACTS
    CONTACTS,
    POLICY
    //FAQ
  ],
};






