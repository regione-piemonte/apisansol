/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/**
 * @description
 * In questo file viene definita la struttura per il menù di navigazione e le card nella home
 *
 * Ogni item della struttura deve contenere:
 *  - route: la definizione della route
 *  - meta: un oggetto contenente delle informazioni aggiuntive per istruire lo script che costruisce il menù dinamicamente
 *    - navigationLabel: la label mostrata nel menù
 *    - iconName: il nome dell'icona, se si vole mostrare un'icona, dell'item di menù
 *    - isHiddenInHome: se deve essere nascorso nella Home o meno.
 *
 */
import {config} from '@plugins/config'
import * as OLD_SERVICES_ROUTES from "@router/routes/old-services";
import * as APPS_DETACHED from "@router/routes/apps-detached";
import {APP as GLOBAL_APP} from "@router/routes/global";
import {APP as ONLINE_REPORTS_APP} from "@router/routes/online-reports";
import {APP as HEALTH_PAYMENTS_APP} from "@router/routes/health-payments";
import {APP as DELEGATIONS_APP} from "@router/routes/delegations";
import {APP as INCOME_EXEMPTION_APP} from "@router/routes/income-exemption";
import {APP as PRESCRIPTIONS_APP} from "@router/routes/prescriptions";
import {APP as DEV_APP} from "@router/routes/dev";
import {APP as CONSENTS_APP} from "@router/routes/consents";
import {APP as VACCINATIONS_APP} from "@router/routes/vaccinations";
import {APP as PATHOLOGY_EXEMPTION_APP} from "@router/routes/pathology-exemption";
import {APP as RESERVATIONS_APP} from "@router/routes/reservations";
import {APP as CHANGE_DOCTOR_APP} from "@router/routes/change-doctor";
import {APP as COVID_APP} from "@router/routes/covid";
import {DISPATCHER as FFE_DISPATCHER} from "@router/routes/ffe";
import {DIGITAL_TRANSFORMATION} from "@router/routes/digital-transformation";
import CsiIconMenuHome from 'components/global/icons/CsiIconMenuHome'
import CsiIconMenuOnlineReports from 'components/global/icons/CsiIconMenuOnlineReports'
import CsiIconMenuHealthPayments from 'components/global/icons/CsiIconMenuHealthPayments'
import CsiIconMenuIncomeExemption from 'components/global/icons/CsiIconMenuIncomeExemption'
import CsiIconMenuDelegations from 'components/global/icons/CsiIconMenuDelegations'
import CsiIconMenuPrescriptions from 'components/global/icons/CsiIconMenuPrescriptions'
import CsiIconMenuMedicalReservations from 'components/global/icons/CsiIconMenuMedicalReservations'
import CsiIconMenuFse from 'components/global/icons/CsiIconMenuFse'
import CsiIconMenuFfe from 'components/global/icons/CsiIconMenuFfe'
import CsiIconMenuDoctorChange from 'components/global/icons/CsiIconMenuDoctorChange'
import CsiIconMenuScreening from 'components/global/icons/CsiIconMenuScreening'
import CsiIconMenuSurveyNotepad from 'components/global/icons/CsiIconMenuSurveyNotepad'
import CsiIconMenuYourDocuments from 'components/global/icons/CsiIconMenuYourDocuments'
import CsiIconMenuFinder from 'components/global/icons/CsiIconMenuFinder'
import CsiIconMenuPathologyExemption from 'components/global/icons/CsiIconMenuPathologyExemption'
import CsiIconMenuVaccinations from 'components/global/icons/CsiIconMenuVaccinations'
import CsiIconMenuConsents from 'components/global/icons/CsiIconMenuConsents'
import CsiIconMenuCovid from "components/global/icons/CsiIconMenuCovid";
import CsiIconMenuDigitalTransformation from "components/global/icons/CsiIconMenuDigitalTransformation";
import CsiIconMenuCeliacDiseaseVoucher from "components/global/icons/CsiIconMenuCeliacDiseaseVoucher";


