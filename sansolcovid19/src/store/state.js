/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export default function () {
  return {
    config: {},
    user: null,
    cmsMessageList: [],
    // userInfo: null,
    notifyContacts: null,
    fcmToken: null,
    enrollmentInfo: null,
    enrollmentConsent: null,
    delegatorList: [],
    delegatorListError:false,
    delegatorSelected: null,
    delegatorSelectedEnrollmentInfo: null,
    delegatorSelectedEnrollmentConsent: null,
    otpLogin: false,
    citizen: null,
    citizenError: null,
    documentInfoList: [],
    userApplicationsList:[]
  };
}
