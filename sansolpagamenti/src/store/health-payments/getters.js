/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

const isDelegationActive = state => state.activeDelegation !== null;
const getActiveDelegation = state => state.activeDelegation;
const getActiveUserEnrollmentInfo = state => state.activeUserEnrollmentInfo;
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


const cartItems = state => {
  return state.cart.items
}

const cartItemsCount = (state, getters) => getters.cartItems.length
const isCartEmpty = (state, getters) => getters.cartItemsCount <= 0
const cartTotal = (state, getters) => getters.cartItems.reduce((acc, val, index) => acc + val.da_pagare.valore, 0)
const isCartItem = (state, getters) => (ticket) => !!getters.cartItems.find(i => i.numero_pratica_regionale === ticket.numero_pratica_regionale)

const getReminderPrintableList = (state) => {
  return state.reminderPrintableList
}

export default {
  isDelegationActive,
  getActiveDelegation,
  getActiveDelegationFullName,
  getTaxCode,
  cartItems,
  cartItemsCount,
  isCartEmpty,
  cartTotal,
  isCartItem,
  getReminderPrintableList,
  getActiveUserEnrollmentInfo
}
