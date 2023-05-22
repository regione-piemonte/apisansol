/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
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
export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue")
};

export const PHARMACY_SEARCH = {
  path: "cerca-farmacia",
  name: "pharmacySearch",
  component: () => import("pages/PagePartecipantPharmacySearch.vue")
};

export const PHARMACY_SEARCH_RESULTS = {
  path: "cerca-farmacia/risultato",
  name: "pharmacySearchResults",
  component: () => import("pages/PagePartecipantPharmacySearchResults.vue")
};

export const DEVICE_CERTIFICATION = {
  path: "certifica-device",
  name: "deviceCertification",
  component: () => import("pages/PageDeviceCertification.vue")
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    HOME,
    PHARMACY_SEARCH,
    PHARMACY_SEARCH_RESULTS,
    DEVICE_CERTIFICATION,
    HELP,
    SERVICE_RATING
  ]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