export const HOME_ITEM = {
  route: GLOBAL_APP,
  meta: {
    navigationLabel: 'Home',
    iconComponent: CsiIconMenuHome,
    isHiddenInHome: true,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: false,
    isVisibleToMinor: true,
  }
};

export const HOME_NEW_ITEM = {
  route: APPS_DETACHED.HOME_APP,
  meta: {
    navigationLabel: 'Home (Nuovo)',
    iconComponent: CsiIconMenuHome,
    isHiddenInHome: true,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: false,
    isVisibleToMinor: true,
  }
};

export const CONSENTS_ITEM = {
  route: CONSENTS_APP,
  meta: {
    navigationLabel: 'Gestione Consensi',
    navigationDescription: `Visualizza e gestisci i "consensi" che hai concesso o che vuoi concedere in ambito sanitario`,
    iconComponent: CsiIconMenuConsents,
  }
};

export const VACCINATIONS_ITEM = {
  route: VACCINATIONS_APP,
  meta: {
    navigationLabel: 'Vaccinazioni',
    navigationDescription: `Visualizza gli appuntamenti per le vaccinazioni e accedi allo storico dei vaccini effettuati `,
    iconComponent: CsiIconMenuVaccinations,
  }
};

export const VACCINATIONS_NEW_ITEM = {
  route: APPS_DETACHED.VACCINATIONS_APP,
  meta: {
    navigationLabel: 'Vaccinazioni (Nuovo)',
    navigationDescription: `Visualizza gli appuntamenti per le vaccinazioni e accedi allo storico dei vaccini effettuati `,
    iconComponent: CsiIconMenuVaccinations,
  }
};

export const PATHOLOGY_EXEMPTION_ITEM = {
  route: PATHOLOGY_EXEMPTION_APP,
  meta: {
    navigationLabel: 'Esenzioni per Patologie',
    navigationDescription: `Consulta e gestisci le esenzioni per patologia, malattia rara e invalidità`,
    iconComponent: CsiIconMenuPathologyExemption,
  }
};

export const ONLINE_REPORTS_ITEM = {
  route: ONLINE_REPORTS_APP,
  meta: {
    navigationLabel: 'Ritiro Referti e Immagini',
    navigationDescription: `Ritira on line i referti degli esami di laboratorio e radiologici con relative immagini`,
    iconComponent: CsiIconMenuOnlineReports,
  },
};

export const HEALTH_PAYMENTS_ITEM = {
  route: HEALTH_PAYMENTS_APP,
  meta: {
    navigationLabel: 'Pagamento',
    navigationDescription: `Paga il ticket direttamente con la tua carta di credito`,
    iconComponent: CsiIconMenuHealthPayments,
    // isHiddenInMobileHome: true,
    // isHiddenInMobileMenu: true,
  }
};

export const INCOME_EXEMPTION_ITEM = {
  route: INCOME_EXEMPTION_APP,
  meta: {
    navigationLabel: 'Autocertificazione Esenzioni Reddito',
    navigationDescription: `Inserisci e gestisci le esenzioni del ticket per reddito, per te e per i tuoi familiari`,
    iconComponent: CsiIconMenuIncomeExemption,
  },
};

export const DELEGATIONS_ITEM = {
  route: DELEGATIONS_APP,
  meta: {
    navigationLabel: 'Gestione Deleghe',
    //navigationDescription: `Delega un altro soggetto adulto ad utilizzare per conto tuo uno dei servizi on line`,
    navigationDescription: `Delega un altro soggetto adulto ad utilizzare per conto tuo uno dei servizi on line o acquisisci la delega per i tuoi figli minorenni`,
    iconComponent: CsiIconMenuDelegations
  }
};

