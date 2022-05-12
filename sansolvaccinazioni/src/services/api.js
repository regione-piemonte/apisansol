/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { httpAuth, httpPublic } from "src/boot/http";
import { openURL } from "quasar";

// LMS
// ---------------------------------------------------------------------------------------------------------------------
export const getUser = (httpConfig = {}) => {
  return httpAuth.get("/bff/identity", httpConfig);
};

export const getConfig = (httpConfig = {}) => {
  return httpPublic.get("/lms/api/v1/configurazione", httpConfig);
};

export const sendOtp = (payload, httpConfig = {}) => {
  let url = `bff/otp`;
  return httpPublic.post(url, payload, httpConfig);
};

export const verifyOtp = (httpConfig = {}) => {
  let url = `bff/otp/verify`;
  return httpPublic.get(url, httpConfig);
};

export const getOtpSmsAttemptsLeft = (httpConfig = {}) => {
  let url = `bff/otp/channels/sms/attempts-left`;
  return httpPublic.get(url, httpConfig);
};

//BFF
//---------------------------------------------------------------------------------------------------
//BFF
//___________________

// Permette di avere la lista delle associazioni utente-applicazione
export const getUserApplicationsList = async (taxCode,httpConfig = {}) => {
  return httpAuth.get(`/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni`, httpConfig);
};


// Permette di gestiore le diverse associazioni utente-applicazione
export const setUserApplicationInformation = async (taxCode,appId, httpConfig = {}) => {
  const URL = `/lms/api/v1/cittadini/${taxCode}/informazioni-applicazioni/${appId}`;
  return  httpAuth.post(URL, httpConfig);
};


// CROSS
// ---------------------------------------------------------------------------------------------------------------------
export const getCityList = (httpConfig = {}) => {
  return httpPublic.get("/apisancross/api/v1/comuni", httpConfig);
};

// PROFILO
// ---------------------------------------------------------------------------------------------------------------------
export const getUserInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisanprof/api/v1/cittadini/${taxCode}/profilo`;
  return httpAuth.get(url, httpConfig);
};

// DELEGHE
// ---------------------------------------------------------------------------------------------------------------------
export const getDelegatorList = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/deleganti`;
  return httpAuth.get(url, httpConfig);
};

// NOTIFICATORE
// ---------------------------------------------------------------------------------------------------------------------
export const getNotifyMessages = (taxCode, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-lms`;
  return httpAuth.get(url, httpConfig);
};

export const getNotifyMessagesUnseen = (taxCode, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-unseen`;
  return httpAuth.get(url, httpConfig);
};

export const updateMessagesAsSeen = (taxCode, payload, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-unseen`;
  return httpAuth.put(url, payload, httpConfig);
};

export const deleteMessage = (taxCode, id, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages/${id}`;
  return httpAuth.delete(url, httpConfig);
};

export const getNotifyContacts = (taxCode, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/contacts`;
  return httpAuth.get(url, httpConfig);
};

export const updateNotifyContacts = (taxCode, payload, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/contacts`;
  return httpAuth.put(url, payload, httpConfig);
};

// FSE
// ---------------------------------------------------------------------------------------------------------------------
export const getEnrollmentInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/arruolamento`;
  return httpAuth.get(url, httpConfig);
};

export const saveDoNotAskMeAgain2 = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consultazione-preferenze`;
  return httpAuth.put(url, httpConfig);
};

// VACCINAZIONI
// ---------------------------------------------------------------------------------------------------------------------
export const getVaccinationUserInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}`;
  return httpAuth.get(url, httpConfig);
};

export const getVaccinationUserAddressTemp = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/contatti-temporanei`;
  return httpAuth.get(url, httpConfig);
};

export const updateVaccinationUserContacts = (
  taxCode,
  payload,
  httpConfig = {}
) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/contatti-vaccinazioni`;
  return httpAuth.put(url, payload, httpConfig);
};

export const updateVaccinationUserDomicile = (
  taxCode,
  payload,
  httpConfig = {}
) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/domicilio-vaccinazioni`;
  return httpAuth.put(url, payload, httpConfig);
};

export const getVaccinationCenterList = (httpConfig = {}) => {
  const url = `/apisanvac/api/v1/centri-vaccinali`;
  return httpAuth.get(url, httpConfig);
};

export const getVaccinationCenterDetail = (id, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/centri-vaccinali/${id}`;
  return httpAuth.get(url, httpConfig);
};

export const getVaccinationCenterFreeSlotList = (id, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/centri-vaccinali/${id}/periodi-liberi`;
  return httpAuth.get(url, httpConfig);
};

export const getAppointmentList = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/appuntamenti`;
  return httpAuth.get(url, httpConfig);
};

export const createAppointment = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/appuntamenti`;
  return httpAuth.post(url, payload, httpConfig);
};

export const createAppointmentRequest = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/appuntamenti/richiesta`;
  return httpAuth.post(url, payload, httpConfig);
};

export const getConvocationList = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/convocazioni`;
  return httpAuth.get(url, httpConfig);
};

