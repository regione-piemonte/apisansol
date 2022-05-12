/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {equalsIgnoreCase, getUserMinor, isNil} from '@services/global/utils'
import {config} from '@plugins/config'
import {isMinor} from '@services/global/business-logic'

export const user = state => {
  return {
    ...state.userIdentity,
    profile: state.userProfile,
    contacts: state.userContacts,
    enrollment: state.enrollmentInfo,
  }
}

export const isUserLogged = (state, getters) => !isNil(state.userIdentity)

// L'utente può essere considerato piemontese se è loggato e se la chiamata verso AURA non è fallita
export const isPiedmontUser = (state, getters) => {
  return !!(getters.isUserLogged && state.userProfile)
  // && state.userProfile.info_anag.dati_primari.cod_cittadinanza === '100'
}


// Restituisce l'array contenente tutti i servizi dell'app
export const appServices = (state, getters) => {
  return state.appServices
}

// Permette di ottenere un servizio salvato nello store a partire da un codice
export const appService = (state, getters) => (serviceCode) => {
  if (!state.appServices) return undefined
  return state.appServices.find(s => equalsIgnoreCase(s.codice_servizio, serviceCode))
}


// Permette di ottenere solo quei servizi considerati "delegabili"
export const delegableAppServices = (state, getters) => {
  if (!state.appServices) return []
  return state.appServices.filter(s => s.delegabile)
}

// Permette di sapere se l'utente è arruolato
export const isEnlisted = (state, getters) => {
  if (!state.enrollmentInfo) return false

  if (state.enrollmentInfo.codice_risposta === '003')
    return true
  else
    return false
}


export const userContacts = (state) => state.userContacts
export const hasUserContacts = (state, getters) => !!getters.userContacts
export const fcmToken = (state) => state.fcmToken
export const hasFcmToken = (state, getters) => !!getters.fcmToken
export const appConfig = (state, getters) => state.appConfig
// export const isUserMinor = (state, getters) => {
//   // Se l'utente non è piemontese non abbiamo modo di capire se si tratta di un minore
//   // => assumiamo che si tratti di un adulto (casistica più probabile)
//   if (!getters.isPiedmontUser) return false
//   let profile = getters.user.profile
//   return profile && profile.info_anag && profile.info_anag.dati_primari && isMinor(profile.info_anag.dati_primari.data_nascita)
// }


export const isUserMinorByTaxCode = (state, getters) => {
  let taxCode = getters.user && getters.user.cf;
  if (!taxCode) return false;
  return getUserMinor(taxCode);
};

export const isUserMinor = (state, getters) => {
  let userInfo = getters.user && getters.user.profile;
  let isUserMinorByTaxCode = getters.isUserMinorByTaxCode;

  // Se non abbiamo i dati di AURA => ci basiamo solo sul codice fiscale
  if (!userInfo) return isUserMinorByTaxCode;

  let birthDate = userInfo && userInfo.info_anag && userInfo.info_anag.dati_primari && userInfo.info_anag.dati_primari.data_nascita || null;

  // Se AURA non ci forinisce la data di nascita => ci basiamo solo sul codice fiscale
  if (!birthDate) return isUserMinorByTaxCode;

  return isMinor(birthDate);
};


// Esempi:
// compareVersion("0.20.7", "0.20.8");  // -1
// compareVersion("0.20.9", "0.20.8");  // 1
// compareVersion("0.20.08", "0.20.8");  // 0
// compareVersion("0.20.08", "0.20.8.1"); // -1
// compareVersion("0.20.8.1", "0.20.8");  // 1
// compareVersion("0.020", "0.20");  // 0
// compareVersion(0.1, 0.2);  // false
// compareVersion("0", "0");  // 0
// compareVersion("0.1", true);  // false
//
// Se v1 > v2 => 1
// Se v1 == v2 => 0
// Se v1 < v2 => -1
const compareVersion = (v1, v2) => {

  if (typeof v1 !== 'string') return false
  if (typeof v2 !== 'string') return false

  v1 = v1.split('.')
  v2 = v2.split('.')

  const k = Math.min(v1.length, v2.length)

  for (let i = 0; i < k; ++i) {
    v1[i] = parseInt(v1[i], 10)
    v2[i] = parseInt(v2[i], 10)
    if (v1[i] > v2[i]) return 1
    if (v1[i] < v2[i]) return -1
  }

  return v1.length == v2.length ? 0 : (v1.length < v2.length ? -1 : 1)
}


export const isAppUpdateMandatory = (state, getters) => {

  let appConfig = getters.appConfig
  if (!appConfig) return false

  let actualVersion = config.global.version
  let lastSupportedVersion = appConfig.ultima_versione_supportata

  return compareVersion(actualVersion, lastSupportedVersion) === -1
}


export const getMessageList = (state) => {
  return state.messageList || []
};

export const getAppList = (state) => {
  return state.appList
}

// Permette di ottenere un servizio di configurazione salvato nello store a partire da un codice
export const appServiceActive = (state, getters) => (serviceCode) => {
  if (!state.appList) return undefined
  return state.appList.find(s => equalsIgnoreCase(s.portale_codice, serviceCode))
}


// Permette di ottenere le associazioni utente-applicazione , dato un id applicazione
export const userApplication = (state, getters) => (appId) => {
  if (!state.userApplicationsList) return undefined
  return state.userApplicationsList.find(app => app.applicazione_id === appId)
}

export default {
  'user': user,
  'isUserLogged': isUserLogged,
  'isPiedmontUser': isPiedmontUser,
  appServices,
  'appService': appService,
  'delegableAppServices': delegableAppServices,
  userContacts,
  hasUserContacts,
  fcmToken,
  hasFcmToken,
  isEnlisted,
  appConfig,
  isAppUpdateMandatory,
  isUserMinor,
  getMessageList,
  getAppList,
  'appServiceActive': appServiceActive,
  'userApplication': userApplication
}
