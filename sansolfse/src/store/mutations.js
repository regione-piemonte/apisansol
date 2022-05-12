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

export const SET_ENROLLMENT_CONSENT = (state, { enrollmentConsent }) => {
  state.enrollmentConsent = enrollmentConsent;
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

export const SET_DELEGATOR_SELECTED_ENROLLMENT_CONSENT = (
  state,
  { consent }
) => {
  state.delegatorSelectedEnrollmentConsent = consent;
};

export const SET_TAG_LIST = (state, { tagList }) => {
  state.tagList = tagList;
};

export const SET_CATEGORY_LIST = (state, { categoryList }) => {
  state.categoryList = categoryList;
};

export const SET_EXEMPTION_INFO = (state, { exemptionInfo }) => {
  state.exemptionInfo = exemptionInfo;
};
export const SET_DELEGATOR_LIST_ERROR = (state, value) => {
  state.delegatorListError = value;
};
