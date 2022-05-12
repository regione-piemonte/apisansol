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

export const PRIVACY_LINKS = {
  path: "privacy-condizioni-uso",
  name: "privacyLinks",
  component: () => import("pages/PagePrivacyLinks.vue")
};

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------
export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue")
};

export const APP_LIST = {
  path: "servizi",
  name: "appList",
  component: () => import("pages/PageAppList.vue")
};

export const HOME_NEW = {
  path: "home-nuovo",
  name: "homeNew",
  component: () => import("pages/PageHomeNew.vue")
};

export const APP_LIST_NEW = {
  path: "servizi-nuovo",
  name: "appListNew",
  component: () => import("pages/PageAppListNew.vue")
};

export const LOGOUT = {
  path: 'logout',
  name: 'logout',
  component: () => import('pages/PageLogout'),
}

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    HOME,
    PRIVACY_LINKS,
    APP_LIST,
    HOME_NEW,
    APP_LIST_NEW,
    HELP,
    LOGOUT]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
