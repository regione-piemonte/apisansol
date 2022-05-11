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

export const sendOtp = (payload, httpConfig = {}) => {
  const url = `/bff/otp`;
  return httpAuth.post(url, payload, httpConfig);
};

export const verifyOtp = (httpConfig = {}) => {
  const url = `/bff/otp/verify`;
  return httpAuth.get(url, httpConfig);
};

export const getOtpSmsAttemptsLeft = (httpConfig = {}) => {
  const url = `/bff/otp/channels/sms/attempts-left`;
  return httpAuth.get(url, httpConfig);
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

// NOTIFICATORE
// ---------------------------------------------------------------------------------------------------------------------
export const getNotifyMessages = (taxCode, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-lms`;
  return httpAuth.get(url, httpConfig);
};

export const getNotifyMessage = (taxCode, id, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages/${id}`;
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

export const updateNotifyMessageStatus = (
  taxCode,
  payload,
  httpConfig = {}
) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages/status`;
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

export const deleteNotifyUser = (taxCode, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}`;
  return httpAuth.delete(url, httpConfig);
};

export const getNotifyPreferences = (taxCode, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/preferences`;
  return httpAuth.get(url, httpConfig);
};

export const updateNotifyPreferences = (taxCode, payload, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/preferences`;
  return httpAuth.put(url, payload, httpConfig);
};

export const getNotifyTerms = async (httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/terms`;
  return httpAuth.get(url, httpConfig);
};

export const updateNotifyTerms = async (taxCode, payload, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/terms`;
  return httpAuth.put(url, payload, httpConfig);
};

export const getNotifyServices = (httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/services`;
  httpConfig.params = httpConfig.params || {};
  httpConfig.params.filter = httpConfig.params.filter || {};
  httpConfig.params.filter.tags = httpConfig.params.filter.tags || {};
  httpConfig.params.filter.tags = {
    match: "sanita",
    ...httpConfig.params.filter.tags
  };
  return httpAuth.get(url, httpConfig);
};



// FSE
// ---------------------------------------------------------------------------------------------------------------------
export const getEnrollmentInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/arruolamento`;
  return httpAuth.get(url, httpConfig);
};

// PTW
// ---------------------------------------------------------------------------------------------------------------------
export const getAsrTempList = (httpConfig = {}) => {
  const url = `/apisanpag/api/v1/asr-temp`;
  return httpAuth.get(url, httpConfig);
};


//ACCESSI
// ---------------------------------------------------------------------------------------------------------------------
export const getAccessOperationTypeList = (httpConfig = {}) => {
  const url = `/apisanfse/api/v1/decodifiche-accessi`;
  return httpAuth.get(url, httpConfig);
};

export const getAccessList = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/accessi`;
  return httpAuth.get(url, httpConfig);
};

export const getFseAccessServiceDecodeList = (httpConfig = {}) => {
  const url = `/lms-fse/api/v1/decodifiche/accessi`;
  return httpPublic.get(url, httpConfig);
};

export const createAudit = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/audit`;
  payload = payload || {codice_verticale: "PROMEM"};
  return httpAuth.post(url, payload, httpConfig);
};
