/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { httpAuth, httpPublic } from "src/boot/http";

export const getUser = (httpConfig = {}) => {
  return httpAuth.get("/bff/identity", httpConfig);
};

export const getConfig = (httpConfig = {}) => {
  return httpPublic.get("/lms/api/v1/configurazione", httpConfig);
};

//BFF
//___________________

// Permette di avere la lista delle associazioni utente-applicazione
export const getUserApplicationsList = async (taxCode, httpConfig = {}) => {
  return httpAuth.get(
    `/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni`,
    httpConfig
  );
};

// Permette di gestiore le diverse associazioni utente-applicazione
export const setUserApplicationInformation = async (
  taxCode,
  appId,
  httpConfig = {}
) => {
  const URL = `/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni/${appId}`;
  return httpAuth.post(URL, httpConfig);
};

// CMS
// ---------------------------------------------------------------------------------------------------------------------
export const getCmsMessageList = async (httpConfig = {}) => {
  const URL = `/lms-cms/api/v1/cms/json/messaggi`;
  return httpPublic.get(URL, httpConfig);
};

// PROFILO
// ---------------------------------------------------------------------------------------------------------------------
// export const getUserInfo = (taxCode, httpConfig = {}) => {
//   const url = `/apisanprof/api/v1/cittadini/${taxCode}/profilo`;
//   return httpAuth.get(url, httpConfig);
// };

// DELEGHE
// ---------------------------------------------------------------------------------------------------------------------
export const getDelegatorList = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/deleganti`;
  return httpAuth.get(url, httpConfig);
};

// NOTIFICATORE
// ---------------------------------------------------------------------------------------------------------------------
export const getNotifyMessages = (taxCode, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-lms`;
  return httpAuth.get(url, httpConfig);
};

export const getNotifyMessagesUnseen = (taxCode, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-unseen`;
  return httpAuth.get(url, httpConfig);
};

export const updateMessagesAsSeen = (taxCode, payload, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-unseen`;
  return httpAuth.put(url, payload, httpConfig);
};

export const deleteMessage = (taxCode, id, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages/${id}`;
  return httpAuth.delete(url, httpConfig);
};

export const getNotifyContacts = (taxCode, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/contacts`;
  return httpAuth.get(url, httpConfig);
};

export const updateNotifyContacts = (taxCode, payload, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/contacts`;
  return httpAuth.put(url, payload, httpConfig);
};

// FSE
// ---------------------------------------------------------------------------------------------------------------------
export const getEnrollmentInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/arruolamento`;
  return httpAuth.get(url, httpConfig);
};

export const saveDoNotAskMeAgain = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/arruolamento`;
  return httpAuth.put(url, httpConfig);
};

export const saveDoNotAskMeAgain2 = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consultazione-preferenze`;
  return httpAuth.put(url, httpConfig);
};

