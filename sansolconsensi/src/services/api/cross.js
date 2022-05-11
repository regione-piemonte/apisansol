/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosPublicInstance} from "@plugins/axios";
import {config} from "@plugins/config";

const BASE_PATH = config.global.basePaths.apiCross;

export const getServices = (config = {}) => {
  const URL = `${BASE_PATH}/servizi`;
  return axiosPublicInstance.get(URL, config);
};

export const getCountries = (config = {}) => {
  const URL = `${BASE_PATH}/nazioni`;
  return axiosPublicInstance.get(URL, config);
};

export const getCities = (config = {}) => {
  const URL = `${BASE_PATH}/comuni`;
  return axiosPublicInstance.get(URL, config);
};

export const getRegions = (config = {}) => {
  const URL = `${BASE_PATH}/regioni`;
  return axiosPublicInstance.get(URL, config);
};


// Permette di avere la lista suggest indirizzi
export const getSuggestedAddress = async (config = {}) => {
  const URL = `${BASE_PATH}/indirizzi/_search`;
  return  axiosPublicInstance.get(URL, config);
};




