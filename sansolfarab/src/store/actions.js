/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */

import { extend, LocalStorage } from "quasar";
import { updateNotifyContacts } from "src/services/api";
import { USER_DEVICE_UUID_KEY } from "src/services/config";

export const setConfig = (context, { config }) => {
  context.commit("SET_CONFIG", { config });
};

export const setUser = (context, { user }) => {
  context.commit("SET_USER", { user });
};

export const setUserInfo = (context, { userInfo }) => {
  context.commit("SET_USER_INFO", { userInfo });
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

export const setEnrollmentInfo = (context, { enrollmentInfo }) => {
  context.commit("SET_ENROLLMENT_INFO", { enrollmentInfo });
};

export const setDelegatorList = (context, { delegatorList }) => {
  context.commit("SET_DELEGATOR_LIST", { delegatorList });
};

export const setDelegatorSelected = (context, { delegatorSelected }) => {
  context.commit("SET_DELEGATOR_SELECTED", { delegatorSelected });
};

export const setDelegatorSelectedEnrollmentInfo = (
  context,
  { enrollmentInfo }
) => {
  context.commit("SET_DELEGATOR_SELECTED_ENROLLMENT_INFO", { enrollmentInfo });
};

export const setUserAddress = (context, { address }) => {
  context.commit("SET_USER_ADDRESS", { address });
};

export const setPartecipantPharmarcies = (context, partecipantPharmarcies) => {
  context.commit("SET_PARTECIPANT_PHARMACIES", partecipantPharmarcies);
};

export const loadDeviceUuid = context => {
  let uuid = LocalStorage.getItem(USER_DEVICE_UUID_KEY) ?? null;
  context.commit("SET_DEVICE_UUID", { uuid });
};

export const setDeviceUuid = (context, { uuid }) => {
  LocalStorage.set(USER_DEVICE_UUID_KEY, uuid);
  context.commit("SET_DEVICE_UUID", { uuid });
};

export const setUsualPharmacyList = (context, { usualPharmacyList }) => {
  context.commit("SET_USUAL_PHARMACY_LIST", { usualPharmacyList });
};


export const setUserStatus = (context,  info ) => {
  context.commit("SET_USER_STATUS",  info );
};