export const getImmunizedList = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/immunizzate`;
  return httpAuth.get(url, httpConfig);
};

export const getAdministrationList = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/somministrazioni`;
  return httpAuth.get(url, httpConfig);
};

export const getReactionTypeList = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/autocontribuzioni/tipologie`;
  return httpAuth.get(url, httpConfig);
};

export const getReactionList = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/reazioni-avverse`;
  return httpAuth.get(url, httpConfig);
};

export const getVaccinationListFuture = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/vaccini-futuri`;
  return httpAuth.get(url, httpConfig);
};

export const getVaccinationListVoluntary = (taxCode, httpConfig = {}) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/volontarie`;
  return httpAuth.get(url, httpConfig);
};

export const getAppointmentUpdateRequestList = (
  taxCode,
  typeCode,
  httpConfig = {}
) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/istanze-modifica-prenotazione/${typeCode}`;
  return httpAuth.get(url, httpConfig);
};

export const getSelfContributionRequestList = (
  taxCode,
  typeCode,
  httpConfig = {}
) => {
  const url = `/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/istanze-autocontribuzione/${typeCode}`;
  return httpAuth.get(url, httpConfig);
};

export const downloadAppointmentReminderPdf = (
  taxCode,
  id,
  httpConfig = {}
) => {
  const url = httpAuth.getUri({
    url: `${httpAuth.defaults.baseURL}/apisanvac/api/v1/cittadini/${taxCode}/vaccinazioni/appuntamenti/${id}/promemoria`,
    ...httpConfig
  });

  openURL(url);
};

export const downloadCertificatePdf = (taxCode, httpConfig = {}) => {
  const url = httpAuth.getUri({
    url: `${httpAuth.defaults.baseURL}/apisanvac/api/v1/cittadini/${taxCode}/documenti/certificato/pdf`,
    ...httpConfig
  });

  openURL(url);
};

export const downloadDocumentPdf = (taxCode, id, httpConfig = {}) => {
  const url = httpAuth.getUri({
    url: `${httpAuth.defaults.baseURL}/apisanvac/api/v1/cittadini/${taxCode}/documenti/${id}/pdf`,
    ...httpConfig
  });

  openURL(url);
};

//lista motivi spostamento-revoca
export const getMotivationsList= async ( httpConfig = {}) => {
  const url = `/apisanvac/api/v1/motivazioni/revoca-spostamento`;
  return httpAuth.get(url, httpConfig);
};

//cancella appuntamento
export const removeAppointment = async (cf, id, payload, httpConfig = {}) => {
  const URL = `/apisanvac/api/v1/cittadini/${cf}/vaccinazioni/appuntamenti/${id}/revoca`;
  return httpAuth.post(URL, payload, httpConfig);
};

//rimuove appuntamento senza agenda
export const removeAppointmentRequest= async (cf, appuntamento_id, payload, httpConfig = {}) => {
  const URL = `/apisanvac/api/v1/cittadini/${cf}/vaccinazioni/appuntamenti/${appuntamento_id}/revoca/richiesta`;

  return httpAuth.post(URL, payload, httpConfig);
};

//stage 5 autocontribuzione
export const newContribution = async (cf, payload, httpConfig = {}) => {
  const URL = `/apisanvac/api/v1/cittadini/${cf}/vaccinazioni/autocontribuzioni`;

  return httpAuth.post(URL, payload, httpConfig);
};

export const getOmissionMotivations = async ( httpConfig = {}) => {
  const URL = `/apisanvac/api/v1/motivazioni/omissione`;

  return httpAuth.get(URL, httpConfig);
};

//motivi differimento
export const getDefermentMotivations = async ( httpConfig = {}) => {
  const URL = `/apisanvac/api/v1/motivazioni/differimento`;

  return httpAuth.get(URL, httpConfig);
};

//nuova reazione avversa
export const createReaction= async (cf, payload, httpConfig = {}) => {
  const URL = `/apisanvac/api/v1/cittadini/${cf}/reazione-avversa`;

  return httpAuth.post(URL, payload, httpConfig);
};

export const moveAppointmentAgenda = async (cf, appuntamento_id, payload, httpConfig = {} ) =>{
  const URL = `/apisanvac/api/v1/cittadini/${cf}/vaccinazioni/appuntamenti/${appuntamento_id}/spostamento`;
  return httpAuth.put(URL, payload, httpConfig);
} ;

export const moveAppointment = async (cf, id, payload, httpConfig = {}) => {
  const URL = `/apisanvac/api/v1//cittadini/${cf}/vaccinazioni/appuntamenti/${id}/spostamento/richiesta`;
  return httpAuth.post(URL, payload, httpConfig);
};



// PAGAMENTO TICKET
// ---------------------------------------------------------------------------------------------------------------------
export const getAsrListTemp = (httpConfig = {}) => {
  const url = `/apisanpag/api/v1/asr-temp`;
  return httpAuth.get(url, httpConfig);
};

//CROSS
export const getCities = (httpConfig = {}) => {
  const URL = `/apisancross/api/v1/comuni`;
  return httpAuth.get(URL, httpConfig);
};
