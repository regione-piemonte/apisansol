/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {equalsIgnoreCase} from "@services/global/utils";
import {isDelegationValid} from "@services/delegations/business-logic";
import {config} from "plugins/config";

const isDelegationActive = state => state.activeDelegation !== null;
const getActiveDelegation = state => state.activeDelegation;

const getActiveDelegationFullName = (state, getters) => {
  if (!getters.isDelegationActive) return '';
  let delegation = getters.getActiveDelegation;
  return `${delegation.cognome_delega} ${delegation.nome_delega}`;
};

const isActiveDelegationConsents = (state, getters) => {
  let delegation = getters.getActiveDelegation;
  if (!delegation) return false;

  return delegation.deleghe.some(d => {
    let isServiceDelegator = equalsIgnoreCase(d.codice_servizio, config.global.appServiceCodes.consents);
    let isValid = isDelegationValid(d.stato_delega);
    return isServiceDelegator && isValid;
  });
};

const isActiveDelegationFseDoc = (state, getters) => {
  let delegation = getters.getActiveDelegation;
  if (!delegation) return false;

  return delegation.deleghe.some(d => {
    let isServiceDelegator = equalsIgnoreCase(d.codice_servizio, "FSEDOC");
    let isValid = isDelegationValid(d.stato_delega);
    return isServiceDelegator && isValid;
  });
};

const isActiveDelegationFseDocStrong = (state, getters) => {
  let delegation = getters.getActiveDelegation;
  if (!delegation) return false;

  return delegation.deleghe.some(d => {
    let isServiceDelegator = equalsIgnoreCase(d.codice_servizio, "FSEDOC");
    let isValid = isDelegationValid(d.stato_delega);
    let isStrong = d.grado_delega === 'FORTE';
    return isServiceDelegator && isValid && isStrong;
  });
};

const getTaxCode = (state, getters, rootState, rootGetters) => {

  if (!getters.isDelegationActive) {
    let user = rootGetters['global/user'];
    return user ? user.cf : '';
  }

  let activeDelegation = getters.getActiveDelegation;
  return activeDelegation.codice_fiscale_delega;
};

const getActiveUserEnrollmentInfo = state => state.activeUserEnrollmentInfo;

const isActiveUserEnrollable = (state, getters) => {
  let enrollmentInfo = getters.getActiveUserEnrollmentInfo
  return enrollmentInfo && enrollmentInfo.risposta

};


export default {
  'isDelegationActive': isDelegationActive,
  'getActiveDelegation': getActiveDelegation,
  'getActiveDelegationFullName': getActiveDelegationFullName,
  'getTaxCode': getTaxCode,
  'getActiveUserEnrollmentInfo': getActiveUserEnrollmentInfo,
  'isActiveUserEnrollable': isActiveUserEnrollable,
  isActiveDelegationConsents,
  isActiveDelegationFseDoc,
  isActiveDelegationFseDocStrong
};
