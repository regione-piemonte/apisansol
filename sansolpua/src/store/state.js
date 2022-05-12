/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export default function() {
  return {
    config: {},
    user: null,
    userInfo: null,
    userInfoError: null,
    notifyContacts: null,
    fcmToken: null,
    // enrollmentInfo: null,
    delegatorList: [],
    delegatorSelected: null,
    medicalAssistanceInfo: null,
    doctor: null,
    messageList: [],
    messageListUnseen: [],
    messageListUnseenCount: 0,
    delegateList: [],
    appMessagesList:[]
  };
}
