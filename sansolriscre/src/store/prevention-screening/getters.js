
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const getUserRiscreInfo = state => {
  return state.userRiscreInfo;
};

export const getUserGeneralInfo = state => {
  return state.userSex;
}

export const getUserCodes = (state, getters) => {
 let sex=  getters["preventionScreening/getUserGeneralInfo"];
 return {
   codice_interno : sex ? sex.codice_interno : '',
   codice_interno_prefisso : sex ? sex.codice_interno_prefisso : ''
 }
};
export const isFemale = (state, getters) => {
  let sex =  getters["preventionScreening/getUserGeneralInfo"];
  return sex ? sex.sesso === 'F' : false;
};
export const getAllowedOperations = state =>{
  return state.allowedOperations;
}


export const getBookableScreenings = state => {
  return {
    isBookable: state.areBookableScreenings,
    screening: state.bookableScreening
  }
};

export default {
  "preventionScreening/getUserRiscreInfo": getUserRiscreInfo,
  "preventionScreening/getUserGeneralInfo": getUserGeneralInfo,
  "preventionScreening/getUserCodes": getUserCodes,
  "preventionScreening/isFemale": isFemale,
  "preventionScreening/getAllowedOperations": getAllowedOperations,
  "preventionScreening/getBookableScreenings": getBookableScreenings,

};
