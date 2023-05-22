/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {
  APPLICATION_CODE,
  DELEGATION_STATUS_MAP, DOCUMENT_HIDDEN_DIALOG,
  DOCUMENT_HIDDEN_DIALOG_VALUE,
  ENROLLMENT_CODES,
  USER_ENABLING_MAP
} from "src/services/config";
import { orderBy } from "src/services/utils";
import { getUserMinor } from "src/services/business-logic";
import {date, LocalStorage} from "quasar";

const { subtractFromDate, isBetweenDates } = date;

export const getAppList = state => {
  return state.config?.apps ?? [];
};

export const getFcmVapidKey = state => {
  return state.config?.fcm?.vapid_key;
};

export const getFcmConfig = state => {
  return state.config?.fcm?.config;
};

export const getFcmToken = state => {
  return state.fcmToken;
};

export const getUser = state => {
  return state.user;
};


export const getTaxCode = state => {
  if (state.delegatorSelected) {
    return state.delegatorSelected?.codice_fiscale_delega;
  }
  return state.user?.cf;
};

export const getUserInfo = state => {
  return state.userInfo;
};


export const isUserMinorByTaxCode = state => {
  let taxCode = state.user?.cf;
  if (!taxCode) return false;
  return getUserMinor(taxCode);
};

export const isUserMinor = (state, getters) => {
  let userInfo = getters.getUserInfo;
  let isUserMinorByTaxCode = getters.isUserMinorByTaxCode;

  // Se non abbiamo i dati di AURA => ci basiamo solo sul codice fiscale
  if (!userInfo) return isUserMinorByTaxCode;

  let birthDate = userInfo?.info_anag?.dati_primari?.data_nascita ?? null;

  // Se AURA non ci forinisce la data di nascita => ci basiamo solo sul codice fiscale
  if (!birthDate) return isUserMinorByTaxCode;

  let now = new Date();
  let maxDate = now;
  let minDate = subtractFromDate(now, { year: 18 });

  console.log({ minDate, maxDate, birthDate });
  return isBetweenDates(birthDate, minDate, maxDate, { onlyDate: true });
};


export const getNotifyContacts = state => {
  return state.notifyContacts;
};

export const getEnrollmentInfo = state => {
  return state.enrollmentInfo;
};

export const getEnrollmentConsent = state => {
  return state.enrollmentConsent;
};

export const isUserEnrolled = state => {
  let code = state.enrollmentInfo?.codice_risposta;
  let codes = ["000", "002", "003", "004", "005", "008", "010", "016"];
  return codes.includes(code);

  // let codes = [ENROLLMENT_CODES.FSE_APPROVED];
  // return codes.includes(state.enrollmentInfo?.codice_risposta);
};

export const isUserEnrollable = state => {
  return state.enrollmentInfo?.risposta;
};

export const getDelegatorList = state => {
  return state.delegatorList;
};

export const getDelegatorSelected = state => {
  return state.delegatorSelected;
};

export const getDelegatorSelectedEnrollmentInfo = state => {
  return state.delegatorSelectedEnrollmentInfo;
};

export const getDelegatorSelectedEnrollmentConsent = state => {
  return state.delegatorSelectedEnrollmentConsent;
};

export const isDelegatorSelectedEnrolled = state => {
  let code = state.delegatorSelectedEnrollmentInfo?.codice_risposta;
  let codes = ["000", "002", "003", "004", "005", "008", "010", "016"];
  return codes.includes(code);

  // let codes = [ENROLLMENT_CODES.FSE_APPROVED];
  // return codes.includes(state.delegatorSelectedEnrollmentInfo?.codice_risposta);
};

export const isDelegatorSelectedEnrollable = state => {
  return state.delegatorSelectedEnrollmentInfo?.risposta;
};

export const getDelegationListFse = (state, getters) => {
  let delegator = state.delegatorSelected;
  if (!delegator) return [];

  let codes = ["1", "2"];
  let delegationValidStatusList = [
    DELEGATION_STATUS_MAP.ACTIVE,
    DELEGATION_STATUS_MAP.IS_EXPIRING
  ];

  return delegator.deleghe.filter(
    d =>
      codes.includes(d.codice_servizio) &&
      delegationValidStatusList.includes(d.stato_delega)
  );
};

export const getActiveUserEnrollmentInfo = (state, getters) => {
  if (state.delegatorSelected)
    return getters.getDelegatorSelectedEnrollmentInfo;
  return getters.getEnrollmentInfo;
};

export const getEnrollmentCode = (state, getters) => {
   let activeUserEnrollmentInfo = getters.getActiveUserEnrollmentInfo
   return activeUserEnrollmentInfo?.codice_risposta;
};

export const isEnrolled = (state, getters) => {
  if (state.delegatorSelected) return getters.isDelegatorSelectedEnrolled;
  return getters.isUserEnrolled;
};

export const isEnrollable = (state, getters) => {
  if (state.delegatorSelected) return getters.isDelegatorSelectedEnrollable;
  return getters.isUserEnrollable;
};

