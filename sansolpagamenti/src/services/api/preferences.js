/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance} from "@plugins/axios";
import {config} from "@plugins/config";
import {defaults} from "@services/global/utils";

export const BASE_PATH = config.global.basePaths.preferences;

export const getServices = async (config = {}) => {
  const URL = `${BASE_PATH}/services`;
  return axiosInstance.get(URL, config)
};


export const getUserContacts = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/contacts`;
  return axiosInstance.get(URL, config);
};


export const saveUserContacts = async (cf, data, config = {}) => {
  const DEFAULTS = {user_id: cf, push: {}};
  defaults(data, DEFAULTS);
  const URL = `${BASE_PATH}/users/${cf}/contacts`;
  return axiosInstance.put(URL, data, config);
};


export const getPreferences = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/preferences`;
  return axiosInstance.get(URL, config);
};


export const savePreferences = async (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/preferences`;
  return axiosInstance.put(URL, data, config);
};


export const getServicePreferences = async (cf, serviceName, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/preferences/${serviceName}`;
  return axiosInstance.get(URL, config);
};


export const saveServicePreferences = async (cf, serviceName, data, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/preferences/${serviceName}`;
  return axiosInstance.put(URL, data, config);
};


export const deleteUser = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}`;
  return axiosInstance.delete(URL);
};


export const getTerms = async (config = {}) => {
  const URL = `${BASE_PATH}/terms`;
  return axiosInstance.get(URL);
};


export const setTerms = async (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/terms`;
  return axiosInstance.put(URL, data, config);
};
