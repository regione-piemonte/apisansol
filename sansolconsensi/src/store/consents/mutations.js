/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

const setActiveDelegation = (state, payload) => state.activeDelegation = payload.delegator;
const unsetActiveDelegation = (state) => state.activeDelegation = null;
const setActiveUserEnrollmentInfo = (state, payload) => state.activeUserEnrollmentInfo = payload;

export default {
  'setActiveDelegation': setActiveDelegation,
  'unsetActiveDelegation': unsetActiveDelegation,
  'setActiveUserEnrollmentInfo': setActiveUserEnrollmentInfo
};
