/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export default function() {
  return {
    config: {},
    user: null,
    userInfo: null,
    notifyContacts: null,
    fcmToken: null,
    enrollmentInfo: null,
    enrollmentConsent: null,
    delegatorList: [],
    delegatorSelected: null,
    delegatorSelectedEnrollmentInfo: null,
    delegatorSelectedEnrollmentConsent: null,
    tagList: [],
    categoryList: [],
    episodeTypeList:[],
    exemptionInfo:null,
    delegatorListError:false,
    userDoctor:null,
    noDoctorErr:null,
    enablingInfo: null,
    documentList:[],
    documentHiddenDialog:null
  };
}
