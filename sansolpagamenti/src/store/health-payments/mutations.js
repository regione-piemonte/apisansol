/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {SessionStorage} from 'quasar'

const setActiveDelegation = (state, payload) => state.activeDelegation = payload.delegator;
const unsetActiveDelegation = (state) => state.activeDelegation = null;

const saveCartItemsToSessionStorage = (items) => {
  SessionStorage.set('store.healthPayments.cart.items', items)
}

export const addToCart = (state, healthPayment) => {
  state.cart.items = [...state.cart.items, healthPayment]
  saveCartItemsToSessionStorage(state.cart.items)
}

export const removeFromCart = (state, healthPayment) => {
  state.cart.items = state.cart.items.filter(item => item.numero_pratica_regionale !== healthPayment.numero_pratica_regionale)
  saveCartItemsToSessionStorage(state.cart.items)
}

export const clearCart = (state) => {
  state.cart.items = []
  saveCartItemsToSessionStorage(state.cart.items)
}

export const setReminderPrintableList = (state, {reminderPrintableList}) => {
  state.reminderPrintableList = reminderPrintableList
}

export const setActiveUserEnrollmentInfo = (state, {activeUserEnrollmentInfo}) => {
  state.activeUserEnrollmentInfo = activeUserEnrollmentInfo
};


export default {
  setActiveDelegation,
  unsetActiveDelegation,
  addToCart,
  removeFromCart,
  clearCart,
  setReminderPrintableList,
  setActiveUserEnrollmentInfo
}
