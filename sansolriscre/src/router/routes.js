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

export const SERVICE_RATING ={
  path: "valutazione",
  name: "serviceRating",
  component: () => import("pages/PageServiceRating.vue")
}

// PAGINE VERTICALE
// ---------------------------------------------------------------------------------------------------------------------


export const POLICY = {
  path: "informativa-privacy",
  name: "privacyPolicy",
  component: () => import("pages/PagePolicy.vue")
};


export const UPCOMING_APPOINTMENTS = {
  path: "appuntamenti",
  name: "UpcomingAppointments",
  meta:{ showPolicy: true},
  component: () => import("pages/PageUpcomingAppointments")
};

export const NEW_APPOINTMENT_DATE = {
  path: ":type/nuova-data",
  name: "ChangeDate",
  meta:{ showPolicy: true},
  component: () => import("pages/PageNewDateAppointment")
};

export const NEW_APPOINTMENT_PLACE = {
  path: ":type/nuova-struttura",
  name: "ChangePlace",
  meta:{ showPolicy: true},
  component: () => import("pages/PageNewPlaceAppointment")
};



export const TESTS_CARRIED_OUT = {
  path: "esami-effettuati",
  name: "TestsCarriedOut",
  component: () => import("pages/PageExaminationsCarriedOut")
};

export const NOTICES = {
  path: "comunicazioni",
  name: "Notices",
  meta:{ showPolicy: true},
  component: () => import("pages/PageNotices")
};

export const CONTACTS = {
  path: "contatti",
  name: "Contacts",
  meta:{ showPolicy: true},
  component: () => import("pages/PageContacts")
};

export const MAP = {
  path: "mappa-unita-operative",
  name: "opUnitMap",
  meta:{ showPolicy: true},
  component: () => import("pages/PageUnitOpMap")
};


export const NEW_APPOINTMENT_SUMMARY = {
  path: ":type/riepilogo-appuntamento",
  name: "NewAppointmentSummary",
  meta:{ showPolicy: true},
  component: () => import("pages/PageNewAppointmentSummary")
};

export const HOME = {
  path: "",
  name: "PageHome",
  component: () => import("pages/PageHome.vue"),
  children: [UPCOMING_APPOINTMENTS, TESTS_CARRIED_OUT, NOTICES, CONTACTS, MAP]
};


export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    HOME,
    NEW_APPOINTMENT_DATE,
    NEW_APPOINTMENT_PLACE,
    NEW_APPOINTMENT_SUMMARY,
    HELP_CONTACTS,
    SERVICE_RATING,
    POLICY
  ]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
