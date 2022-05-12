/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {SessionStorage} from 'quasar'

export default {
  activeDelegation: null,
  activeUserEnrollmentInfo:null,
  cart: {
    items: SessionStorage.get.item('store.healthPayments.cart.items') || []
  },
  reminderPrintableList: []
}

