/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const ERROR_404 = {
  path: "*",
  name: "error404",
  component: () => import("pages/PageError404.vue"),
};

// AIUTO
// ---------------------------------------------------------------------------------------------------------------------
export const HELP_CONTACTS = {
  path: "contatti",
  name: "helpContacts",
  component: () => import("pages/PageHelpContacts.vue"),
};

export const SERVICE_RATING = {
  path: "valutazione",
  name: "serviceRating",
  component: () => import("pages/PageServiceRating.vue"),
};

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------
export const HOME_MY_SITUATION = {
  path: "la-mia-situazione",
  name: "homeMySituation",
  component: () => import("pages/PageHomeMySituation.vue"),
};

export const HOME_SWAB_LIST = {
  path: "tamponi",
  name: "homeSwabList",
  component: () => import("pages/PageHomeSwabList.vue"),
};

export const HOME_EVENT_LIST = {
  path: "provvedimenti",
  alias: "eventi",
  name: "homeEventList",
  component: () => import("pages/PageHomeEventList.vue"),
};

export const HOME_CONTACTS = {
  path: "contatti",
  name: "homeContacts",
  component: () => import("pages/PageHomeContacts.vue"),
};

export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue"),
  redirect: HOME_MY_SITUATION,
  children: [HOME_MY_SITUATION, HOME_SWAB_LIST, HOME_EVENT_LIST, HOME_CONTACTS],
};

export const POLICY = {
  path: "informativa-privacy",
  name: "policy",
  component: () => import("pages/PagePolicy.vue"),
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [HOME, POLICY, HELP_CONTACTS, SERVICE_RATING],
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
