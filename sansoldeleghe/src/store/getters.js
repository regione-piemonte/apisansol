/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { DELEGATION_STATUS_MAP } from "src/services/config";
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

export const isPiedmontUser = state => {
  return !!state.userInfo;
  // && state.userProfile.info_anag.dati_primari.cod_cittadinanza === '100'
};

export const getTaxCode = state => {
  if (!state.delegatorSelected) return state.user?.cf;
  return state.delegatorSelected.codice_fiscale_delega;
};

// export const delegableAppServices = (state, getters) => {
//   let appList = getters["getAppList"];
//   if(!appList) return []
//   return appList?.filter(a => a.delegabile)
// };

export const delegableAppServices = state => {
  return state.delegableAppList;
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
