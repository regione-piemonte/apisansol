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
export const INFORMATIVE = {
  path: "informativa",
  name: "informative",
  component: () => import("pages/PageInformative.vue")
};

export const APPOINTMENT_NEW = {
  path: "appuntamenti/nuovo",
  name: "appointmentNew",
  component: () => import("pages/PageAppointmentNew.vue")
};

export const APPOINTMENT_NEW_SUCCESS = {
  path: 'appuntamenti/nuovo/successo',
  name: 'appointmentNewSuccess',
  component: () => import('pages/PageAppointmentNewSuccess'),

};

export const APPOINTMENT_LIST = {
  path: "appuntamenti",
  name: "appointmentList",
  component: () => import("pages/PageAppointmentList.vue")
};

export const VACCINATION_LIST = {
  path: "vaccini-effettuati",
  name: "vaccinationList",
  component: () => import("pages/PageVaccinationList.vue")
};

export const USER_CONTACTS = {
  path: "contatti",
  name: "userContacts",
  component: () => import("pages/PageUserContacts.vue")
};

export const VACCINATION_CENTER_LIST = {
  path: "centri-vaccinali",
  name: "vaccinationCenterList",
  component: () => import("pages/PageVaccinationCenterList.vue")
};

export const VACCINATION_CALENDAR = {
  path: "calendario-vaccinale",
  name: "vaccinationCalendar",
  component: () => import("pages/PageVaccinationCalendar.vue")
};

export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome"),
  redirect: APPOINTMENT_LIST,
  children: [
    APPOINTMENT_LIST,
    VACCINATION_LIST,
    USER_CONTACTS,
    VACCINATION_CENTER_LIST,
    VACCINATION_CALENDAR
  ]
};

export const DELETE = {
  path: ':id/cancellazione',
  name: 'Delete',
  component: () => import('pages/PageVaccinationsCancel'),

};

export const DELETE_SUCCESS = {
  path: 'riepilogo',
  name: 'DeleteSuccess',
  component: () => import('pages/PageVaccinationsCancelSuccess'),
};

export const OMISSION = {
  path: ':id/omissione',
  name: 'Omission',
  component: () => import('pages/PageVaccinationsOmission'),
};

export const OMISSION_SUCCESS = {
  path: ':id/omissione/successo',
  name: 'OmissionSuccess',
  component: () => import('pages/PageVaccinationsOmissionSuccess'),

};

export const DIFFERIMENT = {
  path: ':id/differimento',
  name: 'VaccinationsDifferiment',
  component: () => import('pages/PageVaccinationsDifferiment'),

};

export const DIFFERIMENT_SUCCESS = {
  path: ':id/differimento/successo',
  name: 'VaccinationsDifferimentSuccess',
  component: () => import('pages/PageVaccinationsDifferimentSuccess'),

};

export const EVENT = {
  path: ':id/eventoAvverso',
  name: 'VaccinationsEvent',
  component: () => import('pages/PageVaccinationsEvent'),

};

export const EVENT_SUCCESS = {
  path: ':id/eventoAvverso/successo',
  name: 'VaccinationsEventSuccess',
  component: () => import('pages/PageVaccinationsEventSuccess'),
};

export const SELFCONTRIBUTION = {
  path: 'autocontribuzione',
  name: 'autocontribution',
  component: () => import('pages/PageSelfcontribution'),

};

export const SELFCONTRIBUTION_SUCCESS = {
  path: 'autocontribuzione/successo',
  name: 'autocontributionSuccess',
  component: () => import('pages//PageSelfcontributionSuccess'),
};

export const MOVE = {
  path: ':id/sposta-vaccinazione',
  name: 'VaccinationsMove',
  component: () => import('pages/PageVaccinationsMove'),
};

export const MOVE_SUCCESS = {
  path: ':id/sposta-vaccinazione/successo',
  name: 'VaccinationsMoveSuccess',
  component: () => import('pages/PageVaccinationsMoveSuccess'),

};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [HOME, APPOINTMENT_NEW, APPOINTMENT_NEW_SUCCESS, INFORMATIVE, HELP_CONTACTS, SERVICE_RATING, DELETE, DELETE_SUCCESS, OMISSION,
    OMISSION_SUCCESS, DIFFERIMENT, DIFFERIMENT_SUCCESS, EVENT, EVENT_SUCCESS, SELFCONTRIBUTION, SELFCONTRIBUTION_SUCCESS,
  MOVE, MOVE_SUCCESS]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