export const getEnrollmentConsent = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consenso`;
  return httpAuth.get(url, httpConfig);
};

// COVID
// ---------------------------------------------------------------------------------------------------------------------
export const createOtp = (payload, httpConfig = {}) => {
  const url = `/solcovidapisrv/api/autenticazione/otp`;
  return httpPublic.post(url, payload, httpConfig);
};

export const verifyOtp = (payload, httpConfig = {}) => {
  const url = `/solcovidapisrv/api/autenticazione/otp/verifica`;
  return httpPublic.post(url, payload, httpConfig);
};

const getCitizenDetailAnonymous = (httpConfig = {}) => {
  const url = `/solcovidapisrv/api/anonimo/cittadino`;
  return httpPublic.get(url, httpConfig);
};

const getCitizenDetailAuth = (taxCode, httpConfig = {}) => {
  const url = `/solcovidapisrv/api/cittadino/${taxCode}`;
  return httpAuth.get(url, httpConfig);
};

export const getCitizenDetail = (taxCode, httpConfig = {}) => {
  return taxCode
    ? getCitizenDetailAuth(taxCode, httpConfig)
    : getCitizenDetailAnonymous(httpConfig);
};

const updateCitizenContactsAnonymous = (id, payload, httpConfig = {}) => {
  const url = `/solcovidapisrv/api/anonimo/cittadino/${id}/contatti`;
  return httpPublic.put(url, payload, httpConfig);
};

const updateCitizenContactsAuth = (id, payload, httpConfig = {}) => {
  const url = `/solcovidapisrv/api/cittadino/${id}/contatti`;
  return httpAuth.put(url, payload, httpConfig);
};

export const updateCitizenContacts = (
  taxCode,
  id,
  payload,
  httpConfig = {}
) => {
  return taxCode
    ? updateCitizenContactsAuth(id, payload, httpConfig)
    : updateCitizenContactsAnonymous(id, payload, httpConfig);
};

const getIsDocumentDownloadableAnonymous = (id, httpConfig = {}) => {
  let taxCode = "CODE";
  const url = `/solcovidapisrv/api/cittadini/${taxCode}/documenti/${id}/verifica-documento-scaricabile`;
  httpConfig = httpConfig || {};
  httpConfig.params = httpConfig.params || {};
  httpConfig.params = { ...httpConfig.params, sessione_otp: true };
  return httpPublic.get(url, httpConfig);
};

const getIsDocumentDownloadableAuth = (taxCode, id, httpConfig = {}) => {
  const url = `/solcovidapisrv/api/cittadini/${taxCode}/documenti/${id}/verifica-documento-scaricabile`;
  return httpAuth.get(url, httpConfig);
};

export const getIsDocumentDownloadable = (taxCode, id, httpConfig = {}) => {
  return taxCode
    ? getIsDocumentDownloadableAuth(taxCode, id, httpConfig)
    : getIsDocumentDownloadableAnonymous(id, httpConfig);
};

const getDocumentPdfUrlAnonymous = (documentId, httpConfig = {}) => {
  let taxCode = "CODE";
  const url = `${httpPublic.defaults.baseURL}/solcovidapisrv/api/cittadini/${taxCode}/documenti/${documentId}/documento`;
  httpConfig = httpConfig || {};
  httpConfig.params = httpConfig.params || {};
  httpConfig.params = { ...httpConfig.params, sessione_otp: true };
  return httpPublic.getUri({ url, ...httpConfig });
};

const getDocumentPdfUrlAuth = (taxCode, documentId, httpConfig = {}) => {
  const url = `${httpAuth.defaults.baseURL}/solcovidapisrv/api/cittadini/${taxCode}/documenti/${documentId}/documento`;
  return httpAuth.getUri({ url, ...httpConfig });
};

export const getDocumentPdfUrl = (taxCode, documentId, httpConfig = {}) => {
  return taxCode
    ? getDocumentPdfUrlAuth(taxCode, documentId, httpConfig)
    : getDocumentPdfUrlAnonymous(documentId, httpConfig);
};

const getDocumentRolOldPdfUrlAnonymous = (httpConfig = {}) => {
  let taxCode = "CODE";
  const url = `${httpPublic.defaults.baseURL}/solcovidapisrv/api/cittadini/${taxCode}/referti/pdf`;
  httpConfig = httpConfig || {};
  httpConfig.params = httpConfig.params || {};
  httpConfig.params = { ...httpConfig.params, sessione_otp: true };
  return httpPublic.getUri({ url, ...httpConfig });
};

const getDocumentRolOldPdfUrlAuth = (taxCode, httpConfig = {}) => {
  const url = `${httpAuth.defaults.baseURL}/solcovidapisrv/api/cittadini/${taxCode}/referti/pdf`;
  return httpAuth.getUri({ url, ...httpConfig });
};

export const getDocumentRolOldPdfUrl = (taxCode, httpConfig = {}) => {
  return taxCode
    ? getDocumentRolOldPdfUrlAuth(taxCode, httpConfig)
    : getDocumentRolOldPdfUrlAnonymous(httpConfig);
};

export const getMobilePhonePrefixList = (httpConfig = {}) => {
  const url = `/solcovidapisrv/api/decodifiche/prefissi-telefonici`;
  return httpPublic.get(url, httpConfig);
};
