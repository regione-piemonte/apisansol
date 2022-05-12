/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

const setActiveDelegation = (state, payload) => state.activeDelegation = payload.delegator;
const unsetActiveDelegation = (state) => state.activeDelegation = null;

export default {
  setActiveDelegation,
  unsetActiveDelegation,
}
