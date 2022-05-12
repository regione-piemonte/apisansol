/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {httpAuth, httpPublic} from "src/boot/http";
import {APP_CODE_MAP} from "src/services/config";

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

export const createTag = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/etichette`;
  return httpAuth.post(url, payload, httpConfig);
};

export const editTag = (taxCode, tagId, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/etichette/${tagId}`;
  return httpAuth.put(url, payload, httpConfig);
};

export const deleteTag = (taxCode, tagId, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/etichette/${tagId}`;
  return httpAuth.delete(url, httpConfig);
};

export const associateTag = (taxCode, documentId, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documento/${documentId}/associa-etichette`;
  return httpAuth.post(url, payload, httpConfig);
};

export const searchDocumentList = (taxCode, payload, httpConfig = {}) => {
  payload = {...payload, applicazione_verticale: APP_CODE_MAP.FSE};
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/_search`;
  return httpAuth.post(url, payload, httpConfig);
};

export const createDocumentPersonal = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/documento-personale`;
  return httpAuth.post(url, payload, httpConfig);
};

export const deleteDocumentPersonal = (
  taxCode,
  documentId,
  httpConfig = {}
) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/documento-personale`;
  return httpAuth.delete(url, httpConfig);
};

export const searchEpisodeList = (taxCode, payload, httpConfig = {}) => {
  payload = {...payload, applicazione_verticale: APP_CODE_MAP.FSE};
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/episodi/_search`;
  return httpAuth.post(url, payload, httpConfig);
};

export const getEpisodeDocumentList = (taxCode, episodeId, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/episodi/${episodeId}/documenti-episodio`;
  return httpAuth.get(url, httpConfig);
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

export const getDocumentHiddenList = (taxCode, documentId, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/${documentId}/documenti-oscurati`;
  return httpAuth.get(url, httpConfig);
};

export const updateDocumentVisibility = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/oscuramento`;
  return httpAuth.put(url, payload, httpConfig);
};

export const getEpisodeTypeList = (httpConfig = {}) => {
  const url = `/apisanfse/api/v1/decodifiche/documenti/tipi-episodio`;
  return httpAuth.get(url, httpConfig);
};

export const setRolAsWithdrawn = (taxCode, rolId, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/documenti/${rolId}/registra-ritiro`;
  return httpAuth.post(url, payload, httpConfig);
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

export const getDocumentRolOldPdfUrl = (taxCode, httpConfig = {}) => {
  const url = `${httpAuth.defaults.baseURL}/apisanfse/api/v1/cittadini/${taxCode}/referti/pdf`;
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

export const getFseMessageList = (httpConfig = {}) => {
  const url = `/apisanfse/api/v1/messaggi-servizio`;
  return httpAuth.get(url, httpConfig);
};

export const getAccessList = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/accessi`;
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
    ? "url"
    : "url";

  const url = `${baseUrl}?idPacchetto=${id}&pin=12345`;
  return httpAuth.getUri({url, ...httpConfig});
};

export const getDocumentFseImageDownloadUrl2 = (payload, httpConfig = {}) => {
  let cfAssistito = payload.cfAssistito;
  let cfRichiedente = payload.cfRichiedente;
  let idDocumentoIlec = payload.idDocumentoIlec;
  let codCL = payload.codCL;
  let archivioDocumentoIlec = payload.archivioDocumentoIlec;

  let baseUrl = process.env.APP_IS_PROD
    ? "url"
    : "url";

  const url = `${baseUrl}?cfRichiedente=${cfRichiedente}&cfAssistito=${cfAssistito}&idDocumentoIlec=${idDocumentoIlec}&codCL=${codCL}&archivioDocumentoIlec=${archivioDocumentoIlec}&codApplicazione=SANSOL&codVerticale=FSEDOC&codRuolo=CIT`;
  return httpAuth.getUri({url, ...httpConfig});
};

export const createAudit = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/audit`;
  payload = payload || {codice_verticale: "FSEDOC"};
  return httpAuth.post(url, payload, httpConfig);
};

export const getExceptions = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/esenzioni`;
  return httpAuth.get(url, httpConfig);
};


