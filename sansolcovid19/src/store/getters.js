/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {
  CONTACT_VALIDATOR_TYPE_MAP,
  DELEGATION_STATUS_MAP,
  ENROLLMENT_CODES,
} from "src/services/config";
import { orderBy } from "src/services/utils";

export const getAppList = (state) => {
  return state.config?.apps ?? [];
};

export const getFcmVapidKey = (state) => {
  return state.config?.fcm?.vapid_key;
};

export const getFcmConfig = (state) => {
  return state.config?.fcm?.config;
};

export const getFcmToken = (state) => {
  return state.fcmToken;
};

export const getUser = (state) => {
  return state.user;
};

// export const getUserInfo = state => {
//   return state.userInfo;
// };

export const getCmsMessageList = (state, getters) => {
  let workingApp = getters.getWorkingApp;
  let code = workingApp?.portale_codice;
  let result = state.cmsMessageList;

  if (!code) return [];

  // Prendiamo solo i messaggi di questo applicativo
  result = result.filter((mex) => {
    let serviceList = mex?.field_servizi_collegati ?? [];
    return serviceList.some((s) => s.codice_servizio === code);
  });

  return result;
};

export const getNotifyContacts = (state) => {
  return state.notifyContacts;
};

export const getEnrollmentInfo = (state) => {
  return state.enrollmentInfo;
};

export const getEnrollmentConsent = (state) => {
  return state.enrollmentConsent;
};

export const isUserEnrolled = (state) => {
  let code = state.enrollmentInfo?.codice_risposta;
  let codes = ["000", "002", "003", "004", "005", "008", "010", "016"];
  return codes.includes(code);

  // let codes = [ENROLLMENT_CODES.FSE_APPROVED];
  // return codes.includes(state.enrollmentInfo?.codice_risposta);
};

export const isUserEnrollable = (state) => {
  return state.enrollmentInfo?.risposta;
};

export const getDelegatorList = (state) => {
  return state.delegatorList;
};

export const getDelegatorSelected = (state) => {
  return state.delegatorSelected;
};

export const isDelegationActive = (state) => {
  return state.delegatorSelected !== null;
};

export const getDelegatorSelectedEnrollmentInfo = (state) => {
  return state.delegatorSelectedEnrollmentInfo;
};

export const getDelegatorSelectedEnrollmentConsent = (state) => {
  return state.delegatorSelectedEnrollmentConsent;
};

export const isDelegatorSelectedEnrolled = (state) => {
  let codes = [ENROLLMENT_CODES.FSE_APPROVED];
  return codes.includes(state.delegatorSelectedEnrollmentInfo?.codice_risposta);
};

export const isDelegatorSelectedEnrollable = (state) => {
  return state.delegatorSelectedEnrollmentInfo?.risposta;
};

export const getDelegationListFse = (state, getters) => {
  let delegator = state.delegatorSelected;
  if (!delegator) return [];

  let codes = ["FSE", "FSEDOC"];
  let delegationValidStatusList = [
    DELEGATION_STATUS_MAP.ACTIVE,
    DELEGATION_STATUS_MAP.IS_EXPIRING,
  ];

  return delegator.deleghe.filter(
    (d) =>
      codes.includes(d.codice_servizio) &&
      delegationValidStatusList.includes(d.stato_delega)
  );
};

export const getActiveUserEnrollmentInfo = (state, getters) => {
  if (state.delegatorSelected)
    return getters.getDelegatorSelectedEnrollmentInfo;
  return getters.getEnrollmentInfo;
};

export const isEnrolled = (state, getters) => {
  if (state.delegatorSelected) return getters.isDelegatorSelectedEnrolled;
  return getters.isUserEnrolled;
};

export const isEnrollable = (state, getters) => {
  if (state.delegatorSelected) return getters.isDelegatorSelectedEnrollable;
  return getters.isUserEnrollable;
};

export const isPiedmontUser = (state, getters) => {
  let piedmontCode = ENROLLMENT_CODES.NO_PIEDMONT;
  let userCode = state.delegatorSelected
    ? state.delegatorSelectedEnrollmentInfo?.codice_risposta
    : state.enrollmentInfo?.codice_risposta;
  return piedmontCode !== userCode;
};

