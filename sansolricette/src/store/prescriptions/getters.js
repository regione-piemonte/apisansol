/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import config from "@configs"

const isDelegationActive = state => state.activeDelegation !== null;
const getActiveDelegation = state => state.activeDelegation;

const getActiveDelegationFullName = (state, getters) => {
  if (!getters.isDelegationActive) return '';
  let delegation = getters.getActiveDelegation;
  return `${delegation.cognome_delega} ${delegation.nome_delega}`;
};

const getActiveDelegationPrescriptions = (state, getters) => {
  if (!getters.isDelegationActive) return null;
  let delegationList = state.activeDelegation.deleghe || [];
  return delegationList.find(d => d.codice_servizio === config.global.appServiceCodes.prescriptions);
};

const isActiveDelegationWeak = (state, getters) => {
  let delegation = getters.getActiveDelegationPrescriptions;
  if (!delegation) return false;
  return delegation.grado_delega === 'DEBOLE';
};

const getTaxCode = (state, getters, rootState, rootGetters) => {

  if (!getters.isDelegationActive) {
    let user = rootGetters['global/user'];
    return user ? user.cf : '';
  }

  let activeDelegation = getters.getActiveDelegation;
  return activeDelegation.codice_fiscale_delega;
};

const getActiveEnrollment = state => state.activeEnrollment;

// Permette di sapere se l'utente è arruolato
export const isActiveUserEnlisted = (state, getters) => {
  if (!state.activeEnrollment) return false

  if (state.activeEnrollment.codice_risposta === '003')
    return true
  else
    return false
}


export default {
  isDelegationActive,
  getActiveDelegation,
  getActiveDelegationFullName,
  getActiveDelegationPrescriptions,
  isActiveDelegationWeak,
  getTaxCode,
  getActiveEnrollment,
  isActiveUserEnlisted
}
