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


export const SERVICE_RATING = {
  path: "valutazione",
  name: "serviceRating",
  component: () => import("pages/PageServiceRating.vue")
}

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------
export const ANONYMOUS = {
  path: "anonimo",
  name: "anonymous",
  component: () => import("pages/PageAnonymous.vue")
};

// export const REPORT_LIST = {
//   path: "referti",
//   name: "reportList",
//   component: () => import("pages/PageReportList.vue")
// };
//
// export const REPORT_DETAIL = {
//   path: "referti/:id",
//   name: "reportDetail",
//   component: () => import("pages/PageReportDetail.vue")
// };

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  redirect: ANONYMOUS,
  children: [ANONYMOUS, HELP_CONTACTS, SERVICE_RATING]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
