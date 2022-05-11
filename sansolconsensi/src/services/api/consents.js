/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance, axiosPublicInstance} from "@plugins/axios";
import {config} from "@plugins/config";
import {getUri} from "@services/global/utils";
import {openUrl} from "@services/global/utils";

const BASE_PATH = config.global.basePaths.consents;



// CHIAMATE PUBBLICHE
// ---------------------------------------------------------------------------------------------------------------------
export const getAsr = async (config = {}) => {
    const URL = `${BASE_PATH}/asr`;
    return axiosInstance.get(URL, config);
  };

export const createConsent = async (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadino/${cf}/consensi`;
  return axiosInstance.post(URL, data, config);
};

export const getConsent = async (cf, id_informativa, id_asl, config = {}) => {
  const URL = `${BASE_PATH}/cittadino/${cf}/consensi/${id_informativa}/asl/${id_asl}`;
  return axiosInstance.get(URL, config);
};


  export const getConsentsStatesList = async (config = {}) => {
    const URL = `${BASE_PATH}/stati-consenso`;
    return axiosInstance.get(URL, config);
  };

  export const getConsentsValidationTypeList = async (config = {}) => {
    const URL = `${BASE_PATH}/tipologie-validita`;
    return axiosInstance.get(URL, config);
  };

   export const getConsentsTypeList = async (config = {}) => {
    const URL = `${BASE_PATH}/tipologie`;
    return axiosInstance.get(URL, config);
  };


     export const editConsent = async (cf, id_informativa, id_asl, data, config = {}) => {
    const URL = `${BASE_PATH}/cittadino/${cf}/consensi/${id_informativa}/asl/${id_asl}`;
    return axiosInstance.put(URL, data, config);
  };

   export const getInformativaPdf = async (type, sub_type, config = {}) => {
     let url = `${BASE_PATH}/informative/informativa-pdf`;
     let uri = `${axiosInstance.defaults.baseURL}${url}`;

     let defaultFilter = {
       codice_tipo_consenso: {eq: type},
       codice_sotto_tipo_consenso: {eq: sub_type},
       //data_compilazione: {gte: monthAgo, lte: today},
     }

     if (!config.params) config.params = {}
     if (!config.params.filter) config.filter = {}
     config.params.filter = {...config.params.filter, ...defaultFilter}

  let cfg = {url: uri, ...config};
  uri = getUri(cfg);
  //window.open(uri);

  openUrl(uri);
  return uri

  };

export const getHTMLInformativa = async (type, sub_type, config = {}) => {
  const URL = `${BASE_PATH}/informative/informativa-html`;

  let defaultFilter = {
    codice_tipo_consenso: {eq: type},
    codice_sotto_tipo_consenso: {eq: sub_type},
    //data_compilazione: {gte: monthAgo, lte: today},
  }

  if (!config.params) config.params = {}
  if (!config.params.filter) config.filter = {}
  config.params.filter = {...config.params.filter, ...defaultFilter}

  return axiosInstance.get(URL, config);
};


export const getConsensiInformativeList = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadino/${cf}/consensi-informative`;
  return axiosInstance.get(URL, config);
};




