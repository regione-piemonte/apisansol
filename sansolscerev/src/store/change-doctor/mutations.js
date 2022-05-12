
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const setUserInfo = (state, {info}) => {
  state.userInfo = info
};

export const setActiveUserEnrollmentInfo = (state, {activeUserEnrollmentInfo}) => {
  state.activeUserEnrollmentInfo = activeUserEnrollmentInfo
};

export const setMonitoredDoctors = (state, {info}) => {
  state.monitoredDoctors = info
};

export const setDoctorTypes = (state, {types}) => {
  state.doctorTypes =  types
};

export const setNewResidence = (state, {address}) => {
  state.requestInformation = Object.assign({},state.requestInformation, { residenza: address })
  // state.requestInformation.residenza = address
};

export const setResidenceObj = (state, {address}) => {
  state.residence =  address
};

export const setNewDomicile = (state, {address}) => {
  state.requestInformation = Object.assign({},state.requestInformation, { domicilio: address })
  // state.requestInformation.domicilio = address
};

export const setDomicileObj = (state, {address}) => {
  state.domicile =  address
};

export const setNewContactInfo = (state, {contacts}) => {
  state.requestInformation = Object.assign({},state.requestInformation, {recapiti: contacts})
};


export const setIsAskedAddress = (state, {val}) => {
  state.isAskedAddress = val
};

export const setCombinationControl = (state, {combination}) => {
  state.requestInformation = Object.assign({},state.requestInformation, {controllo_combinazione: combination})
};

export const setRenewTemporaryAssistance = (state, {value}) => {
  state.renewTemporaryAssistance = value
};


export const setCitizenship = (state, {citizen}) => {
  state.requestInformation = Object.assign({},state.requestInformation, {cittadinanza: citizen})
  // state.requestInformation.cittadinanza = citizen
};

export const setChoosenDoctor = (state, {doctor}) => {
  state.requestInformation = Object.assign({},state.requestInformation, {medico:doctor})
  // state.requestInformation.medico = doctor
};

// export const setFromAnonymousPage = (state, {value}) => {
//   state.fromAnonimousPage = value
// };

export const setDoctorAnotherRegion = (state, {doctor}) => {
  state.requestInformation = Object.assign({},state.requestInformation, {medico_atra_regione:doctor})
};

export const setAttachments = (state, {attachments}) => {
  state.requestInformation = Object.assign({},state.requestInformation, {allegati:attachments})
};
export const setAdditionalInformation = (state, {info}) => {
  state.requestInformation = Object.assign({},state.requestInformation, {dati_aggiuntivi:info})
};
export const setNotes = (state, {notes}) => {
  state.requestInformation = Object.assign({},state.requestInformation, {notes:notes})

};
export const setActiveDelegation = (state, payload) => state.activeDelegation = payload;
export const unsetActiveDelegation = (state) => state.activeDelegation = null;


export const setIsDoctorDerogation = (state, {value}) => {
  state.attachmentsOptions = Object.assign({},state.attachmentsOptions, {isDoctorDerogation:value})
};

export const setIsCareMotivation = (state, {value}) => {
  state.attachmentsOptions = Object.assign({},state.attachmentsOptions, {isCareMotivation:value})
};

export const setIsForeignerDocuments = (state, {value}) => {
  state.attachmentsOptions = Object.assign({},state.attachmentsOptions, {isForeignerDocuments:value})
};

export const setForeignerAttachments = (state, {attachments}) => {
  state.attachmentsTypeList = attachments
};

export const setIsDelegation = (state, {value}) => {
  state.attachmentsOptions = Object.assign({},state.attachmentsOptions, {isDelegation:value})
};

export const setUserDoctorDetails = (state, {doctor}) => {
  state.userDoctor = doctor
};



export const resetAllRequestsOptions = (state) => {
  state.attachmentsOptions = {};
  state.isFamilyReunificationInfo = false;
  state.userDoctor = null;
  state.requestInformation = Object.assign({},state.requestInformation, {controllo_combinazione: null});
  state.requestInformation = Object.assign({},state.requestInformation, {medico_atra_regione:null});
  state.requestInformation = Object.assign({},state.requestInformation, {allegati:null});
  state.requestInformation = Object.assign({},state.requestInformation, {dati_aggiuntivi:null});
  state.requestInformation = Object.assign({},state.requestInformation, {notes:null});
  state.toBackoffice = false;
  state.newAllowedDateChanges = null;
  state.isMaxLimitChangeOrRevoke = false;
};

export const setIsFamilyReunionInfo = (state, {info}) => {
  state.isFamilyReunificationInfo = info
};


export const resetAdditionalInfo = state =>{
  state.requestInformation = Object.assign({},state.requestInformation, {dati_aggiuntivi:null});
  state.requestInformation = Object.assign({},state.requestInformation, {notes:null});
}
export const resetAllParams = (state) => {
  state.requestInformation = {};
  state.isAskedAddress = false;
  state.toBackoffice = false;
  state.isAssistanceRenewal = false;
};
export const setIsToBackoffice = (state, {value}) => {
  state.toBackoffice = value;
};

export const setDisclaimer = (state, {text}) => {
  state.disclaimer = text;
};
export const setMaxLimitChanges = (state, {newAllowedDate, isMaxLimit}) => {
  state.newAllowedDateChanges = newAllowedDate;
  state.isMaxLimitChangeOrRevoke = isMaxLimit
};

export const setAssistanceRenewal = (state, value) => {
  state.isAssistanceRenewal = value;
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
  setDomicileObj,
  setResidenceObj
}