export const isPiedmontUser = (state, getters) => {
  let piedmontCode = ENROLLMENT_CODES.NO_PIEDMONT;
  let userCode = state.delegatorSelected
    ? state.delegatorSelectedEnrollmentInfo?.codice_risposta
    : state.enrollmentInfo?.codice_risposta;
  console.log(userCode);
  return piedmontCode !== userCode;
};

/**
 * L'elenco dei documenti ROL può essere visto se
 *    1. L'utente attivo è il cittadino loggato ed è arruolato
 *    2. L'utente attivo è il delegante ed è arruolato
 */
export const canSeeDocumentRolList = (state, getters) => {
  let delegator = state.delegatorSelected;
  if (!delegator) return true;

  // return getters.isEnrolled;
  return true;
};

/**
 * L'elenco dei documenti FSE può essere visto se
 *    1. L'utente attivo è il cittadino loggato ed è arruolato
 *    2. L'utente attivo è il delegante ed è arruolato ed ha almeno una delega FSE
 */
export const canSeeDocumentFseList = (state, getters) => {
  let delegator = state.delegatorSelected;
  if (!delegator) return getters.isEnrolled;

  let hasDelegationFseValid = getters.getDelegationListFse.length > 0;
  let consent = getters.getDelegatorSelectedEnrollmentConsent;
  let isEnrolled = getters.isEnrolled || consent?.consenso_alimentazione;

  return isEnrolled && hasDelegationFseValid;
};

/**
 * Il documento FSE può essere oscurato se
 *    1. L'utente attivo è il cittadino loggato
 *    2. L'utente attivo è il delegante ed ha una delega FSE forte attiva
 */
export const canHideDocumentFse = (state, getters) => {
  let delegator = state.delegatorSelected;
  if (!delegator) return true;

  return getters.getDelegationListFse.some(d => d.grado_delega === "FORTE");
};

/**
 * Il documento FSE può essere deoscurato se
 *    1. L'utente attivo è il cittadino loggato
 *    2. L'utente attivo è il delegante ed ha una delega FSE forte attiva
 */
export const canUnhideDocumentFse = (state, getters) => {
  let delegator = state.delegatorSelected;
  if (!delegator) return true;

  return getters.getDelegationListFse.some(d => d.grado_delega === "FORTE");
};

/**
 * I consensi dell'arruolamento possono essere modificati se
 *    1. L'utente attivo è il cittadino loggato ed ha il FSE aperto
 *    2. L'utente attivo è il delegante, ha il FSE aperto ed ha una delega FSE forte attiva
 */
export const canChangeEnrollmentConsent = (state, getters) => {
  let delegator = state.delegatorSelected;
  if (!delegator) return getters.isEnrolled;

  let hasStrongFseDelegation = getters.getDelegationListFse.some(
    d => d.grado_delega === "FORTE"
  );
  return hasStrongFseDelegation && getters.isEnrolled;
};


export const getWorkingApp = (state, getters) => {
  let appList = getters["getAppList"];
  return appList?.find(a => a.codice === APPLICATION_CODE);
};

export const getWorkingAppDelegatorList = (state, getters) => {
  let delegatorList = getters["getDelegatorList"];
  let workingApp = getters["getWorkingApp"];
  let codes = [workingApp?.codice_servizio];

  let delegationValidStatusList = [
    DELEGATION_STATUS_MAP.ACTIVE,
    DELEGATION_STATUS_MAP.IS_EXPIRING
  ];

  delegatorList = delegatorList.filter(delegator => {
    let delegationList = delegator?.deleghe ?? [];
    let result = delegationList.some(delegation => {
      return (
        codes.includes(delegation.codice_servizio) &&
        delegationValidStatusList.includes(delegation.stato_delega)
      );
    });

    return result;
  });

  delegatorList = orderBy(delegatorList, ["cognome_delega", "nome_delega"]);
  return delegatorList;
};

export const getTagList = state => {
  return orderBy(state.tagList, ["testo"]);
};

export const getCategoryList = state => {
  return state.categoryList ?? [];
};
export const getEpisodeTypeList = state => {
  return state.episodeTypeList ?? [];
};

export const getExemptionInfo = state => {
  return state.exemptionInfo;
};
export const getDelegatorListError = state => {
  return state.delegatorListError;
};
export const getUserDoctor = state => {
  return state.userDoctor;
};
export const isNotDoctor = state => {
  return state.noDoctorErr
};
export const getUserEnablingInfo = state => {
  return state.enablingInfo?.abilitazione
};

export const getUserBlockInfo = (state, getters) => {
  let enablingInfo = state.enablingInfo
  let isUserBlocked = enablingInfo?.abilitazione  === USER_ENABLING_MAP.BLOCKED

  if(isUserBlocked){
    return {
      motivo_blocco: state.enablingInfo.motivo_blocco?.codice,
      motivazione_medico : state.enablingInfo.motivazione_medico
    }
  }

  return null
}

export const getDocumentsList = state => {
  return state.documentList ?? []
};


export const getDocumentHiddenDialogInfo = state => {
  return LocalStorage.getItem(DOCUMENT_HIDDEN_DIALOG);
};

export const isDocumentHiddenDialogBlocked = state => {
  return state.documentHiddenDialog === DOCUMENT_HIDDEN_DIALOG_VALUE
};
