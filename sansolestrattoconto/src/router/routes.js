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
  // children: [HELP_CONTACTS, HELP_FAQ]
};

export const SERVICE_RATING ={
  path: "valutazione",
  name: "serviceRating",
  component: () => import("pages/PageServiceRating.vue")
}

export const PRIVACY_POLICY = {
  path: "informativa-privacy",
  name: "privacyProlicy",
  meta:{
    privacy:true,
    public:true
  },
  component: () => import("pages/PagePrivacyPolicy.vue")
};

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------
export const EXPENSE_LIST = {
  path: "spese",
  name: "expenseList",
  component: () => import("pages/PageExpenseList.vue")
};

export const CREDIT_LIST = {
  path: "crediti",
  name: "creditList",
  component: () => import("pages/PageCreditList.vue")
};

export const REFUND_LIST = {
  path: "rimborsi",
  name: "refoundList",
  component: () => import("pages/PageRefundList.vue")
};

export const REFUND_CREDIT = {
  path: "rimborsi/:id",
  name: "refundCredit",
  component: () => import("pages/PageRefundCredit.vue")
}

export const REFUND_CREDIT_FEEDBACK = {
  path: "rimborsi/:id/richiesta-rimborso",
  name: "refundCreditFeedback",
  component: () => import("pages/PageRefundFeedback.vue")
}


export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue"),
  redirect: EXPENSE_LIST,
  children: [
    EXPENSE_LIST,
    CREDIT_LIST,
    REFUND_LIST,
  ]
};





export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [HOME,  HELP_CONTACTS, SERVICE_RATING, REFUND_CREDIT, REFUND_CREDIT_FEEDBACK, PRIVACY_POLICY]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