export const PRESCRIPTIONS_ITEM = {
  route: PRESCRIPTIONS_APP,
  meta: {
    navigationLabel: 'Ricette Dematerializzate',
    navigationDescription: `Visualizza e scarica le ricette non ancora utilizzate`,
    iconComponent: CsiIconMenuPrescriptions,
  }
};

export const MEDICAL_RESERVATIONS_ITEM = {
  route: OLD_SERVICES_ROUTES.MEDICAL_RESERVATIONS_APP,
  meta: {
    navigationLabel: 'Prenotazione Visite ed Esami',
    navigationDescription: `Prenota esami e visite mediche direttamente dal tuo computer`,
    iconComponent: CsiIconMenuMedicalReservations,
    // isHiddenInMobileHome: true,
    // isHiddenInMobileMenu: true,
  }
};

export const FSE_ITEM = {
  route: OLD_SERVICES_ROUTES.FSE_APP,
  meta: {
    navigationLabel: 'Fascicolo Sanitario',
    navigationDescription: `Visualizza e gestisci le modalità di accesso alla tua storia clinica`,
    iconComponent: CsiIconMenuFse,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: true,
    isVisibleToMinor: true,
  }
};

export const FFE_ITEM = {
  route: FFE_DISPATCHER,
  meta: {
    navigationLabel: 'Fascicolo Finanziario',
    navigationDescription: `Inserisci, visualizza e gestisci l'elenco di tutte le tue spese sanitarie`,
    iconComponent: CsiIconMenuFfe,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: true,
  },
};

export const FFE_ITEM_NEW = {
  route: APPS_DETACHED.FFE_APP,
  meta: {
    navigationLabel: 'Fascicolo Finanziario (Nuovo)',
    navigationDescription: `Inserisci, visualizza e gestisci l'elenco di tutte le tue spese sanitarie`,
    iconComponent: CsiIconMenuFfe
  },
};

export const DOCTOR_CHANGE_ITEM = {
  route: OLD_SERVICES_ROUTES.DOCTOR_CHANGE_APP,
  meta: {
    navigationLabel: 'Cambio Medico',
    navigationDescription: `Effettua on line il cambio o revoca del tuo medico di Medicina Generale`,
    iconComponent: CsiIconMenuDoctorChange,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: true,
  },
};

export const DOCTOR_CHANGE_ITEM_NEW = {
  route: CHANGE_DOCTOR_APP,
  meta: {
    navigationLabel: 'Il mio medico',
    navigationDescription: `Effettua on line il cambio o revoca del tuo medico di Medicina Generale`,
    iconComponent: CsiIconMenuDoctorChange
  },
};


export const FEMALE_SCREENING_ITEM = {
  route: OLD_SERVICES_ROUTES.FEMALE_SCREENING_APP,
  meta: {
    navigationLabel: 'Screening dei Tumori Femminili',
    navigationDescription: `Visualizza e modifica gli appuntamenti relativi alla "Prevenzione Serena"`,
    iconComponent: CsiIconMenuScreening,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: true,
  },
};

export const FEMALE_SCREENING_NEW_ITEM = {
  route: APPS_DETACHED.FEMALE_SCREENING_APP,
  meta: {
    navigationLabel: 'Prevenzione Serena (Nuovo)',
    navigationDescription: `Visualizza e modifica gli appuntamenti relativi alla "Prevenzione Serena"`,
    iconComponent: CsiIconMenuScreening,
    isHiddenInMobileHome: false,
    isHiddenInMobileMenu: false,
  },
};

export const SURVEY_NOTEPAD_ITEM = {
  route: OLD_SERVICES_ROUTES.SURVEY_NOTEPAD_APP,
  meta: {
    navigationLabel: 'Taccuino delle Rilevazioni',
    navigationDescription: `Le tue rilevazioni sono visibili all'interno del tuo FSE`,
    iconComponent: CsiIconMenuSurveyNotepad,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: true,
  },
};

