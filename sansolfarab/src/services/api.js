/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */

import { httpAuth, httpPublic } from "src/boot/http";
import { store } from "src/store";
import { extend } from "quasar";

export const getUser = (httpConfig = {}) => {
  return httpAuth.get("/bff/identity", httpConfig);
};

export const getConfig = (httpConfig = {}) => {
  return httpPublic.get("/lms/api/v1/configurazione", httpConfig);
};

// PROFILO
// ---------------------------------------------------------------------------------------------------------------------
export const getUserInfo = (taxCode, httpConfig = {}) => {
  const url = `/api/v1/cittadini/${taxCode}/profilo`;
  return httpAuth.get(url, httpConfig);
};

// DELEGHE
// ---------------------------------------------------------------------------------------------------------------------
export const getDelegatorList = (taxCode, httpConfig = {}) => {
  const url = `//api/v1/cittadini/${taxCode}/deleganti`;
  return httpAuth.get(url, httpConfig);
};

// NOTIFICATORE
// ---------------------------------------------------------------------------------------------------------------------
export const getNotifyMessages = (taxCode, httpConfig = {}) => {
  const url = `//api/v1/users/${taxCode}/messages-lms`;
  return httpAuth.get(url, httpConfig);
};

export const getNotifyMessagesUnseen = (taxCode, httpConfig = {}) => {
  const url = `//api/v1/users/${taxCode}/messages-unseen`;
  return httpAuth.get(url, httpConfig);
};

export const updateMessagesAsSeen = (taxCode, payload, httpConfig = {}) => {
  const url = `//api/v1/users/${taxCode}/messages-unseen`;
  return httpAuth.put(url, payload, httpConfig);
};

export const deleteMessage = (taxCode, id, httpConfig = {}) => {
  const url = `//api/v1/users/${taxCode}/messages/${id}`;
  return httpAuth.delete(url, httpConfig);
};

export const getNotifyContacts = (taxCode, httpConfig = {}) => {
  const url = `/api/v1/users/${taxCode}/contacts`;
  return httpAuth.get(url, httpConfig);
};

export const updateNotifyContacts = (taxCode, payload, httpConfig = {}) => {
  const url = `/api/v1/users/${taxCode}/contacts`;
  return httpAuth.put(url, payload, httpConfig);
};

// FSE
// ---------------------------------------------------------------------------------------------------------------------
export const getEnrollmentInfo = (taxCode, httpConfig = {}) => {
  const url = `/api/v1/cittadini/${taxCode}/arruolamento`;
  return httpAuth.get(url, httpConfig);
};

export const saveDoNotAskMeAgain2 = (taxCode, httpConfig = {}) => {
  const url = `/api/v1/cittadini/${taxCode}/consultazione-preferenze`;
  return httpAuth.put(url, httpConfig);
};

//CROSS
// ---------------------------------------------------------------------------------------------------------------------
// Permette di avere la lista suggest indirizzi
export const getSuggestedAddress = async (httpConfig = {}) => {
  const URL = `/api/v1/indirizzi/_search`;
  return httpPublic.get(URL, httpConfig);
};

//TROVA UN
// ---------------------------------------------------------------------------------------------------------------------
// Permette di avere la lista delle farmacie
export const getPharmacies = (httpConfig = {}) => {
  const url = `//api/v1/farmacie`;
  return httpPublic.get(url, httpConfig);
};

// FARAB
// ---------------------------------------------------------------------------------------------------------------------
const addQueryParamDelegationCode = httpConfig => {
  let workingApp = store.getters["getWorkingApp"];
  let result = extend(true, {}, httpConfig);
  result.params = result.params || {};
  result.params.codice_verticale_delega = workingApp?.codice;
  return result;
};

export const getPartecipantPharmacies = (httpConfig = {}) => {
  const url = `api/v1/farmacie-aderenti/codice`;
  return httpPublic.get(url, httpConfig);
};

export const getOccasionalPharmacy = (httpConfig = {}) => {
  const url = `api/v1/farmacia-occasionale`;
  httpConfig = addQueryParamDelegationCode(httpConfig);
  return httpPublic.get(url, httpConfig);
};

export const associateDeviceOtp = (data, httpConfig = {}) => {
  const url = `api/v1/device-certificato`;
  httpConfig = addQueryParamDelegationCode(httpConfig);
  return httpPublic.post(url, data, httpConfig);
};

export const authorizePharmacy = (data, httpConfig = {}) => {
  const url = `api/v1/farmacia-occasionale/autorizzazione`;
  httpConfig = addQueryParamDelegationCode(httpConfig);
  return httpPublic.post(url, data, httpConfig);
};

export const getUsualPharmacies = (taxCode, httpConfig = {}) => {
  const url = `/api/v1/cittadini/${taxCode}/farmacie-abituali`;
  httpConfig = addQueryParamDelegationCode(httpConfig);
  return httpAuth.get(url, httpConfig);
};

export const changeUsualPharmacy = (taxCode, data, httpConfig = {}) => {
  const url = `/api/v1/cittadini/${taxCode}/farmacie-abituali`;
  httpConfig = addQueryParamDelegationCode(httpConfig);
  return httpAuth.post(url, data, httpConfig);
};

export const getCertifiedDevice = (taxCode, httpConfig = {}) => {
  const url = `/api/v1/cittadini/${taxCode}/device-certificato`;
  return httpAuth.get(url, httpConfig);
};

export const associateDevice = (taxCode, data, httpConfig = {}) => {
  const url = `/api/v1/cittadini/${taxCode}/device-certificato`;
  httpConfig = addQueryParamDelegationCode(httpConfig);
  return httpAuth.post(url, data, httpConfig);
};

export const disassociateDevice = (taxCode, httpConfig = {}) => {
  const url = `/api/v1/cittadini/${taxCode}/device-certificato`;
  return httpAuth.delete(url, httpConfig);
};


//TUTORIAL
//----------------------------------------------------------------------------------------------------------------------
export const setTutorialStatus = (id,payload,httpConfig = {}) => {
  const url = `/lms/api/v1/informazioni-utenti/${id}`;
  return httpPublic.patch(url,payload, httpConfig);
};

//CUSTOMLOG
export const writeCustomLog = (payload,httpConfig = {}) => {
  const url = `/bff/apps/farab/custom-logs`;
  return httpAuth.post(url,payload, httpConfig);
};

