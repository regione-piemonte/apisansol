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
export const WELCOME = {
  path: "benvenuto",
  name: "welcome",
  component: () => import("pages/PageWelcome.vue")
};

export const GENERAL_NOTES = {
  path: "informazioni-generali",
  name: "generalNotes",
  component: () => import("pages/PageGeneralNotes.vue")
};

export const GENERAL_NOTES_EDIT = {
  path: "informazioni-generali/modifica",
  name: "generalNotesEdit",
  component: () => import("pages/PageGeneralNotes.vue")
};

export const SETTINGS = {
  path: "impostazioni",
  name: "settings",
  component: () => import("pages/PageSettings.vue")
};

export const DETECTION_LIST = {
  path: "",
  name: "detectionList",
  component: () => import("pages/PageDetectionList.vue")
};

export const DETECTION_MEASURES = {
  path: "rilevazioni/misure",
  name: "detectionMeasures",
  component: () => import("pages/PageDetectionMeasures.vue")
};

export const DETECTION_TEMPERATURE = {
  path: "rilevazioni/temperature",
  name: "detectionTemperatures",
  component: () => import("pages/PageDetectionTemperature.vue")
};

export const DETECTION_BREATH_FREQ = {
  path: "rilevazioni/frequenze-respiratorie",
  name: "detectionBreathFreq",
  component: () => import("pages/PageDetectionBreathFreq.vue")
};

export const DETECTION_OXYMETRY = {
  path: "rilevazioni/ossimetria",
  name: "detectionOxymetry",
  component: () => import("pages/PageDetectionOxymetry.vue")
};

export const DETECTION_PRESSURE = {
  path: "rilevazioni/pressione",
  name: "detectionPressure",
  component: () => import("pages/PageDetectionPressure.vue")
};

export const DETECTION_CHOLESTEROL = {
  path: "rilevazioni/colesterolo",
  name: "detectionCholesterol",
  component: () => import("pages/PageDetectionCholesterol.vue")
};

export const DETECTION_INSULIN = {
  path: "rilevazioni/insulina",
  name: "detectionInsulin",
  component: () => import("pages/PageDetectionInsulin.vue")
};

export const DETECTION_GLYCEMIA = {
  path: "rilevazioni/glicemia",
  name: "detectionGlycemia",
  component: () => import("pages/PageDetectionGlycemia.vue")
};

export const DETECTION_HEMOGLOBIN = {
  path: "rilevazioni/emoglobina",
  name: "detectionHemoglobin",
  component: () => import("pages/PageDetectionHemoglobin.vue")
};

export const PAIN = {
  path: "dolori",
  name: "pain",
  component: () => import("pages/PagePain.vue")
};

export const SYMPTOM = {
  path: "sintomi",
  name: "symptom",
  component: () => import("pages/PageSymptom.vue")
};

export const EVENT = {
  path: "eventi",
  name: "event",
  component: () => import("pages/PageEvent.vue")
};

export const DRUG = {
  path: "farmaci",
  name: "drug",
  component: () => import("pages/PageDrug.vue")
};

export const STRUCTURE_CONTACT = {
  path: "contatti-strutture",
  name: "structureContact",
  component: () => import("pages/PageStructureContact.vue")
};

export const DIET = {
  path: "dieta",
  name: "diet",
  component: () => import("pages/PageDiet.vue")
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/LayoutApp.vue"),
  children: [
    DETECTION_LIST,
    DETECTION_MEASURES,
    DETECTION_TEMPERATURE,
    DETECTION_BREATH_FREQ,
    DETECTION_OXYMETRY,
    DETECTION_PRESSURE,
    DETECTION_CHOLESTEROL,
    DETECTION_INSULIN,
    DETECTION_GLYCEMIA,
    DETECTION_HEMOGLOBIN,
    PAIN,
    SYMPTOM,
    EVENT,
    DRUG,
    STRUCTURE_CONTACT,
    DIET,
    WELCOME,
    GENERAL_NOTES,
    GENERAL_NOTES_EDIT,
    SETTINGS,
    HELP_CONTACTS
  ]
};

const routes = [LAYOUT_APP];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push(ERROR_404);
}

export default routes;