export const SURVEY_NOTEPAD_NEW_ITEM = {
  route: APPS_DETACHED.SURVEY_NOTEPAD_APP,
  meta: {
    navigationLabel: 'Taccuino delle Rilevazioni (Nuovo)',
    navigationDescription: `Le tue rilevazioni sono visibili all'interno del tuo FSE`,
    iconComponent: CsiIconMenuSurveyNotepad,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: true,
  }
};

export const YOUR_DOCUMENTS_ITEM = {
  route: OLD_SERVICES_ROUTES.YOUR_DOCUMENTS_APP,
  meta: {
    navigationLabel: 'Documenti Inseriti da te',
    navigationDescription: `I tuoi documenti sono visibili all'interno del tuo FSE`,
    iconComponent: CsiIconMenuYourDocuments,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: true,
  },
};

export const FINDER_ITEM = {
  route: OLD_SERVICES_ROUTES.FINDER_APP,
  meta: {
    navigationLabel: 'Trova un',
    navigationDescription: `(Medico, Pediatra, Ospedale ...)`,
    iconComponent: CsiIconMenuFinder,
    isHiddenInMobileHome: true,
    isHiddenInMobileMenu: true,
  },
};

export const FINDER_NEW_ITEM = {
  route: APPS_DETACHED.FINDER_APP,
  meta: {
    navigationLabel: 'Trova un',
    navigationDescription: `(Medico, Pediatra, Ospedale ...)`,
    iconComponent: CsiIconMenuFinder,
    isHiddenInMobileHome: false,
    isHiddenInMobileMenu: false,
  },
};


export const DEV_ITEM = {
  route: DEV_APP,
  meta: {
    navigationLabel: 'Developers',
    isVisibleToMinor: true,
  }
};

export const DEV_NEW_ITEM = {
  route: APPS_DETACHED.DEVELOPERS_APP,
  meta: {
    navigationLabel: 'Developers',
    isVisibleToMinor: true,
  }
};

export const MEDICAL_RESERVATIONS_ITEM_NEW = {
  route: RESERVATIONS_APP,
  meta: {
    navigationLabel: 'Prenotazioni Visite ed Esami',
    navigationDescription: `Prenota esami e visite mediche direttamente dal tuo computer`,
    iconComponent: CsiIconMenuMedicalReservations,
  }
};

export const COVID_ITEM = {
  route: COVID_APP,
  meta: {
    navigationLabel: 'Covid 19',
    navigationDescription: `Visualizza gli appuntamenti per i tamponi ed accedi alle informazioni relative all’esito dei tamponi effettuati`,
    iconComponent: CsiIconMenuCovid,
  }
};

export const DIGITAL_TRANSFORMATION_PROGRESS = {
  route: DIGITAL_TRANSFORMATION,
  meta: {
    navigationLabel: 'Avanzamento trasformazione digitale',
    navigationDescription: `Visualizza i dati sulla diffusione dei principali servizi digitali sanitari`,
    iconComponent: CsiIconMenuDigitalTransformation,
  }
};

export const CELIAC_DISEASE_VOUCHER_NEW = {
  route: APPS_DETACHED.CELIAC_DISEASE_VOUCHER,
  meta: {
    navigationLabel: 'Buono celiachia (Nuovo)',
    navigationDescription: `Visualizza il saldo mensile, l'estratto conto delle spese e gestisci i pagamenti del tuo buono digitale per celiaci`,
    iconComponent: CsiIconMenuCeliacDiseaseVoucher,
  },
};

export const ASSISTANCE_NEW = {
  route: APPS_DETACHED.ASSISTANCE_APP,
  meta: {
    navigationLabel: 'Assistenza (Nuovo)',
    navigationDescription: `TODO`,
  },
};

