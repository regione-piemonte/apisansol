

/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const clearCart = (context, payload) => {
  context.commit('clearCart')
}
export const setActiveUserEnrollmentInfo = (context, {activeUserEnrollmentInfo}) => {
  context.commit('setActiveUserEnrollmentInfo', {activeUserEnrollmentInfo})
};

export default {
  clearCart,
  setActiveUserEnrollmentInfo
}


