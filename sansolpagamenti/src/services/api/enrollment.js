/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance, axiosPublicInstance} from "@plugins/axios";
import {config} from "@plugins/config";
import store from "@store";
import {getUri, openUrl} from "../global/utils";
// Permette di ottenere la giusta istanza axios in base allo stato della login
// Cioè se l'utente è loggato allora tutte le sue chiamate passano per l'istanza autenticata
// altrimenti passano per l'istanza anonima
const getAxiosInstance = () => {
  return store.getters['global/isUserLogged'] ? axiosInstance : axiosPublicInstance
};



const BASE_PATH = config.global.basePaths.enrollment;
const FSE_PRESCRIPTIONS_CODE = config.enrollment.serviceCodes.prescriptions

export const getArruolabilita = (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/arruolamento`;
  return axiosInstance.get(URL, config);
};

export const getLastPolicyVersion = (cf, httpConfig = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/informativa-ultima`;
  return axiosInstance.get(URL, httpConfig);
};

export const saveDoNotAskMeAgain = (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/arruolamento`;
  return axiosInstance.put(URL, config);
};

export const saveDoNotAskMeAgain2 = (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/consultazione-preferenze`;
  return axiosInstance.put(URL, config);
};

export const getConsenso = (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/consenso`;
  return axiosInstance.get(URL, config);
};

export const saveConsenso = (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/consenso`;
  return axiosInstance.post(URL, data, config);
};

export const setVisibility = (cf, data, config = {}) => {
  const url = `${BASE_PATH}/cittadini/${cf}/oscuramento`;
  return axiosInstance.put(url, data, config);
};

export const getExceptions = (cf,  config = {}) => {
  const url = `${BASE_PATH}/cittadini/${cf}/esenzioni`;
  return axiosInstance.get(url, config);
};

export const searchDocumentList = (taxCode, payload, config = {}) => {
  payload = { ...payload, applicazione_verticale: FSE_PRESCRIPTIONS_CODE };
  const url = `${BASE_PATH}/cittadini/${taxCode}/documenti/_search`;
  return axiosInstance.post(url, payload, config);
};


export const getLastPolicyVersionPdf = (cf, httpConfig = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/informativa-ultima/pdf`;
  return axiosInstance.get(URL, httpConfig);
};

export const getLastPolicyVersionPdfUrl = (taxCode, httpConfig = {}) => {
  let axios = getAxiosInstance();
  const url = `${BASE_PATH}/cittadini/${taxCode}/informativa-ultima/pdf`;
  let uri = `${axios.defaults.baseURL}${url}`;
  let cfg = {url: uri, ...httpConfig};
  uri = getUri(cfg);
  return uri;
};


export const getDocumentPdfUrl = (taxCode, documentId, config = {}, ajax = false) => {
  let axios = getAxiosInstance();
  const url = `${BASE_PATH}/cittadini/${taxCode}/documenti/${documentId}/documento`;
  let uri = `${axios.defaults.baseURL}${url}`;
  if (ajax) {
    return axios.get(url, config)
  }

  let cfg = {url: uri, ...config};
  uri = getUri(cfg);

  openUrl(uri);
  return uri


};


