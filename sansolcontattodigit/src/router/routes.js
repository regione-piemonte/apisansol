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
};

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------


export const CONVERSATION_LIST = {
  path: "",
  name: "conversationList",
  component: () => import("pages/PageConversationList.vue")
};


export const CONVERSATION_DETAIL = {
  path: ":id",
  name: "conversationDetail",
  component: () => import("pages/PageConversationDetail.vue")
};

// export const CONVERSATION_DETAIL_NEW = {
//   path: "dettaglio/:id",
//   name: "conversationDetailNew",
//   component: () => import("pages/PageConversationDetailOld.vue")
// };

// export const APP = {
//   path: "",
//   name: "app",
//   component: () => import("pages/AppCod.vue"),
//   children: [
//     CONVERSATION_LIST,
//     CONVERSATION_DETAIL,
//   ]
// };



export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    CONVERSATION_LIST,
    HELP_CONTACTS,
    SERVICE_RATING,
  ]
};

export const LAYOUT_CONVERSATION_DETAIL = {
  path: "/conversazioni",
  component: () => import("layouts/LayoutConversationDetail.vue"),
  children: [
    CONVERSATION_DETAIL,
  ]
};

const routes = [LAYOUT_APP, LAYOUT_CONVERSATION_DETAIL];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
