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

export const getAppFavoriteList = (taxCode, httpConfig = {}) => {
  const url = `/lms/api/v1/cittadini/${taxCode}/applicazioni-preferite`;
  return httpPublic.get(url, httpConfig);
};

export const addAppFavorite = (taxCode, payload, httpConfig = {}) => {
  const url = `/lms/api/v1/cittadini/${taxCode}/applicazioni-preferite`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteAppFavorite = (taxCode, appId, httpConfig = {}) => {
  const url = `/lms/api/v1/cittadini/${taxCode}/applicazioni-preferite/${appId}`;
  return httpAuth.delete(url, httpConfig);
};

export const getAppCategoryList = (taxCode, appId, httpConfig = {}) => {
  const url = `/lms/api/v1/applicazione-categorie`;
  return httpPublic.get(url, httpConfig);
};

export const getMessageList = (httpConfig = {}) => {
  const url = `/lms-cms/api/v1/cms/json/messaggi`;
  return httpPublic.get(url, httpConfig);
};

// PROFILO
// ---------------------------------------------------------------------------------------------------------------------
export const getUserInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisanprof/api/v1/cittadini/${taxCode}/profilo`;
  return httpAuth.get(url, httpConfig);
};

// DELEGHE
// ---------------------------------------------------------------------------------------------------------------------
export const getDelegatorList = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/deleganti`;
  return httpAuth.get(url, httpConfig);
};

export const getDelegateList = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/delegati`;
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

export const getConsent = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consenso`;
  return httpAuth.get(url, httpConfig);
};

// SCEREV
// ---------------------------------------------------------------------------------------------------------------------
export const getMedicalAssistanceInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisanscerev/api/v1/cittadini/${taxCode}/info`;
  return httpAuth.get(url, httpConfig);
};

export const getDoctorDetail = (doctorTaxCode, httpConfig = {}) => {
  const url = `/apisanscerev/api/v1/medici/${doctorTaxCode}`;
  return httpAuth.get(url, httpConfig);
};

// CMS PORTALE
// ---------------------------------------------------------------------------------------------------------------------
export const getKeywordList = (httpConfig = {}) => {
  const url = `/lms-cms//api/v1/cms/json/elenco-parole-chiave`;
  return httpPublic.get(url, httpConfig);
};


//TUTORIAL
//----------------------------------------------------------------------------------------------------------------------
export const setTutorialStatus = (id,payload,httpConfig = {}) => {
  const url = `/lms/api/v1/informazioni-utenti/${id}`;
  return httpPublic.patch(url,payload, httpConfig);
};