const NAVIGATION_TEST = [
  HOME_ITEM,
  HOME_NEW_ITEM,
  COVID_ITEM,
  MEDICAL_RESERVATIONS_ITEM_NEW,
  HEALTH_PAYMENTS_ITEM,
  ONLINE_REPORTS_ITEM,
  PRESCRIPTIONS_ITEM,
  FSE_ITEM,
  FFE_ITEM,
  FFE_ITEM_NEW,
  CELIAC_DISEASE_VOUCHER_NEW,
  DOCTOR_CHANGE_ITEM_NEW,
  FEMALE_SCREENING_ITEM,
  FEMALE_SCREENING_NEW_ITEM,
  YOUR_DOCUMENTS_ITEM,
  INCOME_EXEMPTION_ITEM,
  PATHOLOGY_EXEMPTION_ITEM,
  SURVEY_NOTEPAD_ITEM,
  SURVEY_NOTEPAD_NEW_ITEM,
  DELEGATIONS_ITEM,
  FINDER_NEW_ITEM,
  CONSENTS_ITEM,
  VACCINATIONS_ITEM,
  VACCINATIONS_NEW_ITEM,
  DIGITAL_TRANSFORMATION_PROGRESS,
  ASSISTANCE_NEW,
  // DEV_ITEM,
  DEV_NEW_ITEM,
];

const NAVIGATION_ALPHA = [
  HOME_ITEM,
  COVID_ITEM,
  MEDICAL_RESERVATIONS_ITEM_NEW,
  HEALTH_PAYMENTS_ITEM,
  ONLINE_REPORTS_ITEM,
  FSE_ITEM,
  FFE_ITEM,
  DOCTOR_CHANGE_ITEM_NEW,
  FEMALE_SCREENING_ITEM,
  PRESCRIPTIONS_ITEM,
  YOUR_DOCUMENTS_ITEM,
  INCOME_EXEMPTION_ITEM,
  SURVEY_NOTEPAD_ITEM,
  DELEGATIONS_ITEM,
  FINDER_NEW_ITEM,
  CONSENTS_ITEM,
  VACCINATIONS_ITEM,
  DIGITAL_TRANSFORMATION_PROGRESS,
];

const NAVIGATION_PROD = [
  HOME_ITEM,
  COVID_ITEM,
  MEDICAL_RESERVATIONS_ITEM_NEW,
  HEALTH_PAYMENTS_ITEM,
  ONLINE_REPORTS_ITEM,
  FSE_ITEM,
  FFE_ITEM,
  DOCTOR_CHANGE_ITEM_NEW,
  FEMALE_SCREENING_ITEM,
  PRESCRIPTIONS_ITEM,
  YOUR_DOCUMENTS_ITEM,
  INCOME_EXEMPTION_ITEM,
  SURVEY_NOTEPAD_ITEM,
  DELEGATIONS_ITEM,
  FINDER_NEW_ITEM,
  CONSENTS_ITEM,
  VACCINATIONS_ITEM,
  DIGITAL_TRANSFORMATION_PROGRESS,
];


const getNavigation = () => {
  if (config.global.isProduction) return NAVIGATION_PROD;
  if (config.global.isAlpha) return NAVIGATION_ALPHA;
  return NAVIGATION_TEST
};

export const NAVIGATION = getNavigation();


// ESEMPIO DI GENERAZIONE GRUPPI
// ---------------------------------------------------------------------------------------------------------------------
// export const DELEGATIONS_PIEDMONT_ITEM = {
//   meta: {navigationLabel: 'Piemonte'},
//   route: DELEGATIONS_ROUTES.PIEDMONT_HOME,
// };
//
// export const DELEGATIONS_NO_PIEDMONT_ITEM = {
//   meta: {navigationLabel: 'No Piemonte'},
//   route: DELEGATIONS_ROUTES.NO_PIEDMONT
// };
//
// export const DELEGATIONS_GROUP = {
//   meta: {
//     navigationLabel: 'Deleghe',
//     isGroup: true,
//     iconName: 'people',
//     isHiddenInHome: true,
//   },
//   children: [
//     DELEGATIONS_PIEDMONT_ITEM,
//     DELEGATIONS_NO_PIEDMONT_ITEM,
//   ],
// };
