/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const setConfiguration = (state, {configuration}) => {
  state.configuration = configuration
};

export const setUserInfo = (state, {cf, info}) => {
  state.userInfo = info
};
export const setActiveUserEnrollmentInfo = (state, {activeUserEnrollmentInfo}) => {
  state.activeUserEnrollmentInfo = activeUserEnrollmentInfo
};


export default {
  setConfiguration,
  setUserInfo,
  setActiveUserEnrollmentInfo
}
