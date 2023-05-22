/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {httpAuth, httpPublic} from "src/boot/http";
import {APPLICATION_CODE} from "src/services/config";

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

export const updateEnrollmentConsent = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consenso`;
  return httpAuth.post(url, payload, httpConfig);
};

export const getCategoryList = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/decodifiche/documenti/categorie`;
  return httpAuth.get(url, httpConfig);
};

export const getTagList = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/etichette`;
  return httpAuth.get(url, httpConfig);
};
export const searchDocumentList = (taxCode, payload, httpConfig = {}) => {
  payload = {...payload, applicazione_verticale: APPLICATION_CODE};
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/_search`;
  return httpAuth.post(url, payload, httpConfig);
};

export const getDocumentDetail = (taxCode, documentId, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/dettaglio-documento`;
  return httpAuth.get(url, httpConfig);
};

export const getDocumentAssociatedList = (
  taxCode,
  documentId,
  httpConfig = {}
) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/documenti-correlati`;
  return httpAuth.get(url, httpConfig);
};

export const getEpisodeTypeList = (httpConfig = {}) => {
  const url = `/apisanfse/api/v1/decodifiche/documenti/tipi-episodio`;
  return httpAuth.get(url, httpConfig);
};


export const searchDocumentCounts = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/conteggi/_search`;
  return httpAuth.post(url, payload, httpConfig);
};

export const getDocumentPdfUrl = (taxCode, documentId, httpConfig = {}) => {
  const url = `${httpAuth.defaults.baseURL}/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/documento`;
  // const url = `${httpAuth.defaults.baseURL}/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/documento/pdf`;
  return httpAuth.getUri({url, ...httpConfig});
};


export const getDocumentPersonalAttachmentPdfUrl = (
  taxCode,
  documentId,
  httpConfig = {}
) => {
  const url = `${httpAuth.defaults.baseURL}/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/documento-personale`;
  httpConfig = httpConfig || {};
  httpConfig.params = httpConfig.params || {};
  httpConfig.params.pdf = true;
  return httpAuth.getUri({url, ...httpConfig});
};

export const getDocumentPersonalTranscription = (
  taxCode,
  documentId,
  httpConfig = {}
) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/documento-personale`;
  return httpAuth.get(url, httpConfig);
};

export const createImageBooking = (
  taxCode,
  documentId,
  payload,
  httpConfig = {}
) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/prenotazione`;
  return httpAuth.post(url, payload, httpConfig);
};

export const getDocumentFseImageInfo = (
  taxCode,
  documentId,
  httpConfig = {}
) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/stato-immagine`;
  return httpAuth.get(url, httpConfig);
};

export const getDocumentFseImageDownloadUrl = (id, httpConfig = {}) => {


  let baseUrl = process.env.APP_IS_PROD
    ? "url-prod"
    : "url";

  const url = `${baseUrl}?idPacchetto=${id}&pin=codice`;
  return httpAuth.getUri({url, ...httpConfig});
};

export const getDocumentFseImageDownloadUrl2 = (payload, httpConfig = {}) => {
  let cfAssistito = payload.cfAssistito;
  let cfRichiedente = payload.cfRichiedente;
  let idDocumentoIlec = payload.idDocumentoIlec;
  let codCL = payload.codCL;
  let archivioDocumentoIlec = payload.archivioDocumentoIlec;

  let baseUrl = process.env.APP_IS_PROD
    ? "url-prod"
    : "url";

  const url = `${baseUrl}?cfRichiedente=${cfRichiedente}&cfAssistito=${cfAssistito}&idDocumentoIlec=${idDocumentoIlec}&codCL=${codCL}&archivioDocumentoIlec=${archivioDocumentoIlec}&codApplicazione=codApplicazione&codVerticale=${APPLICATION_CODE}&codRuolo=codRuolo`;
  return httpAuth.getUri({url, ...httpConfig});
};

export const getExceptions = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/esenzioni`;
  return httpAuth.get(url, httpConfig);
};


// CONTATTO DIGITALE
// ---------------------------------------------------------------------------------------------------------------------
export const getDoctorInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisancod/api/v1/cittadini/${taxCode}/info-medico`;
  return httpAuth.get(url, httpConfig);
};

export const getConversationList = (taxCode, httpConfig = {}) => {
  const url = `/apisancod/api/v1/cittadini/${taxCode}/conversazioni`;
  return httpAuth.get(url, httpConfig);
};

export const createConversation = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisancod/api/v1/cittadini/${taxCode}/conversazioni`;
  return httpAuth.post(url, payload, httpConfig);
};

export const getMessageList = (taxCode, conversationId, httpConfig = {}) => {
  const url = `/apisancod/api/v1/cittadini/${taxCode}/conversazioni/${conversationId}/messaggi`;
  return httpAuth.get(url, httpConfig);
};

export const newMessage = (taxCode, conversationId, payload, httpConfig = {}) => {
  const url = `/apisancod/api/v1/cittadini/${taxCode}/conversazioni/${conversationId}/messaggi`;
  return httpAuth.post(url, payload, httpConfig)
};
export const editMessage = (taxCode, conversationId, messageId, payload, httpConfig = {}) => {
  const url = `/apisancod/api/v1/cittadini/${taxCode}/conversazioni/${conversationId}/messaggi/${messageId}`;
  return httpAuth.put(url, payload, httpConfig)
};

export const setMessageAsRead = (taxCode, conversationId, messageId,  httpConfig = {}) => {
  const url = `/apisancod/api/v1/cittadini/${taxCode}/conversazioni/${conversationId}/messaggi/${messageId}/letto`;
  return httpAuth.put(url, httpConfig)
};

export const getPatientEnablingInfo = (taxCode,  httpConfig = {}) => {
  const url = `/apisancod/api/v1/cittadini/${taxCode}/abilitazione`;
  return httpAuth.get(url, httpConfig)
};
