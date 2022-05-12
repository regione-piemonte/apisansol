/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const ERROR_404 = {
  path: "*",
  name: "error404",
  component: () => import("pages/PageError404.vue")
};

// AIUTO
// ---------------------------------------------------------------------------------------------------------------------
export const HELP_CONTACTS = {
  path: "contatti",
  name: "helpContacts",
  component: () => import("pages/PageHelpContacts.vue")
};

// export const HELP_FAQ = {
//   path: "faq",
//   name: "helpFaq",
//   component: () => import("pages/PageHelpFaq.vue")
// };

// export const HELP = {
//   path: "assistenza",
//   name: "help",
//   component: () => import("pages/PageHelp.vue"),
//   children: [HELP_CONTACTS, HELP_FAQ]
// };

export const SERVICE_RATING ={
  path: "valutazione",
  name: "serviceRating",
  component: () => import("pages/PageServiceRating.vue")
}

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------

export const DELEGATE_LIST = {
  path: 'delegati',
  name: 'delegationsDelegateList',
  component: () => import('pages/PageDelegateList'),

};

export const DELEGATOR_LIST = {
  path: 'deleganti',
  name: 'delegationsDelegatorList',
  component: () => import('pages/PageDelegatorList'),

};

export const DECLARATION_MINOR_LIST = {
  path: 'minori',
  name: 'delegationsDeclarationMinorList',
  component: () => import('pages/PageDeclarationMinorList'),
};

export const DECLARATION_PROTECTED_LIST = {
  path: 'tutelati',
  name: 'delegationsDeclarationProtectedList',
  component: () => import('pages/PageDeclarationProtectedList'),

};

export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue"),
  children: [
    DELEGATE_LIST,
    DELEGATOR_LIST,
    DECLARATION_MINOR_LIST,
    DECLARATION_PROTECTED_LIST,
  ],
};

export const DELEGATE_NEW = {
  path: 'delegati/nuovo',
  name: 'delegationsDelegateNew',
  component: () => import('pages/PageDelegateNew'),

};

export const DELEGATE_HISTORY = {
  path: 'delegati/:delegateUuid/storico',
  name: 'delegationsDelegateHistory',
  component: () => import('pages/PageDelegateHistory'),
};

export const DELEGATE_EDIT = {
  path: 'delegati/:delegateUuid/modifica',
  name: 'delegationsDelegateEdit',
  component: () => import('pages/PageDelegateEdit'),
};

export const POLICY = {
  path: 'termini-e-condizioni',
  name: 'delegationsPolicy',
  component: () => import('pages/PagePolicy'),
};

export const POLICY_MINORS = {
  path: 'termini-e-condizioni-minori',
  name: 'delegationsPolicyMinors',
  component: () => import('pages/PagePolicyMinors'),
};

export const DECLARATION_MINOR_NEW = {
  path: 'minori/nuova',
  name: 'delegationsDeclarationMinorNew',
  component: () => import('pages/PageDeclarationMinorNew'),
};

export const DECLARATION_MINOR_CONFIRM = {
  path: 'minori/:id/conferma',
  name: 'delegationsDeclarationMinorConfirm',
  component: () => import('pages/PageDeclarationMinorConfirm'),
}

export const DECLARATION_MINOR_CONFIRM_SUCCESS = {
  path: 'minori/:id/conferma/successo',
  name: 'delegationsDeclarationMinorConfirmSuccess',
  component: () => import('pages/PageDeclarationMinorConfirmSuccess'),
}

export const DECLARATION_MINOR_REVOKE = {
  path: 'minori/:id/revoca',
  name: 'delegationsDeclarationMinorRevoke',
  component: () => import('pages/PageDeclarationMinorRevoke/'),
}

export const DECLARATION_MINOR_REVOKE_SUCCESS = {
  path: 'minori/:id/revoca/successo',
  name: 'delegationsDeclarationMinorRevokeSuccess',
  component: () => import('pages/PageDeclarationMinorRevokeSuccess'),
}


export const DECLARATION_PROTECTED_REVOKE = {
  path: 'tutelati/:id/revoca',
  name: 'delegationsDeclarationProtectedRevoke',
  component: () => import('pages/PageDeclarationProtectedRevoke'),
};

export const DECLARATION_PROTECTED_DETAIL = {
  path: 'tutelati/:id',
  name: 'delegationsDeclarationProtectedDetail',
  component: () => import('pages/PageDeclarationProtectedDetail'),
};

export const DECLARATION_PROTECTED_REVOKE_SUCCESS = {
  path: 'tutelati/:id/revoca/successo',
  name: 'delegationsDeclarationProtectedRevokeSuccess',
  component: () => import('pages/PageDeclarationProtectedRevokeSuccess'),
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    HOME,
    HELP_CONTACTS,
    DELEGATE_NEW,
    DELEGATE_HISTORY,
    DELEGATE_EDIT,
    POLICY,
    POLICY_MINORS,
    DECLARATION_MINOR_NEW,
    DECLARATION_MINOR_CONFIRM,
    DECLARATION_MINOR_CONFIRM_SUCCESS,
    DECLARATION_MINOR_REVOKE,
    DECLARATION_MINOR_REVOKE_SUCCESS,
    DECLARATION_PROTECTED_DETAIL,
    DECLARATION_PROTECTED_REVOKE,
    DECLARATION_PROTECTED_REVOKE_SUCCESS,
    SERVICE_RATING
  ]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
