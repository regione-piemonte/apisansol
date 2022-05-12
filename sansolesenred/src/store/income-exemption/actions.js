/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const setConfiguration = (context, {configuration}) => {
  context.commit('setConfiguration', {configuration})
}

export const setUserInfo = (context, {cf, info}) => {
  context.commit('setUserInfo', {cf, info})
}
export const setActiveUserEnrollmentInfo = (context, {activeUserEnrollmentInfo}) => {
  context.commit('setActiveUserEnrollmentInfo', {activeUserEnrollmentInfo})
};

export default {
  setConfiguration,
  setUserInfo,
  setActiveUserEnrollmentInfo
}
