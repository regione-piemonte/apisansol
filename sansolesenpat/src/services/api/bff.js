/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance} from "@plugins/axios";
import {axiosPublicInstance} from "@plugins/axios";
import {config} from "@plugins/config";

const BASE_PATH = config.global.basePaths.bff;

export const getIdentity = (config = {}) => {
  const URL = `${BASE_PATH}/identity`;
  return axiosInstance.get(URL, config);
};

export const getOtpSmsAttemptsLeft = (config = {}) => {
  const URL = `${BASE_PATH}/otp/channels/sms/attempts-left`;
  return axiosInstance.get(URL, config);
};

export const sendOtp = (data, config = {}) => {
  const URL = `${BASE_PATH}/otp`;
  return axiosInstance.post(URL, data, config);
};

export const verifyOtp = (config = {}) => {
  const URL = `${BASE_PATH}/otp/verify`;
  return axiosInstance.get(URL, config);
};

export const getConfiguration = (nameConfiguration,config = {}) => {
  const URL = `${BASE_PATH}/apps/${nameConfiguration}`;
  return axiosPublicInstance.get(URL, config);
};

export const getMessageList = (httpConfig = {}) => {
  const URL = `/lms-cms/api/v1/cms/json/messaggi`;
  return axiosPublicInstance.get(URL, httpConfig);
};

export const getAppList = (httpConfig = {}) => {
  const URL = `/lms/api/v1/applicazioni`;
  return axiosPublicInstance.get(URL, httpConfig);
};

export const getFseAccessServiceDecodeList = (httpConfig = {}) => {
  const URL = `/lms-fse/api/v1/decodifiche/accessi`;
  return axiosPublicInstance.get(URL, httpConfig);
};


// Permette di avere la lista delle associazioni utente-applicazione
export const getUserApplicationsList = async (taxCode,config = {}) => {
  const URL = `/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni`;
  return  axiosInstance.get(URL, config);
};


// Permette di gestiore le diverse associazioni utente-applicazione
export const setUserApplicationInformation = async (taxCode,appId, config = {}) => {
  const URL = `/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni/${appId}`;
  return  axiosInstance.post(URL, config);
};
