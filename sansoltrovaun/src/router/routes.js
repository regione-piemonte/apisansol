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



export const HOSPITALS = {
  path: "/ospedali-case-di-cura",
  name: "ospedali",
  component: () => import("pages/PageHospitals.vue")
};

export const PHARMACIES = {
  path: "/farmacie",
  name: "farmacie",
  component: () => import("pages/PagePharmacies.vue")
};

export const DOCTORS = {
  path: "/medici-pediatri",
  name: "medici",
  component: () => import("pages/PageDoctors.vue")
};
export const CELIAC_STORES = {
  path: "/punti-vendita-prodotti-celiaci",
  name: "puntiVenditaProdottiCeliaci",
  component: () => import("pages/PageCeliacStores.vue")
};

export const HEALTH_FACILITIES = {
  path: "/strutture-sanitarie",
  name: "struttureSanitarie",
  component: () => import("pages/PageHealthFacilities.vue")
};

export const TEST_NEW_DESIGN = {
  path: "/test-nuova-grafica",
  name: "testNewDesign",
  component: () => import("pages/TestNewDesign.vue")
};

export const TEST_NEW_DESIGN_DOC = {
  path: "/test-nuova-grafica-medici",
  name: "testNewDesignDoc",
  component: () => import("pages/TestNewDesignDoctors.vue")
};

export const HOME = {
  path: "",
  name: "home",
  component: () => import("pages/PageHome.vue"),
  children:[HOSPITALS, PHARMACIES, HEALTH_FACILITIES, CELIAC_STORES, DOCTORS, TEST_NEW_DESIGN, TEST_NEW_DESIGN_DOC]
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [HOME, HELP_CONTACTS, SERVICE_RATING]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
