/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { httpAuth, httpPublic } from "src/boot/http";

export const getUser = (httpConfig = {}) => {
  return httpAuth.get("/bff/identity", httpConfig);
};

export const getConfig = (httpConfig = {}) => {
  return httpPublic.get("/lms/api/v1/configurazione", httpConfig);
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

//CROSS
// ---------------------------------------------------------------------------------------------------------------------
// Permette di avere la lista suggest indirizzi
export const getSuggestedAddress = async (httpConfig = {}) => {
  const URL = `/apisancross/api/v1/indirizzi/_search`;
  return httpPublic.get(URL, httpConfig);
};

// Permette di avere la lista delle fermate vicine a una struttura
export const getBusStopList = async (httpConfig = {}) => {
  const URL = `/apisancross/api/v1/mezzi-pubblici/fermate`;
  return httpPublic.get(URL, httpConfig);
};

// Permette di avere la lista delle linee di autobus data una fermata
export const getBusLines = async (id, httpConfig = {}) => {
  const URL = `/apisancross/api/v1/mezzi-pubblici/fermate/${id}`;
  return httpPublic.get(URL, httpConfig);
};

// Permette di avere i passaggia di una data linea di autobus
export const getBusTimeTables = async (id, idBusLine,  httpConfig = {}) => {
  const URL = `/apisancross/api/v1/mezzi-pubblici/fermate/${id}/linee/${idBusLine}`;
  return httpPublic.get(URL, httpConfig);
};


//MEDICI E PEDIATRI
// ---------------------------------------------------------------------------------------------------------------------
// Permette di avere la lista di tipologie dei medici
export const getDoctorsTypes = (httpConfig = {}) => {
  const url = `/apisanscerev/api/v1/tipologie-medico`;
  return httpPublic.get(url, httpConfig);
};

// Permette di avere la lista suggest medici
export const getSuggestDoctors = async (httpConfig = {}) => {
  const url = `/apisanscerev/api/v1/medici/_search`;
  return httpPublic.get(url, httpConfig);
};

// Permette di avere la lista degli ambulatori
export const doctorsOfficesListResults = async (httpConfig = {}) => {
  const url = `/apisanscerev/api/v1/ambulatori`;
  return httpPublic.get(url, httpConfig);
};
// Dettaglio medico
export const getDoctorDetails = async (cf, httpConfig = {}) => {
  const url = `/apisanscerev/api/v1/medici/${cf}`;
  return httpPublic.get(url, httpConfig);
};

// Lista delle associazione per ogni medico
export const getAssociationsList= async (id, httpConfig = {}) => {
  const url = `/apisanscerev/api/v1/medici/${id}/associazioni`;
  return httpPublic.get(url, httpConfig);
};


//FARMACIE
// ---------------------------------------------------------------------------------------------------------------------
// Permette di avere la lista delle farmacie
export const getPharmacies = (httpConfig = {}) => {
  const url = `/apisantrovaun/api/v1/farmacie`;
  return httpPublic.get(url, httpConfig);
};

//STRUTTURE SANITARIE
// ---------------------------------------------------------------------------------------------------------------------
// Permette di avere la lista delle tipoliogie di assistenza
export const getHealthFacilitiesTypes = (httpConfig = {}) => {
  const url = `/apisantrovaun/api/v1/tipologie-assistenza`;
  return httpPublic.get(url, httpConfig);
};

// Permette di avere la lista delle strutture sanitarie
export const getHealthFacilities = (httpConfig = {}) => {
  const url = `/apisantrovaun/api/v1/strutture-sanitarie`;
  return httpPublic.get(url, httpConfig);
};

//OSPEDALI
// ---------------------------------------------------------------------------------------------------------------------
// Permette di avere la lista delle tipologie di ospedali
export const getHospitalsTypes = (httpConfig = {}) => {
  const url = `/apisantrovaun/api/v1/tipologie-ospedale`;
  return httpPublic.get(url, httpConfig);
};
// Permette di avere la lista degli ospedali
export const getHospitals = (httpConfig = {}) => {
  const url = `/apisantrovaun/api/v1/ospedali`;
  return httpPublic.get(url, httpConfig);
};

//CELIACHIA
// ---------------------------------------------------------------------------------------------------------------------
export const getCeliacStoresTypes = (httpConfig = {}) => {
  const url = `/apisantrovaun/api/v1/tipologie-punto-vendita`;
  return httpPublic.get(url, httpConfig);
};

export const getCeliacStores = (httpConfig = {}) => {
  const url = `/apisantrovaun/api/v1/punti-vendita-celiachia`;
  return httpPublic.get(url, httpConfig);
};
