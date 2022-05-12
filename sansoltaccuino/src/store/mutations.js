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

export const SET_ENROLLMENT_CONSENT = (state, { consent }) => {
  state.enrollmentConsent = consent;
};

export const SET_DELEGATOR_LIST = (state, { delegatorList }) => {
  state.delegatorList = delegatorList;
};

export const SET_DELEGATOR_SELECTED = (state, { delegatorSelected }) => {
  state.delegatorSelected = delegatorSelected;
};

export const SET_DELEGATOR_SELECTED_ENROLLMENT_INFO = (state, { enrollmentInfo }) => {
  state.delegatorSelectedEnrollmentInfo = enrollmentInfo;
};

export const SET_DELEGATOR_SELECTED_ENROLLMENT_CONSENT = (
  state,
  { consent }
) => {
  state.delegatorSelectedEnrollmentConsent = consent;
};

export const SET_IS_DELEGATOR_SELECTED_PIEDMONT = (state, { isPiedmont }) => {
  state.isDelegatorSelectedPiedmont = isPiedmont;
};

export const SET_IS_NOTEBOOK_HIDDEN_TO_DELEGATOR = (state, { isHidden }) => {
  state.isNotebookHiddenToDelegator = isHidden;
};

export const SET_IS_NOTEBOOK_CLOSED = (state, { isClosed }) => {
  state.isNotebookClosed = isClosed;
};

export const SET_NOTEBOOK = (state, { notebook }) => {
  state.notebook = notebook;
};

export const SET_MEASURE_UNIT_CONFIGURATION = (state, { measureUnitConfig }) => {
  state.measureUnitConfig = measureUnitConfig;
};
export const SET_DELEGATOR_LIST_ERROR = (state, value) => {
  state.delegatorListError = value;
};
