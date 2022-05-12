/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance, axiosPublicInstance} from "@plugins/axios";
import {config} from "@plugins/config";
import store from "@store/index";

const BASE_PATH = config.global.basePaths.profile;



export const getProfile = (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/profilo`;
  return axiosInstance.get(URL, config);
};

export const getAsrTemp = async (requestConfig = {}) => {
  const URL = `${config.global.basePaths.healthPayments}/asr-temp`;
  return axiosPublicInstance.get(URL, requestConfig)
};


export const verifyTeam = (cf, team, serviceCode, httpConfig = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/verifica-team`;
  httpConfig.params = httpConfig.params || {};
  httpConfig.params.team = team;
  httpConfig.params.servizio = serviceCode;
  return axiosInstance.get(URL, httpConfig);
};

