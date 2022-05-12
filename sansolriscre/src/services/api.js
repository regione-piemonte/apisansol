/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { httpAuth, httpPublic } from "src/boot/http";
import { getUri, customOpenUrl } from "src/services/utils";
import { openURL } from 'quasar'


export const getUser = (httpConfig = {}) => {
  return httpAuth.get("bff/identity", httpConfig);
};

export const getConfig = (httpConfig = {}) => {
  return httpPublic.get("/lms/api/v1/configurazione", httpConfig);
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

export const getScreeningCarriedOut = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/screening`;
  return httpAuth.get(url, httpConfig);
};
export const hideShowExamination = (taxCode, httpConfig = {}, params) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/oscuramento`;
  return httpAuth.put(url, httpConfig, params);
};

export const getConsent = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consenso`;
  return httpAuth.get(url, httpConfig);
};

export const createAudit = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/audit`;
  payload = payload || {codice_verticale: "FSEPREV"};
  return httpAuth.post(url, payload, httpConfig);
};

export const saveDoNotAskMeAgain2 = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/consultazione-preferenze`;
  return httpAuth.put(url, httpConfig);
};


//API VERTICALE

// Informazioni utente assistito
export const getUserRiscreInfo = async (cf, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}`;
  return httpAuth.get(URL, httpConfig);
};

// Ultimo appuntamento citologico
export const getCytologicalAppointment = async (cf, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/appuntamento-citologico`;
  return httpAuth.get(URL, httpConfig);
};

// Ultimo appuntamento mammografico
export const getMammographicAppointment = async (cf, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/appuntamento-mammografico`;
  return httpAuth.get(URL, httpConfig);
};

// Dettaglio appuntamento
export const getAppointmentDetails = async (cf, type_id, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/appuntamento/${type_id}`;
  return httpAuth.get(URL, httpConfig);
};

// Elenco date disponibili di un appuntamento
export const getAvailableDates = async (agenda_id, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/agende/${agenda_id}/date-disponibili`;
  return httpAuth.get(URL, httpConfig);
};

// Elenco orari disponibili di un appuntamento
export const getAvailableHours = async (agenda_id, date, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/agende/${agenda_id}/date-disponibili/${date}/orari-disponibili`;
  return httpAuth.get(URL, httpConfig);
};

// Elenco strutture
export const getFacilities = async (httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/strutture`;
  return httpAuth.get(URL, httpConfig);
};

// Sesso cittadino
export const getSex = async (cf, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/sesso`;
  return httpAuth.get(URL, httpConfig);
};

// Elenco unità operative
export const getOperatingUnitsList = async (httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/unita-operative`;
  return httpAuth.get(URL, httpConfig);
};

// Dettaglio unità operativa
export const getOperatingUnitDetail = async (id, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/unita-operative/${id}`;
  return httpAuth.get(URL, httpConfig);
};

// Permette di modificare contatti cittadino
export const setNewUserContacts = async (cf, data, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/contatti`;
  return httpAuth.put(URL, data, httpConfig);
};

// Permette di modificare indirizzo nei contatti
export const setNewUserAddress = async (cf, data, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/luogo`;
  return httpAuth.put(URL, data, httpConfig);
};

// Prenotabilità nuovo appuntamento
export const appointmentAllowedOperations = async (cf, type_id, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/appuntamento/${type_id}/operazioni-consentite`;
  return httpAuth.get(URL, httpConfig);
};

// Crea nuovo appuntamento
export const createNewAppointment = async (cf, data, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/appuntamento`;
  return httpAuth.post(URL, data, httpConfig);
};

// Modifica appuntamento
export const changeAppointment = async (cf, type_id, data, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/appuntamento/${type_id}`;
  return httpAuth.put(URL, data, httpConfig);
};

// Lista documenti
export const getNoticesList = async (cf, httpConfig = {}) => {
  const URL = `/apisanscreen/api/v1/cittadini/${cf}/documenti`;
  return httpAuth.get(URL, httpConfig);
};

// Dettaglio documento
export const getNoticesDocument = async (cf, id, httpConfig = {}) => {


  let url =getUri({
    url: `${httpAuth.defaults.baseURL}/apisanscreen/api/v1/cittadini/${cf}/documenti/${id}`,
    ...httpConfig
  });

  openURL(url);
  return url
};

export const geocoding = async (httpConfig = {}) => {
  const URL = `/apisancross/api/v1/indirizzi/_search`;
  return httpAuth.get(URL, httpConfig);
};

export const getCities = async (httpConfig = {}) => {
  const URL = `/apisancross/api/v1/comuni`;
  return httpAuth.get(URL, httpConfig);
};

export const downloadICalendar = (httpConfig = {}) => {
  let url = httpAuth.getUri({
    url: `${httpAuth.defaults.baseURL}/lms/api/v1/icalendar/download`,
    ...httpConfig
  });
  customOpenUrl(url);
};
