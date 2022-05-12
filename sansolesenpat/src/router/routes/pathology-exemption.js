/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config'

export const EXEMPTION_LIST = {
  path: 'esenzioni',
  name: 'pathologyExemptionList',
  component: () => import('pages/pathology-exemption/PageExemptionList'),
  meta: {
    prettyName: 'Esenzioni',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_AURA_LIST_ARCHIVED = {
  path: 'esenzioni-aura/archiviate',
  name: 'pathologyExemptionListArchived',
  component: () => import('pages/pathology-exemption/PageExemptionAuraListArchived'),
  meta: {
    prettyName: 'Archiviate-aura',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_AURA_LIST = {
  path: 'esenzioni-aura',
  name: 'pathologyExemptionAuraList',
  component: () => import('pages/pathology-exemption/PageExemptionAuraList'),
  meta: {
    prettyName: 'Esenzioni-aura',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_NEW = {
  path: 'esenzioni/nuova',
  name: 'pathologyExemptionNew',
  component: () => import('pages/pathology-exemption/PageExemptionNew'),
  meta: {
    prettyName: 'Nuova Esenzione',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_NEW_SUCCESS = {
  path: 'esenzioni/nuova/:id/successo',
  name: 'pathologyExemptionNewSuccess',
  component: () => import('pages/pathology-exemption/PageExemptionNewSuccess'),
  meta: {
    prettyName: 'Nuova Esenzione creata',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_DETAIL = {
  path: 'esenzioni/:id',
  name: 'pathologyExemptionDetail',
  component: () => import('pages/pathology-exemption/PageExemptionDetail'),
  meta: {
    prettyName: 'Esenzione',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const AURA_EXEMPTION_DETAIL = {
  // path: 'esenzioni-aura/:emissionDate/:exemptionCode/:expireDate',
  path: 'esenzioni-aura/:emissionDate/:exemptionCode/:pathologyCode',
  name: 'pathologyExemptionAuraDetail',
  component: () => import('pages/pathology-exemption/PageExemptionAuraDetail'),
  meta: {
    prettyName: 'Esenzione',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_DETAIL_ARCHIVED = {
  path: 'esenzioni/archiviate/:id',
  name: 'pathologyExemptionDetailArchived',
  component: () => import('pages/pathology-exemption/PageExemptionDetail'),
  meta: {
    prettyName: 'Esenzione',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_REVOKE = {
  path: 'esenzioni/:id/revoca',
  name: 'pathologyExemptionRevoke',
  component: () => import('pages/pathology-exemption/PageExemptionRevoke'),
  meta: {
    prettyName: 'Revoca esenzione',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_REVOKE_SUCCESS = {
  path: 'esenzioni/:id/revoca/successo',
  name: 'pathologyExemptionRevokeSuccess',
  component: () => import('pages/pathology-exemption/PageExemptionRevokeSuccess'),
  meta: {
    prettyName: 'Esenzione revocata',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_CANCEL = {
  path: 'esenzioni/:id/annulla',
  name: 'pathologyExemptionCancel',
  component: () => import('pages/pathology-exemption/PageExemptionCancel'),
  meta: {
    prettyName: 'Annulla esenzione',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_CANCEL_SUCCESS = {
  path: 'esenzioni/:id/annulla/successo',
  name: 'pathologyExemptionCancelSuccess',
  component: () => import('pages/pathology-exemption/PageExemptionCancelSuccess'),
  meta: {
    prettyName: 'Esenzione annullata',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_RENEW = {
  path: 'esenzioni/:id/rinnova',
  name: 'pathologyExemptionRenew',
  component: () => import('pages/pathology-exemption/PageExemptionRenew'),
  meta: {
    prettyName: 'Rinnova esenzione',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_RENEW_SUCCESS = {
  path: 'esenzioni/:id/rinnova/successo',
  name: 'pathologyExemptionRenewSuccess',
  component: () => import('pages/pathology-exemption/PageExemptionRenewSuccess'),
  meta: {
    prettyName: 'Esenzione rinnovata',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_CORRECTION = {
  path: 'esenzioni/:id/rettifica',
  name: 'pathologyExemptionCorrection',
  component: () => import('pages/pathology-exemption/PageExemptionCorrection'),
  meta: {
    prettyName: 'Rettifica esenzione',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const EXEMPTION_CORRECTION_SUCCESS = {
  path: 'esenzioni/:id/rettifica/successo',
  name: 'pathologyExemptionCorrectionSuccess',
  component: () => import('pages/pathology-exemption/PageExemptionCorrectionSuccess'),
  meta: {
    prettyName: 'Esenzione rettificata',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
}

export const CERTIFICATE_LIST = {
  path: 'certificati',
  name: 'pathologyCertificateList',
  component: () => import('pages/pathology-exemption/PageCertificateList'),
  meta: {
    prettyName: 'Certificati',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const CERTIFICATE_DETAIL = {
  path: 'certificati/:id',
  name: 'pathologyCertificateDetail',
  component: () => import('pages/pathology-exemption/PageCertificateDetail'),
  meta: {
    prettyName: 'Certificato',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const FAQ = {
  path: 'faq',
  name: 'pathologyExemptionHelpFaq',
  component: () => import('pages/pathology-exemption/PageHelpFaq'),
  meta: {
    prettyName: 'Faq',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    isPublic: true,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};



export const CONTACTS = {
  path: 'contatti',
  name: 'pathologyExemptionHelpContacts',
  component: () => import('pages/pathology-exemption/PageHelpContacts'),
  meta: {
    prettyName: 'Contatti',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    isPublic: true,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  }
};

export const HELP = {
  path: 'aiuto',
  name: 'pathologyExemptionHelp',
  component: () => import('pages/pathology-exemption/PageHelp'),
  meta: {
    prettyName: 'Help',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    isPublic: true,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  },
  // children: [
  //   CONTACTS,
  //   FAQ
  // ]
};


export const HOME = {
  path: '',
  name: 'pathologyExemptionHome',
  component: () => import('pages/pathology-exemption/PageHome'),
  redirect: EXEMPTION_AURA_LIST,
  meta: {
    prettyName: 'Home',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  },
  children: [
    EXEMPTION_LIST,
    EXEMPTION_AURA_LIST_ARCHIVED,
    CERTIFICATE_LIST,
    EXEMPTION_AURA_LIST
  ]
}

export const APP = {
  path: 'esenzioni-per-patologie',
  name: 'pathologyExemptionApp',
  component: () => import('pages/pathology-exemption/AppPathologyExemption'),
  redirect: HOME,
  meta: {
    prettyName: 'Esenzioni per patologie',
    appServiceCode: config.global.appServiceCodes.pathologyExemption,
    analyticsIgnore: true,
    isVisibleToMinor: true,
  },
  children: [
    HOME,
    EXEMPTION_NEW_SUCCESS,
    EXEMPTION_NEW,
    EXEMPTION_REVOKE_SUCCESS,
    EXEMPTION_REVOKE,
    EXEMPTION_CANCEL_SUCCESS,
    EXEMPTION_CANCEL,
    EXEMPTION_RENEW_SUCCESS,
    EXEMPTION_RENEW,
    EXEMPTION_CORRECTION_SUCCESS,
    EXEMPTION_CORRECTION,
    EXEMPTION_DETAIL,
    EXEMPTION_DETAIL_ARCHIVED,
    CERTIFICATE_DETAIL,
    AURA_EXEMPTION_DETAIL,
    HELP,
    CONTACTS
  ],
  // beforeEnter: (to, from, next) => {
  //   if (config.global.isProduction) window.location = config.global.oldServicesUrls.esenzione_reddito
  //   else next()
  // }
}
