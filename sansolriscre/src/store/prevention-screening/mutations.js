/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const SET_USER_INFO = (state,  info ) => {
  state.userRiscreInfo = info;
};

export const SET_USER_SEX = (state, sex) => ( state.userSex = sex);


export const SET_ACTIVE_DELEGATION = (state, payload) =>
  (state.activeDelegation = payload);
export const UNSET_ACTIVE_DELEGATION = state => (state.activeDelegation = null);
export const SET_ALLOWED_OPERATIONS = (state, operations) => {
  state.allowedOperations = Object.assign({},state.allowedOperations, { [operations.type]: operations.obj })

};
export const RESET_ALLOWED_OPERATIONS = (state) => {
  state.allowedOperations = null

};

export const SET_IS_BOOKABLE = (state, params) => {
  if(params.isBookable){
    state.areBookableScreenings = true
  }
  state.bookableScreening = Object.assign({},state.areBookableScreenings, { [params.type]: params.isBookable })
};

export default {
  SET_USER_INFO,
  SET_ACTIVE_DELEGATION,
  UNSET_ACTIVE_DELEGATION,
  SET_USER_SEX,
  SET_ALLOWED_OPERATIONS,
  RESET_ALLOWED_OPERATIONS,
  SET_IS_BOOKABLE
};
