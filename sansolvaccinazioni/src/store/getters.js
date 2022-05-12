/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {
  DELEGATION_STATUS_MAP,
  ENROLLMENT_CODE_MAP
} from "src/services/config";
import { getUserMinor } from "src/services/business-logic";
import { date } from "quasar";

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

export const getDelegatorList = state => {
  return state.delegatorList;
};

export const getDelegatorSelected = state => {
  return state.delegatorSelected;
};

export const isDelegationActive = state => {
  return state.delegatorSelected !== null;
};

export const getTaxCode = state => {
  if (!state.delegatorSelected) return state.user?.cf;
  return state.delegatorSelected.codice_fiscale_delega;
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

export const getDelegatorSelectedEnrollmentInfo = state => {
  return state.delegatorSelectedEnrollmentInfo;
};

export const isDelegatorSelectedEnrolled = state => {
  let codes = [ENROLLMENT_CODE_MAP.FSE_APPROVED];
  return codes.includes(state.delegatorSelectedEnrollmentInfo?.codice_risposta);
};

export const getActiveUserEnrollmentInfo = (state, getters) => {
  if (state.delegatorSelected)
    return getters.getDelegatorSelectedEnrollmentInfo;
  return getters.getEnrollmentInfo;
};

export const getUserApplicationsList = state => {
  return state.userApplicationsList ?? [];
};

// Permette di ottenere le associazioni utente-applicazione , dato un id applicazione
export const userAppInfo = (state, getters) => {
  let appList = getters["getUserApplicationsList"];
  let workingApp = getters["getWorkingApp"];
  let appId = workingApp?.id;
  if (!appList) return undefined;
  return appList.find(app => app.applicazione_id === appId);
};

export const getDelegatorListError = state => {
  return state.delegatorListError;
};
