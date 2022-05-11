/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from "@plugins/config";
import {CERTIFICATE_LIST, EXEMPTION_LIST, EXEMPTION_LIST_ARCHIVED} from "@router/routes/pathology-exemption";
import {Platform} from 'quasar';

export const CONTACTS_HELP = {
  path: 'contatti-aiuto',
  name: 'contatti',
  component: () => import('pages/global/PageContactsHelp'),
  meta: {
    prettyName: 'Contatti di supporto',
    isPublic: true,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const USER_NOTIFICATION_PREFERENCES = {
  path: 'notifiche-utente/preferenze',
  name: 'userNotificationPreferences',
  component: () => import('pages/global/user-profile/PageUserNotificationPreferences'),
  meta: {
    prettyName: 'Preferenze notifiche',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const USER_CONTACTS = {
  path: 'contatti-utente',
  name: 'userContacts',
  component: () => import('pages/global/user-profile/PageUserContacts'),
  meta: {
    prettyName: 'Contatti',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const USER_ANAGRAPHICS = {
  path: 'anagrafica-utente',
  name: 'userAnagraphics',
  component: () => import('pages/global/user-profile/PageUserAnagraphics'),
  meta: {
    prettyName: 'Anagrafica',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const USER_ACCESS_LIST = {
  path: 'accessi',
  name: 'userAccessList',
  component: () => import('pages/global/user-profile/PageUserAccessList'),
  meta: {
    prettyName: 'Accessi',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const USER_CONSENTS_P = {
  path: 'consensiP',
  name: 'userConsents',
  component: () => import('pages/global/user-profile/PageUserConsentsHome'),
  meta: {
    prettyName: 'Consensi',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const USER_CONSENT_DETAIL_P = {
  path: 'profilo-utente/consensi/dettaglioP',
  name: 'userConsent',
  component: () => import('pages/global/user-profile/PageUserConsent'),
  meta: {
    prettyName: 'Consenso',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const USER_CONSENT_SUCCESS_P = {
  path: 'profilo-utente/consensi/successoP',
  name: 'userConsentSuccess',
  component: () => import('pages/global/user-profile/PageUserConsentSuccess'),
  meta: {
    prettyName: 'Successo',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};


export const USER_PROFILE = {
  path: 'profilo-utente',
  name: 'userProfile',
  component: () => import('pages/global/user-profile/PageUserProfile'),
  redirect: USER_ANAGRAPHICS,
  meta: {
    prettyName: 'Il tuo profilo',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  },
  children: [
    USER_ANAGRAPHICS,
    USER_CONTACTS,
    USER_NOTIFICATION_PREFERENCES,
    USER_ACCESS_LIST,
    USER_CONSENTS_P,
  ]
};


export const USER_NOTIFICATIONS = {
  path: 'notifiche-utente',
  name: 'userNotifications',
  component: () => import('pages/global/user-profile/PageUserNotifications'),
  meta: {
    prettyName: 'Notifiche',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};


export const USER_NOTIFICATION_DETAIL = {
  path: 'notifiche-utente/:notificationId',
  name: 'userNotificationDetail',
  component: () => import('pages/global/user-profile/PageUserNotificationDetail'),
  meta: {
    prettyName: 'Notifica',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};


export const POLICY = {
  path: 'termini-e-condizioni',
  name: 'termsAndConditions',
  component: () => import('pages/global/user-profile/PageTermsAndConditions'),
  meta: {
    prettyName: 'Termini e condizioni',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const USER_CONTACTS_FLOW = {
  path: 'contatti-utente/attiva',
  name: 'userContactsFlow',
  component: () => import('pages/global/user-profile/PageUserContactsFlow'),
  meta: {
    prettyName: 'Contatti e notifiche',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};


export const USER_CONTACTS_FLOW_SUCCESS = {
  path: 'contatti-utente/attivati',
  name: 'userContactsFlowSuccess',
  component: () => import('pages/global/user-profile/PageUserContactsFlowSuccess'),
  meta: {
    prettyName: 'Contatti e notifiche attivati',
    appServiceCode: config.global.appServiceCodes.unp,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

export const SERVICE_RATING = {
  path: 'valutazione',
  name: 'serviceRating',
  component: () => import('pages/global/PageServiceRating'),
  meta: {
    prettyName: 'Valuta il servizio',
    isPublic: true,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
}


export const COVID19 = {
  path: 'coronavirus',
  name: 'covid19',
  component: () => import('pages/global/PageCovid19'),
  meta: {
    isPublic: true,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
}


export const LOGOUT = {
  path: 'logout',
  name: 'logout',
  component: () => import('pages/global/PageLogout'),
  meta: {
    isPublic: true,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
}

export const COOKIE_POLICY = {
  path: 'cookie-policy',
  name: 'cookiePolicy',
  component: () => import('pages/global/PageCookiePolicy'),
  meta: {
    isPublic: true,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
}

export const APP = {
  path: '/',
  name: 'appGlobal',
  component: () => import('pages/global/AppGlobal'),
  beforeEnter: (to, from, next) => {
    let isCert = config.global.envs.ENVIRONMENT.includes('-cert');

    if (!config.global.isDevelopment && !isCert && !config.global.isAlpha) {
      let url = `${window.location.origin}${window.location.pathname}home/`;
      console.log('beforeEnter:', url);
      location.assign(url);
      return next(false);
    }

    next();
  },
  meta: {
    prettyName: 'Pagina iniziale',
    isPublic: true,
    isVisibleToMinor: true,
    analyticsIgnore: true
  }
};