export const canChangeEnrollmentConsent = (state, getters) => {
  let delegator = state.delegatorSelected;
  if (!delegator) return getters.isEnrolled;

  let hasStrongFseDelegation = getters.getDelegationListFse.some(
    (d) => d.grado_delega === "FORTE"
  );
  return hasStrongFseDelegation && getters.isEnrolled;
};

export const getTaxCode = (state) => {
  if (state.delegatorSelected) {
    return state.delegatorSelected?.codice_fiscale_delega;
  }

  return state.user?.cf;
};

export const getWorkingApp = (state, getters) => {
  let appList = getters["getAppList"];
  console.log()
  return appList?.find((a) => a.codice === process.env.APP_CODE);
};

// Questo è un caso un po' particolare
// I deleganti di questo servizio sono quelli che fanno parte di FSE, FSEDOC o ROL
export const getWorkingAppDelegatorList = (state, getters) => {
  let delegatorList = getters["getDelegatorList"];
  let workingApp = getters["getWorkingApp"];
  let codes = [workingApp?.codice_servizio];

  // let codes = ["FSE", "FSEDOC", "ritiroreferti"];
  let delegationValidStatusList = [
    DELEGATION_STATUS_MAP.ACTIVE,
    DELEGATION_STATUS_MAP.IS_EXPIRING,
  ];

  delegatorList = delegatorList.filter((delegator) => {
    let delegationList = delegator?.deleghe ?? [];
    let result = delegationList.some((delegation) => {
      return (
        codes.includes(delegation.codice_servizio) &&
        delegationValidStatusList.includes(delegation.stato_delega)
      );
    });

    return result;
  });

  delegatorList = orderBy(delegatorList, ["cognome_delega", "nome_delega"]);
  return delegatorList;
};


export const getDelegatorListError = (state) => {
  return state.delegatorListError;
};

export const isOtpLoginActive = (state) => {
  return state.otpLogin;
};

export const getCitizen = (state) => {
  return state.citizen;
};

export const getCitizenError = (state) => {
  return state.citizenError;
};

export const getCitizenEmail = (state, getters) => {
  let citizen = getters["getCitizen"];
  return citizen?.email;
};

export const getCitizenPhoneNumber = (state, getters) => {
  let citizen = getters["getCitizen"];
  return citizen?.telefonoRecapito;
};

export const getCitizenPhoneNumberVerified = (state, getters) => {
  let citizen = getters["getCitizen"];
  return citizen?.contattoValidato?.telefonoValidato;
};

export const getCitizenPhoneNumberPrefixVerified = (state, getters) => {
  let citizen = getters["getCitizen"];
  return citizen?.prefissoInternazionale;
};

export const mustConfirmContacts = (state, getters) => {
  let citizen = getters["getCitizen"];
  let verified = citizen?.contattoValidato;
  // return !verified || verified.fonteValidazione === config.covid.contactValidatorTypeMap.OPERATOR

  // se non ha l'email ed il prefisso internazionale è diverso da quello italiano
  // => chiediamo di aggiornare i contatti affinché inserisca la mail
  let isMailMandatory =
    !citizen?.email &&
    (!citizen?.prefissoInternazionale ||
      citizen?.prefissoInternazionale?.prefix !== "+39");

  return (
    !verified ||
    verified?.fonteValidazione === CONTACT_VALIDATOR_TYPE_MAP.OPERATOR ||
    isMailMandatory
  );
};

export const getDocumentInfoList = (state) => {
  return state.documentInfoList;
};

export const getUserApplicationsList = (state) => {
  return state.userApplicationsList ?? [];
};

// Permette di ottenere le associazioni utente-applicazione , dato un id applicazione
export const userAppInfo = (state, getters) => {
  let appList = getters["getUserApplicationsList"];
  let workingApp = getters["getWorkingApp"];
  let appId = workingApp?.id;
  if (!appList) return undefined;
  return appList.find((app) => app.applicazione_id === appId);
};
