/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const getConfiguration = (state) => state.configuration
export const getUserInfo = (state) => state.userInfo

export const isUserLocked = (state, getters) => {
  let info = getters.getUserInfo || {}
  return info.bloccato
}

export const getUserUnlockDate = (state, getters) => {
  let info = getters.getUserInfo || {}
  return info.data_sblocco
}

export const getNewExemptionsExpirationDate = (state, getters) => {
  let info = getters.getUserInfo || {}
  return info.scadenza
}
export const getActiveUserEnrollmentInfo = state => state.activeUserEnrollmentInfo;

export default {
  getConfiguration,
  getUserInfo,
  isUserLocked,
  getUserUnlockDate,
  getNewExemptionsExpirationDate,
  getActiveUserEnrollmentInfo
}
