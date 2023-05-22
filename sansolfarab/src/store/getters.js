/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */

import {DELEGATION_STATUS_MAP} from "src/services/config";
import {isEmpty} from "src/services/utils";
import {getUserMinor} from "src/services/business-logic";
const {  subtractFromDate, isBetweenDates } = date;
import { date } from "quasar";

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
  if (!state.delegatorSelected) return state.user?.cf;
  return state.delegatorSelected.codice_fiscale_delega;
};

export const isUserLogged = (state, getters) => {
  return !isEmpty(getters["getUser"]);
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

export const getDelegatorSelectedEnrollmentInfo = state => {
  return state.delegatorSelectedEnrollmentInfo;
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

export const getUsualPharmaciesList = state => {
  return state.usualPharmacies;
};

export const getUserDomicile = (state, getters) => {
  let userInfo = getters["getUserInfo"];
  let domicile = userInfo?.info_anag?.domicilio;
  return domicile ?? null;
};

export const getUserAddress = state => {
  return state.userAddress;
};

export const getPartecipantPharmacies = state => {
  return state.partecipantPharmacies;
};

export const getDeviceUuid = state => {
  // @TODO: per qualche strano motivo Quasar non riconverte la stringa "null" nel localstorage
  //        nel tipo null. Per questo motivo facciamo manualmente la conversione
  if (state.deviceUuid === 'null') return null;
  return state.deviceUuid;
};

export const getUsualPharmacyList = state => {
  return state.usualPharmacyList;
};


export const getActiveUserEnrollmentInfo = (state, getters) => {
  if (state.delegatorSelected)
    return getters.getDelegatorSelectedEnrollmentInfo;
  return getters.getEnrollmentInfo;
};


export const isUserMinor = state =>{
  let userInfo = state.userInfo;
  let taxCode =  state.user?.cf;

  let isUserMinorByTaxCode =  getUserMinor(taxCode)

  // Se non abbiamo i dati di AURA => ci basiamo solo sul codice fiscale
  if (!userInfo) return isUserMinorByTaxCode;

  let birthDate = userInfo?.info_anag?.dati_primari?.data_nascita ?? null;

  // Se AURA non ci forinisce la data di nascita => ci basiamo solo sul codice fiscale
  if (!birthDate) return isUserMinorByTaxCode;

  let now = new Date();
  let maxDate = now;
  let minDate = subtractFromDate(now, { year: 18 });

  return isBetweenDates(birthDate, minDate, maxDate, { onlyDate: true });

}
