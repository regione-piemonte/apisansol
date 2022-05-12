/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {
  DELEGATION_GRADE_MAP,
  DELEGATION_STATUS_MAP,
  FSE_ENROLLMENT_CODES
} from "src/services/config";
import { orderBy } from "src/services/utils";

import { date } from "quasar";
import { getUserMinor } from "src/services/business-logic";
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

export const getUserInfo = state => {
  return state.userInfo;
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
  // return (
  //   state.enrollmentInfo?.codice_risposta === FSE_ENROLLMENT_CODES.FSE_APPROVED
  // );
};

export const isUserEnrollable = state => {
  return state.enrollmentInfo?.risposta === true;
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
  let codes = [FSE_ENROLLMENT_CODES.FSE_APPROVED];
  let enrollment = state.delegatorSelectedEnrollmentInfo;
  let consent = state.delegatorSelectedEnrollmentConsent;
  let isEnrolled = codes.includes(enrollment?.codice_risposta);
  isEnrolled = isEnrolled || consent?.consenso_alimentazione;

  return isEnrolled;

  // return (
  //   state.delegatorSelectedEnrollmentInfo?.codice_risposta ===
  //   FSE_ENROLLMENT_CODES.FSE_APPROVED
  // );
};

export const isDelegatorSelectedEnrollable = state => {
  return state.delegatorSelectedEnrollmentInfo?.risposta === true;
};

export const isDelegatorSelectedPiedmont = state => {
  return state.isDelegatorSelectedPiedmont;
};

export const isNotebookHiddenToDelegator = state => {
  return state.isNotebookHiddenToDelegator;
};

export const isNotebookClosed = state => {
  return state.isNotebookClosed;
};

export const getDelegationTac = (state, getters) => {
  if (!state.delegatorSelected) return null;

  let workingApp = getters["getWorkingApp"];
  let code = workingApp?.codice_servizio;
  let delegationList = state.delegatorSelected?.deleghe ?? [];

  return delegationList.find(d => d.codice_servizio === code);
};

export const isDelegationTacWeak = (state, getters) => {
  let delegation = getters["getDelegationTac"];
  return delegation?.grado_delega === DELEGATION_GRADE_MAP.WEAK;
};

export const getTaxCode = state => {
  if (state.delegatorSelected) {
    return state.delegatorSelected?.codice_fiscale_delega;
  }

  return state.user?.cf;
};

export const getActiveUserEnrollmentInfo = (state, getters) => {
  if (state.delegatorSelected)
    return getters.getDelegatorSelectedEnrollmentInfo;
  return getters.getEnrollmentInfo;
};

export const getWorkingApp = (state, getters) => {
  let appList = getters["getAppList"];
  return appList?.find(a => a.codice === process.env.APP_CODE);
};

export const getWorkingAppDelegatorList = (state, getters) => {
  let delegatorList = getters["getDelegatorList"];
  let workingApp = getters["getWorkingApp"];
  let code = workingApp?.codice_servizio;
  let delegationValidStatusList = [
    DELEGATION_STATUS_MAP.ACTIVE,
    DELEGATION_STATUS_MAP.IS_EXPIRING
  ];

  return delegatorList.filter(delegator => {
    let delegationList = delegator?.deleghe ?? [];
    let result = delegationList.some(delegation => {
      return (
        code === delegation.codice_servizio &&
        delegationValidStatusList.includes(delegation.stato_delega)
      );
    });

    return result;
  });
};

export const getNotebook = state => {
  return state.notebook;
};

export const getMeasureUnitConfiguration = state => {
  return orderBy(state.measureUnitConfig, ["unita_misura_codice"], ["asc"]);
};
export const getDelegatorListError = state => {
  return state.delegatorListError;
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
