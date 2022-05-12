/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {getConfiguration, getIdentity} from "@services/api/bff";
import {getProfile} from "@services/api/profile";
import {getUserContacts, saveUserContacts} from "@services/api/preferences";
import {getServices} from "@services/api/cross";
import {deepClone} from "@services/global/utils";
import {config} from "@plugins/config";
import {getUserApplicationsList} from "../../services/api/bff";

const loadAppServices = async (context, payload) => {

  let services = [];

  try {
    let response = await getServices();
    services = response.data;
    context.commit('setAppServices', services);
  } catch (e) {
    console.error(e)
  }

  return services;
};


const loadUserIdentity = async (context, payload) => {

  let user = undefined;

  try {
    let response = await getIdentity();
    user = response.data;
  } catch (e) {
    user = null;
  }

  context.commit('setUserIdentity', user);
  return user;
};


const loadUserProfile = async (context, payload) => {

  let {user} = payload;
  let profile = undefined;

  try {
    let response = await getProfile(user.cf, {_no5XXRedirect: true});
    profile = response.data;
  } catch (e) {
    profile = null;
  }

  context.commit('setUserProfile', profile);
  return profile;
};

const loadUserContacts = async (context, payload) => {

  let {user} = payload;
  let contacts = undefined;

  try {
    let response = await getUserContacts(user.cf, {_no5XXRedirect: true});
    contacts = response.data;
    config.errorContacts = false
  } catch (e) {
    console.warn('Error in loadUserContacts', e);
    if (e.response.status === 404)
      config.errorContacts = false
    else
      config.errorContacts = true

    contacts = null
  }

  context.commit('setUserContacts', contacts);
  return contacts;
};


const loadUserApplications = async (context, payload) => {

  let {user} = payload;
  let appList = undefined;

  try {
    let response = await getUserApplicationsList(user.cf, {_no5XXRedirect: true});
    appList = response.data;
  } catch (e) {
    appList = [];
  }

  context.commit('setUserApplicationsList', appList);
  return appList;
};

const loadUser = async (context, payload = {}) => {

  // Prendiamo in input un eventuale user mockato
  let user = payload.user;
  if (user) {
    context.commit('setUserIdentity', user);
  } else {
    user = await context.dispatch('loadUserIdentity');
  }

  if (user) {
    let userProfilePromise = context.dispatch('loadUserProfile', {user});
    let userContactPromise = context.dispatch('loadUserContacts', {user});
    let userApplicationsPromise = context.dispatch('loadUserApplications', {user});
    let userProfile = await userProfilePromise;
    let userContacts = await userContactPromise;
    let userApplications = await userApplicationsPromise;
  }

  return context.getters['user'];
};


export const setFcmToken = async (context, token) => {
  context.commit('setFcmToken', token)

  // Proviamo ad aggiungere il nuovo token a tutti i servizi che non ce l'hanno già impostato
  try {
    let {cf} = context.getters['user']
    let contacts = deepClone(context.getters['userContacts'])

    let allServices = context.state.appServices
    let notifiableServices = allServices.filter(s => s.notificabile)
    let services = notifiableServices.filter(s => {
      let serviceCode = s.codice_servizio.toLowerCase()
      return !contacts.push[serviceCode] || !contacts.push[serviceCode].includes(token)
    })

    // Se non ci sono servizi a cui aggiungere il token => non facciamo nulla evitando una chiamata inutile
    if (!services.length) return

    // Aggiungiamo il nuovo token a tutti i servizi delegablili che non ce l'hanno già
    let ourPush = services.reduce((out, s) => {
      let serviceCode = s.codice_servizio.toLowerCase()
      let oldTokens = contacts.push[serviceCode] || []
      out[serviceCode] = [...oldTokens, token]
      return out
    }, {})

    contacts.push = {...contacts.push, ...ourPush}
    let response = await saveUserContacts(cf, contacts);

    context.commit('setUserContacts', response.data);
  } catch (e) {
  }
};


export const loadAppConfig = async (context, payload = {}) => {
  const APP_NAME = "la-mia-salute"

  try {
    let response = await getConfiguration(APP_NAME)
    context.commit('setAppConfig', response.data.configurazione)
  } catch (e) {
    console.error(e)
  }

  return context.getters['appConfig'];
}


export const setAppList = async (context, {appList}) => {
  context.commit('SET_APP_LIST', {appList})
}


export default {
  loadAppServices,
  loadUserIdentity,
  loadUserProfile,
  loadUserContacts,
  loadUserApplications,
  loadUser,
  setFcmToken,
  loadAppConfig,
  setAppList
}
