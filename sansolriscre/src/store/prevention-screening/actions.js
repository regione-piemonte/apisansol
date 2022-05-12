/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const setActiveDelegation = (context, payload) => {
  context.commit("SET_ACTIVE_DELEGATION", payload);
};
export const unsetActiveDelegation = context => {
  context.commit("UNSET_ACTIVE_DELEGATION");
};

export const setUserInfo = (context,  info ) => {
  context.commit("SET_USER_INFO", info );
};

export const setUserSex = (context,  sex ) => {
  context.commit("SET_USER_SEX", sex );
};

export const setAllowedOperations = (context,  operations ) => {
  context.commit("SET_ALLOWED_OPERATIONS", operations);
};

export const resetAllowedOperations = (context) =>{
  context.commit("RESET_ALLOWED_OPERATIONS");
}

export const setIsBookable = (context,  obj ) => {
  context.commit("SET_IS_BOOKABLE", obj );
};




export default {
  "preventionScreening/setActiveDelegation": setActiveDelegation,
  "preventionScreening/unsetActiveDelegation": unsetActiveDelegation,
  "preventionScreening/setUserInfo": setUserInfo,
  "preventionScreening/setUserSex": setUserSex,
  "preventionScreening/setAllowedOperations": setAllowedOperations,
  "preventionScreening/resetAllowedOperations": resetAllowedOperations,
  "preventionScreening/setIsBookable": setIsBookable
};
