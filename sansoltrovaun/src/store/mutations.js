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

export const SET_USER_ADDRESS = (state, { address }) => {
  state.userAddress = address;
};

export const SET_ACTIVE_SERVICE = (state, { service }) => {
  state.activeService = service;
};

export const SET_DOCTOR_TYPES = (state, { types }) => {
  state.doctorTypes = types;
};
export const SET_FACILITIES_TYPES = (state, { types }) => {
  state.facilitiesTypes = types;
};

export const SET_HOSPITALS_TYPES = (state, { types }) => {
  state.hospitalsTypes = types;
};

export const SET_CELIAC_STORES_TYPES = (state, { types }) => {
  state.celiacStoresTypes = types;
};

export const SET_RESULTS_ON_MAP = (state, value) => {
  state.showResultsOnMap = value;
};

export const SET_IF_FIRST_ACCESS = (state, value) => {
  state.isFirstAccess = value;
};

