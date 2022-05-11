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

// CELIACHIA
//----------------------------------------------------------------------------------------------------------------------
export const getCurrentPayslip = (taxCode, httpConfig = {}) => {
  const url = `/apisanceliachia/api/v1/cittadini/${taxCode}/cedolini/corrente`;
  return httpAuth.get(url, httpConfig);
};

export const getMovementList = (taxCode, httpConfig = {}) => {
  const url = `/apisanceliachia/api/v1/cittadini/${taxCode}/erogazioni`;
  return httpAuth.get(url, httpConfig);
};

export const getCurrentPin = (taxCode, httpConfig = {}) => {
  const url = `/apisanceliachia/api/v1/cittadini/${taxCode}/pin`;
  return httpAuth.get(url, httpConfig);
};

export const createNewPin = (taxCode, httpConfig = {}) => {
  const url = `/apisanceliachia/api/v1/cittadini/${taxCode}/pin`;
  return httpAuth.post(url);
};

export const getQRCode = (taxCode, httpConfig = {}) => {
  const url = `/apisanceliachia/api/v1/cittadini/${taxCode}/codice-qr`;
  return httpAuth.get(url, httpConfig);
};


// BFF
//----------------------------------------------------------------------------------------------------------------------
// Permette di avere la lista delle associazioni utente-applicazione
export const getUserApplicationsList = async (taxCode,httpConfig = {}) => {
  return httpAuth.get(`/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni`, httpConfig);
};


// Permette di gestiore le diverse associazioni utente-applicazione
export const setUserApplicationInformation = async (taxCode,appId, httpConfig = {}) => {
  const URL = `/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni/${appId}`;
  return  httpAuth.post(URL, httpConfig);
};
