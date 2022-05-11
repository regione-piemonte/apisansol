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

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------
export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue")
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [HOME, HELP_CONTACTS]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
