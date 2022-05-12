/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

const setUserIdentity = (state, userIdentity) => {
  state.userIdentity = userIdentity;
};

const deleteUser = (state) => {
  state.user = undefined;
};

const setAppServices = (state, appServices) => {
  state.appServices = appServices;
};

const setEnrollmentInfo = (state, enrollmentInfo) => {
  state.enrollmentInfo = enrollmentInfo;
};

const setUserProfile = (state, userProfile) => {
  state.userProfile = userProfile;
}

const setUserContacts = (state, userContacts) => {
  state.userContacts = userContacts;
};

const setUserApplicationsList = (state, appList) => {
  state.userApplicationsList = appList;
}

const deleteUserContacts = (state) => {
  state.userContacts = undefined;
};

export const setFcmToken = (state, token) => {
  state.fcmToken = token;
};

export const setAppConfig = (state, appConfig) => {
  state.appConfig = appConfig
}

export const setMessageList = (state, messageList) => {
  state.messageList = messageList
}

export const SET_APP_LIST = (state, {appList}) => {
  state.appList = appList
}



export default {
  'setUserIdentity': setUserIdentity,
  'setAppServices': setAppServices,
  'setEnrollmentInfo': setEnrollmentInfo,
  'setUserProfile': setUserProfile,
  'setUserContacts': setUserContacts,
  'setUserApplicationsList': setUserApplicationsList,
  'deleteUserContacts': deleteUserContacts,
  'setFcmToken': setFcmToken,
  setAppConfig,
  setMessageList,
  SET_APP_LIST
};
