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
  meta:{
    public:true
  },
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

export const SERVICE_RATING ={
  path: "valutazione",
  name: "serviceRating",
  component: () => import("pages/PageServiceRating.vue")
}

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------

export const EXPENSE_LIST = {
  path: "spese-e-credito",
  name: "expenseList",
  component: () => import("pages/PageExpenseList.vue")
};

  export const PAYMENT_LIST = {
    path: "pagamenti",
  name: "paymentList",
  component: () => import("pages/PagePayment.vue")
};

export const PAYMENT_HISTORY = {
  path: "storico-pagamenti",
  name: "paymentHistory",
  component: () => import("pages/PagePaymentHistory.vue")
};

export const PRIVACY_POLICY = {
  path: "informativa-privacy",
  name: "privacyProlicy",
  meta:{
    privacy:true,
    public:true
  },
  component: () => import("pages/PagePrivacyPolicy.vue")
};

export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue"),
  redirect: EXPENSE_LIST,
  children: [
    EXPENSE_LIST,
    PAYMENT_LIST
    ]
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [HOME, HELP_CONTACTS, PAYMENT_HISTORY, SERVICE_RATING, PRIVACY_POLICY]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
