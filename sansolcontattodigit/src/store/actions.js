/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {extend, LocalStorage} from "quasar";
import {
   getDoctorInfo,
  updateNotifyContacts
} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {DOCUMENT_HIDDEN_DIALOG} from "src/services/config";

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

    context.commit("SET_NOTIFY_CONTACTS", { notifyContacts: data });
  } catch (err) {
    console.error(err);
  }
};

export const setEnrollmentInfo = (context, { enrollmentInfo }) => {
  context.commit("SET_ENROLLMENT_INFO", { enrollmentInfo });
};

export const setEnrollmentConsent = (context, { enrollmentConsent }) => {
  context.commit("SET_ENROLLMENT_CONSENT", { enrollmentConsent });
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

export const setDelegatorSelectedEnrollmentConsent = (context, { consent }) => {
  context.commit("SET_DELEGATOR_SELECTED_ENROLLMENT_CONSENT", { consent });
};



export const setTagList = (context, { tagList }) => {
  context.commit("SET_TAG_LIST", { tagList });
};

export const setCategoryList = async (context, { categoryList }) => {
  context.commit("SET_CATEGORY_LIST", { categoryList });
};


export const setEpisodeTypeList = async (context,  { episodeTypeList }) => {
  context.commit("SET_EPISODE_TYPE_LIST", { episodeTypeList });
}
export const setExemptionInfo = async (context, { exemptionInfo }) => {
  context.commit("SET_EXEMPTION_INFO", { exemptionInfo });

};
export const setDelegatorListError = (context, value) => {
  context.commit("SET_DELEGATOR_LIST_ERROR", value);
};
export const setUserEnablingInfo = (context, {info}) => {
  context.commit("SET_USER_ENABLING_INFO", {info});
};


export const setUserDoctor = async (context, taxCode) => {
  let doctorError = null
  try{
    let {data: info} = await getDoctorInfo(taxCode)
    context.commit("SET_USER_DOCTOR", {info});
  }catch (error) {
    console.error(error);
    let statusCode = error?.response?.status;
    if((statusCode === 404 )){
      doctorError = {noDoctor: true}
    }else if ((statusCode === 403 )){
      doctorError = {noAdhesion: true}
    }
    else{
      let message = "A causa di un errore imprevisto al momento non è possibile inviare nuovi messaggi. Riprova più tardi.";
      apiErrorNotify({ error, message });
    }

  }
  context.commit("SET_NO_DOCTOR_ERR", doctorError);
};

export const setDocumentList = async (context, { documents }) => {
  context.commit("SET_DOCUMENT_LIST", { documents });

};

export const setDocumentHiddenDialogInfo = (context, { status }) => {
  LocalStorage.set(DOCUMENT_HIDDEN_DIALOG, status);
  context.commit("SET_DOCUMENT_HIDDEN_DIALOG", { status });
};
