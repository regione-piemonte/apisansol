/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { httpAuth, httpPublic } from "src/boot/http";
import { REPORT_IMAGE_DOWNLOAD_URL } from "src/services/config";
import { openURL } from "quasar";

export const getUser = (httpConfig = {}) => {
  return httpAuth.get("/bff/identity", httpConfig);
};

export const getConfig = (httpConfig = {}) => {
  return httpPublic.get("/lms/api/v1/configurazione", httpConfig);
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

// ROL
// ---------------------------------------------------------------------------------------------------------------------
export const getReportList = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/referti`;
  return httpAuth.get(url, httpConfig);
};

export const getReportDetail = (taxCode, id, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/referti/${id}`;
  return httpAuth.get(url, httpConfig);
};

export const requestReportImage = (taxCode, id, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/referti/${id}/prenotazione`;
  return httpAuth.post(url, payload, httpConfig);
};

export const downloadPdf = (taxCode, id, httpConfig = {}) => {
  let url = httpAuth.getUri({
    url: `${httpAuth.defaults.baseURL}/apisanfse/api/v1/cittadini/${taxCode}/referti/${id}/pdf`,
    ...httpConfig
  });

  openURL(url);
};

export const downloadReportImage = async (taxCode, id, zipId, pin = 12345) => {
  let url = httpAuth.getUri({
    url: `${REPORT_IMAGE_DOWNLOAD_URL}?idPacchetto=${zipId}&pin=${pin}`,
    params: { idPacchetto: zipId, pin: pin }
  });

  openURL(url);
};


