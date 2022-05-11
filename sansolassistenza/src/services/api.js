/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { httpAuth, httpPublic } from "src/boot/http";
import axios from "axios";
import {getUri} from "src/services/utils";
import {openURL} from "quasar";

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

// ASSISTENZA
// ---------------------------------------------------------------------------------------------------------------------
export const getRequests = ( cit_id, httpConfig = {}) => {
  const url = `/apisanassistenza/api/v1/cittadini/${cit_id}/richieste`;
  return httpAuth.get(url, httpConfig);
};

export const getSingleRequest = ( cit_id, richiesta_id, httpConfig = {}) => {
  const url = `/apisanassistenza/api/v1/cittadini/${cit_id}/richieste/${richiesta_id}`;
  console.log(url);
  return httpAuth.get(url, httpConfig);
};

export const postRequests = ( httpConfig = {}) => {
  const url = `/apisanassistenza/api/v1/richieste`;
  return httpPublic.post(url, httpConfig);
};

export const postRequestsAuth = ( httpConfig = {}) => {
  const url = `/apisanassistenza/api/v1/richieste`;
  return httpAuth.post(url, httpConfig);
};

export const getConfiguration = (httpConfig = {}) => {
  const url = 'apisanassistenza/api/v1/configurazione';
  return httpPublic.get(url,httpConfig);
}

export const archiveRequest = (cit_id, richiesta_id,  httpConfig = {}) => {
  const url = `/apisanassistenza/api/v1/cittadini/${cit_id}/richieste/${richiesta_id}/archiviata`;
  return httpAuth.put(url,httpConfig);
}

export const deleteRequest = (cit_id,richiesta_id,  httpConfig = {}) => {
  const url = `/apisanassistenza/api/v1/cittadini/${cit_id}/richieste/${richiesta_id}`;
  return httpAuth.delete(url,httpConfig);
}

export const changeRequest = (cit_id,richiesta_id,  httpConfig = {}) => {
  const url = `/apisanassistenza/api/v1/cittadini/${cit_id}/richieste/${richiesta_id}/messaggi`;
  return httpAuth.post(url,httpConfig);
}

export const getAsrList = (httpConfig = {}) =>{
  const url = `/lms/api/v1/lista-asl`;
  return httpPublic.get(url,httpConfig);
}

export const getAsrPayments = async (httpConfig = {}) => {
  const url = `/apisanpag/api/v1/asr-temp`
  return httpPublic.get(url,httpConfig);
}

export const getExemptionCodes = (httpConfig = {}) =>{
  const url = `/apisanesen/api/v1/codici-esenzione`;
  return httpPublic.get(url,httpConfig);
}

export const questionsList = (httpConfig = {}) => {
  const url = `cms/json/elenco-albero-degli-aiuti`;
  return httpPublic.get(url,httpConfig);
}

export const getRequestAttachment = (cit_id,richiesta_id, documento_id, httpConfig = {}) =>{
  let url =getUri({
    url: `${httpAuth.defaults.baseURL}/apisanassistenza/api/v1/cittadini/${cit_id}/richieste/${richiesta_id}/documenti/${documento_id}`,
    ...httpConfig
  });

  openURL(url);
  return url

}

// ASSISTENZA
// ---------------------------------------------------------------------------------------------------------------------

export const getCategoriesList = (httpConfig = {}) =>{
  const url = "json/tipologie.json"
  return axios.get(url, httpConfig);
}



//BFF
// ---------------------------------------------------------------------------------------------------------------------

export const sendOtp = (data, httpConfig = {}) => {
  const url = `/bff/otp`;
  return httpPublic.post(url, data, httpConfig);
};

export const verifyOtp = (httpConfig = {}) => {
  const url = `/bff/otp/verify`;
  return httpPublic.get(url, httpConfig);
};

// Permette di avere la lista delle associazioni utente-applicazione
export const getUserApplicationsList = async (taxCode,httpConfig = {}) => {
  return httpAuth.get(`/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni`, httpConfig);
};


// Permette di gestiore le diverse associazioni utente-applicazione
export const setUserApplicationInformation = async (taxCode,appId, httpConfig = {}) => {
  const URL = `/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni/${appId}`;
  return  httpAuth.post(URL, httpConfig);
};
