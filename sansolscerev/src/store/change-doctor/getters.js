/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {isDelegatorMinor} from "@services/delegations/business-logic";
import {isMinorUser}  from "@services/change-doctor/business-logic";
import differenceInYears from "date-fns/difference_in_years";

export const isDelegationActive = state => state.activeDelegation !== null;
export const getActiveDelegation = state => state.activeDelegation;

export const getActiveUserEnrollmentInfo = state => state.activeUserEnrollmentInfo;

export const getActiveDelegationFullName = (state, getters) => {
  if (!getters.isDelegationActive) return '';
  let delegation = getters.getActiveDelegation;
  return `${delegation.cognome_delega} ${delegation.nome_delega}`;
};
export const isMinorDelegator = (state, getters) => {
  if (!getters.isDelegationActive) return false;
  let delegator = getters.getActiveDelegation;
  return isDelegatorMinor(delegator)
};

export const isAdultDelegator = (state, getters) => {
  if (!getters.isDelegationActive) return false;
  let delegator = getters.getActiveDelegation;
  return !isDelegatorMinor(delegator)
};


export const getUserInfo = state => {return state.userInfo};

export const getUserDoctorDetails = state => {return state.userDoctor};

export const getMonitoredDoctors = state => {return state.monitoredDoctors};

export const getTaxCode = (state, getters, rootState, rootGetters) => {
  if (!getters.isDelegationActive) {
    let user = rootGetters['global/user'];
    return user ? user.cf : '';
  }

  let activeDelegation = getters.getActiveDelegation;
  return activeDelegation.codice_fiscale_delega;
};
export const getDoctorTypes = state => {return state.doctorTypes};

export const getUserAge = state => {
  if(state.userInfo){
    let birth_date = state.userInfo.data_nascita;
    const TODAY = new Date();
    return differenceInYears(TODAY, birth_date)
  }else{
    return null
  }
};
export const getUserDoctor = state => {
    if(state.userInfo){
      let medico = state.userInfo.medico;
      return medico ? medico.id : ''
    }
    return ''

};
export const getNavigationOptions = state => {return state.navigationOptions};
export const isAskedAddress = state => {return state.isAskedAddress};
export const getCombinationControl = state => {return state.requestInformation.controllo_combinazione};
// export const getFromAnonymousPage = state => {return state.fromAnonimousPage};
export const getNewResidence = state => {
  let requestInfo =  state.requestInformation;
  return requestInfo ? requestInfo.residenza : null
 };
export const getNewDomicile = state => {
  let requestInfo =  state.requestInformation;
  return requestInfo ? requestInfo.domicilio : null
  };
export const getCitizenship = state => {
    let requestInfo =  state.requestInformation;
    return requestInfo ? requestInfo.cittadinanza : null
};
export const getAdditionalInfo = state => {
  let requestInfo =  state.requestInformation;
  return requestInfo ? requestInfo.dati_aggiuntivi : null
};


export const getChoosenDoctor = state => {return state.requestInformation.medico};
export const getRequestInformation = state => {return state.requestInformation};
export const getNotes = state => {return state.requestInformation.notes};
export const isRenewTemporaryAssistance = state => {return state.renewTemporaryAssistance};

export const getAttachmentsOptions = state => {return state.attachmentsOptions};
export const getFamilyReunionInfo = state => {return state.isFamilyReunificationInfo};

export const getAttachmentsTypeList = state => {return state.attachmentsTypeList};

export const getIsToBackoffice = state => {return state.toBackoffice};
export const getDisclaimer = state => {return state.disclaimer};

export const getMaxLimitChanges = state => {return {
  newAllowedDate: state.newAllowedDateChanges,
  isMaxLimit:  state.isMaxLimitChangeOrRevoke
}};

export const isAssistanceRenewal = state => {return state.isAssistanceRenewal};
export const getResidenceObj = state => {return state.residence};
export const getDomicileObj = state => {return state.domicile};

export const getNewContactsInfo = state => {return state.requestInformation.recapiti};

export default {
  isDelegationActive,
  getActiveDelegation,
  getActiveDelegationFullName,
  isMinorDelegator,
  getUserInfo,
  getTaxCode,
  getUserDoctor,
  getMonitoredDoctors,
  getDoctorTypes,
  getNewResidence,
  getNewDomicile,
  isAskedAddress,
  getCombinationControl,
  getCitizenship,
  getChoosenDoctor,
  // getFromAnonymousPage,
  getRequestInformation,
  getNotes,
  getNavigationOptions,
  isRenewTemporaryAssistance,
  getAttachmentsOptions,
  getFamilyReunionInfo,
  getAdditionalInfo,
  getAttachmentsTypeList,
  getIsToBackoffice,
  isAdultDelegator,
  getDisclaimer,
  getMaxLimitChanges,
  getUserDoctorDetails,
  getUserAge,
  isAssistanceRenewal,
  getActiveUserEnrollmentInfo,
  getResidenceObj,
  getDomicileObj,
  getNewContactsInfo
}
