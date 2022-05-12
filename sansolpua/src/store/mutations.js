/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const SET_CONFIG = (state, { config }) => {
  state.config = config;
};

export const SET_USER = (state, { user }) => {
  state.user = user;
};

export const SET_USER_INFO = (state, { userInfo }) => {
  state.userInfo = userInfo;
};

export const SET_USER_INFO_ERROR = (state, { error }) => {
  state.userInfoError = error;
};

export const SET_NOTIFY_CONTACTS = (state, { contacts }) => {
  state.notifyContacts = contacts;
};

export const SET_FCM_TOKEN = (state, { fcmToken }) => {
  state.fcmToken = fcmToken;
};

// export const SET_ENROLLMENT_INFO = (state, { enrollmentInfo }) => {
//   state.enrollmentInfo = enrollmentInfo;
// };

export const SET_DELEGATOR_LIST = (state, { delegatorList }) => {
  state.delegatorList = delegatorList;
};

export const SET_DELEGATOR_SELECTED = (state, { delegatorSelected }) => {
  state.delegatorSelected = delegatorSelected;
};

export const SET_MEDICAL_ASSISTANCE_INFO = (
  state,
  { medicalAssistanceInfo }
) => {
  state.medicalAssistanceInfo = medicalAssistanceInfo;
};

export const SET_DOCTOR = (state, { doctor }) => {
  state.doctor = doctor;
};

export const SET_MESSAGE_LIST = (state, { messageList }) => {
  state.messageList = messageList;
};

export const SET_MESSAGE_LIST_UNSEEN = (state, { messageListUnseen }) => {
  state.messageListUnseen = messageListUnseen;
};

export const SET_MESSAGE_LIST_UNSEEN_COUNT = (state, { messageListUnseenCount }) => {
  state.messageListUnseenCount = messageListUnseenCount;
};

export const SET_DELEGATE_LIST = (state, { delegateList }) => {
  state.delegateList = delegateList;
};

export const SET_USER_STATUS = (state,  info ) => {
  state.user = Object.assign({},state.user, {info:info})
};
export const SET_APP_MESSAGES = (state,  messages ) => {
  state.appMessagesList = messages;
};
