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

export const HELP_FAQ = {
  path: "faq",
  name: "helpFaq",
  component: () => import("pages/PageHelpFaq.vue")
};

export const HELP = {
  path: "assistenza",
  name: "help",
  component: () => import("pages/PageHelp.vue"),
  children: [HELP_CONTACTS, HELP_FAQ]
};

export const SERVICE_RATING ={
  path: "valutazione",
  name: "serviceRating",
  component: () => import("pages/PageServiceRating.vue")
}

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------


export const REQUEST_DETAIL = {
  path: "richieste/:requestNr",
  name: "requestDetail",
  component: () => import("pages/PageRequestsDetail.vue")
};


export const NEW_REQUEST_CHOOSE = {
  path: "richieste/nuova",
  name: "contactFormChoose",
  component: () => import("pages/PageFormChoose.vue")
};

export const EDIT_REQUEST = {
  path: "richieste/modifica/:requestNr",
  name: "contactFormEdit",
  component: () => import("pages/PageEditRequestForm.vue")
};

export const NEW_REQUEST_SPECIFIC = {
  path: "richieste/nuova/:serviceid",
  name: "contactForm",
  component: () => import("pages/PageForm.vue")
};

export const REQUESTS_OPENED = {
  path: "aperte",
  name: "requestsOpened",
  component: () => import("pages/PageRequestsOpened.vue")
}

export const REQUESTS_ARCHIVED = {
  path: "archiviate",
  name: "requestsArchived",
  component: () => import("pages/PageRequestsArchived.vue")
}

export const REQUESTS = {
  path: "richieste",
  name: "requests",
  component: () => import("pages/PageRequests.vue"),
  redirect: REQUESTS_OPENED,
  children: [
    REQUESTS_OPENED,
    REQUESTS_ARCHIVED,
  ]
}

export const ASSISTANCE_TREE = {
  path: "percorsi-guidati/:serviceid",
  name: "assistanceTree",
  meta:{
    isUserMinorVisible : true
  },
  component: () => import("pages/PageAssistanceTree.vue"),
}
export const ASSISTANCE_TREE_TEST = {
  path: "__albero-degli-aiuti",
  name: "assistanceTreeTest",
  meta:{
    isUserMinorVisible : true
  },
  component: () => import("pages/PageAssistanceTreeTest.vue"),
}

export const ASSISTANCE_TREE_ANSWERS = {
  path: "__albero-degli-aiuti/risposte-utente/:serviceid",
  name: "assistanceTreeUserAnswers",
  meta:{
    isUserMinorVisible : true
  },
  component: () => import("pages/PageAssistanceTreeUserAnswers.vue"),
}

export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue"),
};


export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    HOME,
    HELP,
    ASSISTANCE_TREE,
    NEW_REQUEST_CHOOSE,
    NEW_REQUEST_SPECIFIC,
    REQUESTS,
    REQUEST_DETAIL,
    EDIT_REQUEST,
    ASSISTANCE_TREE_TEST,
    SERVICE_RATING,
    ASSISTANCE_TREE_ANSWERS
    ]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
