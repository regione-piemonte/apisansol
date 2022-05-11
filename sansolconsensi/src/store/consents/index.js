/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import state from './state'
import getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
