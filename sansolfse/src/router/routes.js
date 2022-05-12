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
//
// export const HELP = {
//   path: "assistenza",
//   name: "help",
//   component: () => import("pages/PageHelp.vue"),
//   children: [HELP_CONTACTS, HELP_FAQ]
// };

export const SERVICE_RATING = {
  path: "valutazione",
  name: "serviceRating",
  component: () => import("pages/PageServiceRating.vue")
};

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------
export const DOCUMENT_LIST = {
  path: "",
  alias: "documenti",
  name: "documentList",
  component: () => import("pages/PageDocumentList.vue")
};

export const DOCUMENT_DETAIL = {
  path: "documenti/:id",
  name: "documentDetail",
  component: () => import("pages/PageDocumentDetail.vue")
};

export const TAG_LIST = {
  path: "etichette",
  name: "tagList",
  component: () => import("pages/PageTagList.vue")
};

export const DOCUMENT_CREATE = {
  path: "documenti/auto-caricati/nuovo",
  name: "documentCreate",
  component: () => import("pages/PageDocumentCreate.vue")
};

export const DOCUMENT_CREATE_SUCCESS = {
  path: "documenti/auto-caricati/nuovo/successo",
  name: "documentCreateSuccess",
  component: () => import("pages/PageDocumentCreateSuccess.vue")
};

export const ACCESS_LIST = {
  path: "accessi",
  name: "accessList",
  component: () => import("pages/PageAccessList")
};


export const DOCUMENT_LIST_FILTER_TEST = {
  path: "__test-filtri",
  alias: "documentiTest",
  name: "documentListTest",
  component: () => import("pages/PageTestFilters.vue")
};


export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    DOCUMENT_LIST,
    DOCUMENT_DETAIL,
    TAG_LIST,
    DOCUMENT_CREATE,
    DOCUMENT_CREATE_SUCCESS,
    HELP_CONTACTS,
    SERVICE_RATING,
    ACCESS_LIST,
    DOCUMENT_LIST_FILTER_TEST
  ]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
