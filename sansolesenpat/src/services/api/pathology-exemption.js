/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { axiosInstance } from "@plugins/axios";
import { config } from "@plugins/config";
import { getUri, isEmpty } from "@services/global/utils";
import { openUrl } from "@services/global/utils";

const BASE_PATH = config.global.basePaths.pathologyExemption;

// ---------------------------------------------------------------------------------------------------------------------
export const getDisclaimerDati = async (config = {}) => {
  const URL = `${BASE_PATH}/disclaimer-trattamento-dati`;
  return axiosInstance.get(URL, config);
};

export const getDisclaimerMalattieRare = async (config = {}) => {
  const URL = `${BASE_PATH}/disclaimer-iscrizione-malattie-rare`;
  return axiosInstance.get(URL, config);
};

export const getExemptionTypes = async (config = {}) => {
  const URL = `${BASE_PATH}/tipologie-esenzione`;
  return axiosInstance.get(URL, config);
};

export const getTipologiaDocumenti = async (typeCode, config = {}) => {
  const URL = `${BASE_PATH}/tipologie-esenzione/${typeCode}/tipologie-documento`;
  return axiosInstance.get(URL, config);
};

export const getExemptionTypeDiseases = async (cf, typeCode, config = {}) => {
  const URL = `${BASE_PATH}/tipologie-esenzione/${typeCode}/malattie`;
  return axiosInstance.get(URL, config);
};

export const getExemptions = async (cf, typeCode, config = {}) => {
  const URL = `${BASE_PATH}/tipologie-esenzione/${typeCode}/esenzioni`;
  return axiosInstance.get(URL, config);
};

export const getDisabilityType = async (config = {}) => {
  const URL = `${BASE_PATH}/tipologie-invalidita`;
  return axiosInstance.get(URL, config);
};

export const getStatusList = async (config = {}) => {
  const URL = `${BASE_PATH}/stati-esenzione`;
  return axiosInstance.get(URL, config);
};

// ---------------------------------------------------------------------------------------------------------------------
export const getExemptionListActive = async (cf, config = {}) => {
  let defaultFilter = {
    archiviata: { eq: false }
  };

  if (!config.params) config.params = {};
  if (!config.params.filter) config.filter = {};

  config.params.filter = { ...defaultFilter, ...config.params.filter };

  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni`;
  return axiosInstance.get(URL, config);
};

export const getExemptionListArchived = async (cf, config = {}) => {
  let defaultFilter = {
    archiviata: { eq: true }
  };

  if (!config.params) config.params = {};
  if (!config.params.filter) config.filter = {};

  config.params.filter = { ...defaultFilter, ...config.params.filter };

  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni`;
  return axiosInstance.get(URL, config);
};

export const getExemptionDetail = async (cf, id, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${id}`;
  return axiosInstance.get(URL, config);
};

export const getExemptionDetailHistory = async (cf, id, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${id}/storico`;
  return axiosInstance.get(URL, config);
};

export const createExemption = async (cf, payload, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni`;
  return axiosInstance.post(URL, payload, config);
};

export const getCertificateList = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/certificati`;
  return axiosInstance.get(URL, config);
};

export const getCertificateDetail = async (cf, id, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/certificati/${id}`;
  return axiosInstance.get(URL, config);
};

export const getExemptionRevokeMotivations = async (
  cf,
  esenzione_id,
  config = {}
) => {
  //const URL = `${BASE_PATH}/motivazioni/revoca`
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${esenzione_id}/revoca/motivazioni`;
  return axiosInstance.get(URL, config);
};

export const revokeExemption = async (cf, id, payload, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${id}/revoca`;
  return axiosInstance.put(URL, payload, config);
};

export const getExemptionCancelMotivations = async (
  cf,
  esenzione_id,
  config = {}
) => {
  //const URL = `${BASE_PATH}/motivazioni/annullamento`
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${esenzione_id}/annullamento/motivazioni`;
  return axiosInstance.get(URL, config);
};

export const cancelExemption = async (cf, id, payload, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${id}/annullamento`;
  return axiosInstance.put(URL, payload, config);
};

export const renewExemption = async (cf, id, payload, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${id}/rinnovo`;
  return axiosInstance.put(URL, payload, config);
};

export const getAttestatiPdf = async (cf, config = {}) => {
  let axios = axiosInstance;
  const url = `${BASE_PATH}/cittadini/${cf}/esenzioni/pdf`;
  let uri = `${axios.defaults.baseURL}${url}`;
  let cfg = { url: uri, ...config };
  uri = getUri(cfg);
  openUrl(uri);
  return uri;
};

export const getAttestatoPdf = async (cf, id, config) => {


  let axios = axiosInstance;
  let url = `${BASE_PATH}/cittadini/${cf}/esenzioni/${id}/pdf`;
  let uri = `${axios.defaults.baseURL}${url}`;
  let cfg = { url: uri, ...config };
  uri = getUri(cfg);
  openUrl(uri);
  return uri;
};

export const getAllegatiZip = async (cf, id, config = {}) => {
  let axios = axiosInstance;
  const url = `${BASE_PATH}/cittadini/${cf}/esenzioni/${id}/zip`;
  let uri = `${axios.defaults.baseURL}${url}`;
  let cfg = { url: uri, ...config };
  uri = getUri(cfg);
  openUrl(uri);
  return uri;
};

export const getCertificatoPdf = (cf, id, config = {}) => {
  let axios = axiosInstance;
  let url = `${BASE_PATH}/cittadini/${cf}/certificati/${id}/pdf`;

  let uri = `${axios.defaults.baseURL}${url}`;

  let cfg = { url: uri, ...config };
  uri = getUri(cfg);
  openUrl(uri);
  return uri;
};

export const editExemption = async (cf, id, payload, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${id}/rettifica`;
  return axiosInstance.put(URL, payload, config);
};

//ESENZIONI DA AURA
export const getAuraExemptionsArchived = async (cf, config = {}) => {
  let defaultFilter = {
    archiviata: { eq: true }
  };
  if (!config.params) config.params = {};
  if (!config.params.filter) config.filter = {};

  config.params.filter = { ...defaultFilter, ...config.params.filter };
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni-aura`;
  return axiosInstance.get(URL, config);
};

export const getAuraExemptionsActive = async (cf, config = {}) => {
  let defaultFilter = {
    archiviata: { eq: false }
  };
  if (!config.params) config.params = {};
  if (!config.params.filter) config.filter = {};

  config.params.filter = { ...defaultFilter, ...config.params.filter };
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni-aura`;
  return axiosInstance.get(URL, config);
};

export const getAuraExemptionDetail = async (cf, codExemption, codPathology, config = {}) => {
  console.log(config);

  let filter = {
    params: {
      filter: config
    }
  };
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni-aura/${codExemption}/${codPathology}`;
  return axiosInstance.get(URL, filter);
};


export const revokeAuraExemption = async (cf, codExemption, codPathology, config = {}) => {
  console.log(config)
  if (!config.params) config.params = {};
  if (!config.params.filter) config.filter = {};
  config.params.filter = {  ...config.params.filter }

  console.log(config)
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni-aura/${codExemption}/${codPathology}/revoca`;
  return axiosInstance.put(URL,null, config);
};
