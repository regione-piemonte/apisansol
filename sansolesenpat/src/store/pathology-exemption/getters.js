/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

const isDelegationActive = state => state.activeDelegation !== null;
const getActiveDelegation = state => state.activeDelegation;

const getActiveDelegationFullName = (state, getters) => {
  if (!getters.isDelegationActive) return '';
  let delegation = getters.getActiveDelegation;
  return `${delegation.cognome_delega} ${delegation.nome_delega}`;
};

const getTaxCode = (state, getters, rootState, rootGetters) => {

  if (!getters.isDelegationActive) {
    let user = rootGetters['global/user'];
    return user ? user.cf : '';
  }

  let activeDelegation = getters.getActiveDelegation;
  return activeDelegation.codice_fiscale_delega;
};



export default {
  'isDelegationActive': isDelegationActive,
  'getActiveDelegation': getActiveDelegation,
  'getActiveDelegationFullName': getActiveDelegationFullName,
  'getTaxCode': getTaxCode,
};
