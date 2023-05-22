/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
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

export const SET_NOTIFY_CONTACTS = (state, { contacts }) => {
  state.notifyContacts = contacts;
};

export const SET_FCM_TOKEN = (state, { fcmToken }) => {
  state.fcmToken = fcmToken;
};

export const SET_ENROLLMENT_INFO = (state, { enrollmentInfo }) => {
  state.enrollmentInfo = enrollmentInfo;
};

export const SET_DELEGATOR_LIST = (state, { delegatorList }) => {
  state.delegatorList = delegatorList;
};

export const SET_DELEGATOR_SELECTED = (state, { delegatorSelected }) => {
  state.delegatorSelected = delegatorSelected;
};

export const SET_DELEGATOR_SELECTED_ENROLLMENT_INFO = (
  state,
  { enrollmentInfo }
) => {
  state.delegatorSelectedEnrollmentInfo = enrollmentInfo;
};

export const SET_USER_ADDRESS = (state, { address }) => {
  state.userAddress = address;
};

export const SET_PARTECIPANT_PHARMACIES = (state, partecipantPharmacies) => {
  state.partecipantPharmacies = partecipantPharmacies;
};

export const SET_DEVICE_UUID = (state, { uuid }) => {
  state.deviceUuid = uuid;
};

export const SET_USUAL_PHARMACY_LIST = (state, { usualPharmacyList }) => {
  state.usualPharmacyList = usualPharmacyList;
};

export const SET_USER_STATUS = (state,  info ) => {
  state.user = Object.assign({},state.user, {info:info})
};
