/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const setUserInfo = (context, {info}) => {
  context.commit('setUserInfo', {info})
};

export const setActiveUserEnrollmentInfo = (context, {activeUserEnrollmentInfo}) => {
  context.commit('setActiveUserEnrollmentInfo', {activeUserEnrollmentInfo})
};

export const setMonitoredDoctors = (context, {info}) => {
  context.commit('setMonitoredDoctors', {info})
};

export const setDoctorTypes = (context, {types}) => {
  context.commit('setDoctorTypes', {types})
};


export const setNewResidence = (context, {address}) => {
  context.commit('setNewResidence', {address})
};

export const setResidenceObj = (context, {address}) => {
  context.commit('setResidenceObj', {address})
};

export const setNewDomicile = (context, {address}) => {
  context.commit('setNewDomicile', {address})
};

export const setDomicileObj = (context, {address}) => {
  context.commit('setDomicileObj', {address})
};

export const setNewContactInfo = (context, {contacts}) => {
  context.commit('setNewContactInfo', {contacts})
};

export const setIsAskedAddress = (context, {val}) => {
  context.commit('setIsAskedAddress', {val})
};

export const setCombinationControl = (context, {combination}) => {
  context.commit('setCombinationControl', {combination})
};
export const setRenewTemporaryAssistance = (context, {value}) => {
  context.commit('setRenewTemporaryAssistance', {value})
};
export const setCitizenship = (context, {citizen}) => {
  context.commit('setCitizenship', {citizen})
};

export const setChoosenDoctor = (context, {doctor}) => {
  context.commit('setChoosenDoctor', {doctor})
};

// export const setFromAnonymousPage = (context, {value}) => {
//   context.commit('setFromAnonymousPage', {value})
// };

export const setDoctorAnotherRegion = (context, {doctor}) => {
  context.commit('setDoctorAnotherRegion', {doctor})
};

export const setAdditionalInformation = (context, {info}) => {
  context.commit('setAdditionalInformation', {info})
};

export const setNotes = (context, {notes}) => {
  context.commit('setNotes', {notes})
};

export const setAttachments = (context, {attachments}) => {
  context.commit('setAttachments', {attachments})
};

export const setActiveDelegation = (context, payload) => {
  context.commit('setActiveDelegation', payload)
};
export const unsetActiveDelegation = (context) => {
  context.commit('unsetActiveDelegation')
};

export const setIsDoctorDerogation = (context, {value}) => {
  context.commit('setIsDoctorDerogation', {value})
};

export const setIsCareMotivation = (context, {value}) => {
  context.commit('setIsCareMotivation', {value})
};

export const setIsDelegation = (context, {value}) => {
  context.commit('setIsDelegation', {value})
};
export const setIsForeignerDocuments = (context, {value}) => {
  context.commit('setIsForeignerDocuments', {value})
};

export const setIsFamilyReunionInfo = (context, {info}) => {
  context.commit('setIsFamilyReunionInfo', {info})
};

export const setForeignerAttachments = (context, {attachments}) => {
  context.commit('setForeignerAttachments', {attachments})
};

export const resetAllRequestsOptions = (context ) => {
  context.commit('resetAllRequestsOptions')
};
export const resetAdditionalInfo = (context ) => {
  context.commit('resetAdditionalInfo')
}


export const resetAllParams = (context ) => {
  context.commit('resetAllParams')
};

export const setIsToBackoffice = (context , {value}) => {
  context.commit('setIsToBackoffice', {value})
};

export const setDisclaimer = (context , {text}) => {
  context.commit('setDisclaimer', {text})
};
export const setMaxLimitChanges = (context , {newAllowedDate, isMaxLimit}) => {
  context.commit('setMaxLimitChanges', {newAllowedDate, isMaxLimit})
};

export const setUserDoctorDetails = (context , {doctor}) => {
  context.commit('setUserDoctorDetails', {doctor})
};
export const setAssistanceRenewal = (context , value) => {
  context.commit('setAssistanceRenewal', value)
};




export default {
  setUserInfo,
  setMonitoredDoctors,
  setDoctorTypes,
  setNewResidence,
  setNewDomicile,
  setNewContactInfo,
  setIsAskedAddress,
  setCombinationControl,
  setRenewTemporaryAssistance,
  setCitizenship,
  setChoosenDoctor,
  // setFromAnonymousPage,
  setDoctorAnotherRegion,
  setAdditionalInformation,
  setAttachments,
  setNotes,
  setActiveDelegation,
  unsetActiveDelegation,
  setIsDoctorDerogation,
  setIsCareMotivation,
  setIsDelegation,
  setIsFamilyReunionInfo,
  setIsForeignerDocuments,
  setForeignerAttachments,
  resetAllRequestsOptions,
  resetAllParams,
  setIsToBackoffice,
  setDisclaimer,
  setMaxLimitChanges,
  setUserDoctorDetails,
  setAssistanceRenewal,
  setActiveUserEnrollmentInfo,
  resetAdditionalInfo,
  setResidenceObj,
  setDomicileObj
}

