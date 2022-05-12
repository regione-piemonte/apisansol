/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance} from "@plugins/axios";
import {config as CONFIG} from "@plugins/config";
import {deepClone} from "@services/global/utils";

const BASE_PATH = CONFIG.global.basePaths.messages;

export const getUserMessages = (cf, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/messages`;

  let baseConfig = {
    params: {
      filter: {
        tag: {
          match: `+${CONFIG.global.unpMessageStoreTags.topic} -${CONFIG.global.unpMessageStoreTags.deleted}`
        }
      }
    }
  }

  let cfg = deepClone(config);
  if (!cfg.params) cfg.params = baseConfig.params
  if (!cfg.params.filter) cfg.params.filter = baseConfig.params.filter
  if (!cfg.params.filter.tag) cfg.params.filter.tag = baseConfig.params.filter.tag

  return axiosInstance.get(URL, cfg);
};


export const getUnseenMessages = (cf, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/messages`;

  let baseConfig = {
    params: {
      limit: 1000,
      filter: {
        tag: {
          match: `+${CONFIG.global.unpMessageStoreTags.topic} -${CONFIG.global.unpMessageStoreTags.deleted} -${CONFIG.global.unpMessageStoreTags.seen}`
        }
      },
    }
  };

  let cfg = deepClone(config)
  if (!cfg.params) cfg.params = baseConfig.params
  if (!cfg.params.limit) cfg.params.limit = baseConfig.params.limit
  if (!cfg.params.filter) cfg.params.filter = baseConfig.params.filter
  if (!cfg.params.filter.tag) cfg.params.filter.tag = baseConfig.params.filter.tag

  return axiosInstance.get(URL, cfg);
}

export const getMessage = (cf, messageId, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/messages/${messageId}`;
  return axiosInstance.get(URL, config);
};

export const updateMessagesStatus = (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/messages/status`;
  return axiosInstance.put(URL, data, config);
};

export const deleteMessage = (cf, messageId, config = {}) => {
  const URL = `${BASE_PATH}/users/${cf}/messages/${messageId}`;
  return axiosInstance.delete(URL, config);
}

