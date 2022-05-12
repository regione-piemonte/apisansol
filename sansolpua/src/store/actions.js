/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { extend, throttle } from "quasar";
import {
  getDelegateList,
  getDelegatorList,
  getDoctorDetail,
  getMedicalAssistanceInfo,
  getNotifyMessages,
  getNotifyMessagesUnseen,
  updateNotifyContacts
} from "src/services/api";
import { HOUR, NOTIFY_TAG_MATCH } from "src/services/config";

export const setConfig = (context, { config }) => {
  context.commit("SET_CONFIG", { config });
};

export const setAppMessages = (context,  messages ) => {
  context.commit("SET_APP_MESSAGES",  messages );
};

export const setUser = (context, { user }) => {
  context.commit("SET_USER", { user });
};

export const setUserInfo = (context, { userInfo }) => {
  context.commit("SET_USER_INFO", { userInfo });
};

export const setUserInfoError = (context, { error }) => {
  context.commit("SET_USER_INFO_ERROR", { error });
};

export const setNotifyContacts = (context, { contacts }) => {
  context.commit("SET_NOTIFY_CONTACTS", { contacts });
};

export const setFcmToken = async (context, { fcmToken }) => {
  context.commit("SET_FCM_TOKEN", { fcmToken });

  // Proviamo ad aggiungere il nuovo token a tutti i servizi che non ce l'hanno già impostato
  try {
    let user = context.getters["getUser"];
    let taxCode = user?.cf;

    let appList = context.getters["getAppList"] ?? [];
    let appListNotifiable = appList.filter(app => app.notificabile);

    let notifyContacts = context.getters["getNotifyContacts"];
    notifyContacts = extend(true, {}, notifyContacts);

    // Prendiamo solo le app che non hanno già questo token FCM collegato
    let appListWithoutFcmToken = appListNotifiable.filter(s => {
      let code = s.codice_servizio?.toLowerCase() ?? null;
      let fcmTokenList = notifyContacts?.push?.[code] ?? [];
      return !fcmTokenList.includes(fcmToken);
    });

    // Se non ci sono applicazioni a cui aggiungere il nuovo token
    // => non facciamo nulla evitando una chiamata inutile
    if (!appListWithoutFcmToken.length) return;

    // Aggiungiamo il nuovo token a tutte le applicazioni che non hanno il nuovo token
    let pushListNew = appListWithoutFcmToken.reduce((out, s) => {
      let code = s.codice_servizio?.toLowerCase();
      let fcmTokenListOld = notifyContacts?.push?.[code] ?? [];
      out[code] = [...fcmTokenListOld, fcmToken];
      return out;
    }, {});

    notifyContacts.push = { ...notifyContacts.push, ...pushListNew };
    let { data } = await updateNotifyContacts(taxCode, notifyContacts);

    context.commit("setNotifyContacts", { notifyContacts: data });
  } catch (err) {
    console.error(err);
  }
};

// export const setEnrollmentInfo = (context, { enrollmentInfo }) => {
//   context.commit("SET_ENROLLMENT_INFO", { enrollmentInfo });
// };

export const setDelegatorList = (context, { delegatorList }) => {
  context.commit("SET_DELEGATOR_LIST", { delegatorList });
};

export const setDelegatorSelected = (context, { delegatorSelected }) => {
  context.commit("SET_DELEGATOR_SELECTED", { delegatorSelected });
};

export const loadDoctorDetail = throttle(async context => {
  let user = context.getters["getUser"];
  let taxCode = user?.cf ?? null;

  // Se l'utente non è loggato oppure non abbiamo il suo CF => non facciamo nulla
  if (!taxCode) return;

  try {
    let { data } = await getMedicalAssistanceInfo(taxCode);
    context.commit("SET_MEDICAL_ASSISTANCE_INFO", {
      medicalAssistanceInfo: data
    });

    // Al momento usiamo l'id del medico anziché il codice fiscale perché i mocks accettano l'ID
    // Quando funzioneranno nuovamente le API useremo il codice fiscale
    let doctorTaxCode = data?.medico?.codice_fiscale;
    // let doctorTaxCode = data?.medico?.id;

    if (doctorTaxCode) {
      let { data: doctorData } = await getDoctorDetail(doctorTaxCode);
      context.commit("SET_DOCTOR", { doctor: doctorData });
    }
  } catch (err) {
    console.error(err);
  }
}, HOUR);

export const loadMessageList = throttle(async context => {
  let user = context.getters["getUser"];
  let taxCode = user?.cf ?? null;
  if (!taxCode) return;

  let params = {
    limit: 6,
    filter: {
      tag: { match: NOTIFY_TAG_MATCH }
    }
  };

  let { data } = await getNotifyMessages(taxCode, { params });
  context.commit("SET_MESSAGE_LIST", { messageList: data });
}, HOUR);

export const loadMessageListUnseen = throttle(async context => {
  let user = context.getters["getUser"];
  let taxCode = user?.cf ?? null;
  if (!taxCode) return;

  let params = {
    filter: {
      tag: { match: NOTIFY_TAG_MATCH }
    }
  };

  let { data, headers } = await getNotifyMessagesUnseen(taxCode, { params });
  context.commit("SET_MESSAGE_LIST_UNSEEN", { messageListUnseen: data });
  context.commit("SET_MESSAGE_LIST_UNSEEN_COUNT", {
    messageListUnseenCount: headers["total-elements"]
  });
}, HOUR);

export const loadDelegateList = throttle(async context => {
  let user = context.getters["getUser"];
  let taxCode = user?.cf ?? null;
  if (!taxCode) return;

  let { data } = await getDelegateList(taxCode);
  context.commit("SET_DELEGATE_LIST", { delegateList: data });
}, HOUR);

export const loadDelegatorList = throttle(async context => {
  let user = context.getters["getUser"];
  let taxCode = user?.cf ?? null;
  if (!taxCode) return;

  let { data } = await getDelegatorList(taxCode);
  context.commit("SET_DELEGATOR_LIST", { delegatorList: data });
}, HOUR);

export const setUserStatus = (context,  info ) => {
  context.commit("SET_USER_STATUS",  info );
};
