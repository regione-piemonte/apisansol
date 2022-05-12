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

export const getEnrollmentConsent = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consenso`;
  return httpAuth.get(url, httpConfig);
};

export const createAudit = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/audit`;
  payload = payload || { codice_verticale: "FSETAC" };
  return httpAuth.post(url, payload, httpConfig);
};

export const getLastFsePolicyUrl = (taxCode, httpConfig = {}) => {
  let url = `${httpAuth.defaults.baseURL}/apisanfse/api/v1/cittadini/${taxCode}/informativa-ultima/pdf`;
  return httpAuth.getUri({ url, ...httpConfig });
};

export const saveDoNotAskMeAgain2 = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consultazione-preferenze`;
  return httpAuth.put(url, httpConfig);
};

// TACCUINO
// ---------------------------------------------------------------------------------------------------------------------
export const getDetectionModeList = (httpConfig = {}) => {
  const url = `/apisantacc/api/v1/decodifiche/modalita-rilevazione`;
  return httpAuth.get(url, httpConfig);
};

export const getPainIntensityList = (httpConfig = {}) => {
  const url = `/apisantacc/api/v1/decodifiche/intensita-dolore`;
  return httpAuth.get(url, httpConfig);
};

export const getStructureTypeList = (httpConfig = {}) => {
  const url = `/apisantacc/api/v1/decodifiche/struttura-tipi`;
  return httpAuth.get(url, httpConfig);
};

export const getContactTypeList = (httpConfig = {}) => {
  const url = `/apisantacc/api/v1/decodifiche/contatto-tipi`;
  return httpAuth.get(url, httpConfig);
};

export const getMeasureUnitConfiguration = (httpConfig = {}) => {
  const url = `/apisantacc/api/v1/decodifiche/descrittori-misurazione`;
  return httpAuth.get(url, httpConfig);
};

export const getNotebookDetail = (taxCode, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuino`;
  return httpAuth.get(url, httpConfig);
};

export const updateNotebookVisibility = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/oscurato`;
  return httpAuth.put(url, payload, httpConfig);
};

export const updateGeneralNotes = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/note-generali`;
  return httpAuth.put(url, payload, httpConfig);
};

export const updatePreferenceList = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/preferenze`;
  return httpAuth.put(url, payload, httpConfig);
};

// RILEVAZIONI
// ---------------------------------------------------------------------------------------------------------------------
export const getDetectionList = (taxCode, notebookId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuino/${notebookId}/rilevazioni`;
  return httpAuth.get(url, httpConfig);
};

export const createDetection = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuino/${notebookId}/rilevazioni`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteBulkDetection = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuino/${notebookId}/rilevazioni/_bulk_delete`;
  return httpAuth.post(url, payload, httpConfig);
};

// DOLORI
// ---------------------------------------------------------------------------------------------------------------------
export const getPainList = (taxCode, notebookId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/dolori`;
  return httpAuth.get(url, httpConfig);
};

export const createPain = (taxCode, notebookId, payload, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/dolori`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteBulkPain = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/dolori/_bulk_delete`;
  return httpAuth.post(url, payload, httpConfig);
};

// SINTOMI
// ---------------------------------------------------------------------------------------------------------------------
export const getSymptomList = (taxCode, notebookId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/sintomi`;
  return httpAuth.get(url, httpConfig);
};

export const createSymptom = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/sintomi`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteBulkSymptom = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuino/${notebookId}/sintomi/_bulk_delete`;
  return httpAuth.post(url, payload, httpConfig);
};

// EVENTI
// ---------------------------------------------------------------------------------------------------------------------
export const getEventList = (taxCode, notebookId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/eventi`;
  return httpAuth.get(url, httpConfig);
};

export const createEvent = (taxCode, notebookId, payload, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/eventi`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteEvent = (taxCode, notebookId, eventId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/eventi/${eventId}`;
  return httpAuth.delete(url, httpConfig);
};

// FARMACI
// ---------------------------------------------------------------------------------------------------------------------
export const getDrugList = (taxCode, notebookId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/farmaci`;
  return httpAuth.get(url, httpConfig);
};

export const createDrug = (taxCode, notebookId, payload, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/farmaci`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteDrug = (taxCode, notebookId, drugId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/farmaci/${drugId}`;
  return httpAuth.delete(url, httpConfig);
};

// CONTATTI CON STRUTTURE
// ---------------------------------------------------------------------------------------------------------------------
export const getStructureContactList = (
  taxCode,
  notebookId,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/contatti-strutture`;
  return httpAuth.get(url, httpConfig);
};

export const createStructureContact = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/contatti-strutture`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteBulkStructureContact = (
  taxCode,
  notebookId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuino/${notebookId}/contatti-strutture/_bulk_delete`;
  return httpAuth.post(url, payload, httpConfig);
};

// DIETA
// ---------------------------------------------------------------------------------------------------------------------
export const getDietList = (taxCode, notebookId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/diete`;
  return httpAuth.get(url, httpConfig);
};

export const createDiet = (taxCode, notebookId, payload, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/diete`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteDiet = (taxCode, notebookId, dietId, httpConfig = {}) => {
  const url = `/apisantacc/api/v1/cittadini/${taxCode}/taccuini/${notebookId}/diete/${dietId}`;
  return httpAuth.delete(url, httpConfig);
};
