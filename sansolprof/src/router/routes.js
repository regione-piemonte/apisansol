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

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------
export const PROFILE_IDENTITY = {
  path: "anagrafica",
  name: "accountProfileIdentity",
  component: () => import("src/pages/PageProfileIdentity")
};

export const PROFILE_CONTACTS = {
  path: "contatti",
  name: "accountProfileContacts",
  component: () => import("src/pages/PageProfileContacts")
};

export const PROFILE_CONTACTS_POLICY = {
  path: "contatti/termini-e-condizioni",
  name: "accountProfileContactsPolicy",
  component: () => import("src/pages/PageProfileContactsPolicy")
};

export const PROFILE_CONTACTS_CREATE = {
  path: "contatti/crea",
  name: "accountProfileContactsCreate",
  component: () => import("src/pages/PageProfileContactsCreate")
};

export const PROFILE_CONTACTS_CREATE_SUCCESS = {
  path: "contatti/crea/successo",
  name: "accountProfileContactsCreateSuccess",
  component: () => import("src/pages/PageProfileContactsCreateSuccess")
};

export const PROFILE_PREFERENCES = {
  path: "preferenze",
  name: "accountProfilePreferences",
  component: () => import("src/pages/PageProfilePreferences")
};

export const PROFILE_NOTIFICATION_LIST = {
  path: "notifiche",
  name: "accountProfileNotificationList",
  component: () => import("src/pages/PageProfileNotificationList")
};

export const PROFILE_NOTIFICATION_DETAIL = {
  path: "notifiche/:id",
  name: "accountProfileNotificationDetail",
  component: () => import("src/pages/PageProfileNotificationDetail")
};

export const PROFILE_ACCESS_LIST = {
  path: "accessi",
  name: "accountProfileAccessList",
  component: () => import("src/pages/PageProfileAccessList")
};

export const PROFILE = {
  path: "",
  component: () => import("src/pages/PageProfile"),
  redirect: PROFILE_IDENTITY,
  children: [
    PROFILE_IDENTITY,
    PROFILE_CONTACTS,
    PROFILE_PREFERENCES,
    PROFILE_NOTIFICATION_LIST,
    PROFILE_ACCESS_LIST
  ]
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    PROFILE,
    PROFILE_CONTACTS_POLICY,
    PROFILE_CONTACTS_CREATE,
    PROFILE_CONTACTS_CREATE_SUCCESS,
    PROFILE_NOTIFICATION_DETAIL
  ]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
