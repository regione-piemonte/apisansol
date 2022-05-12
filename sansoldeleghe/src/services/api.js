/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { httpAuth, httpPublic } from "src/boot/http";
import {isDeclarationMinor, isDeclarationProtection} from "src/services/business-logic";

export const getUser = (httpConfig = {}) => {
  return httpAuth.get("/bff/identity", httpConfig);
};

export const getConfig = (httpConfig = {}) => {
  return httpPublic.get("/lms/api/v1/configurazione", httpConfig);
};


export const getDelegablesApp = (httpConfig = {}) => {
  const url = `/lms/api/v1/delegabili`;
  return httpPublic.get(url, httpConfig);
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

//CROSS
// ---------------------------------------------------------------------------------------------------------------------
export const getCities = (httpConfig = {}) => {
  const url = `/apisancross/api/v1/comuni`;
  return httpAuth.get(url, httpConfig);
};

export const getCountries = (httpConfig = {}) => {
  const url = `/apisancross/api/v1/nazioni`;
  return httpAuth.get(url, httpConfig);
};


//VERTICALE
// ---------------------------------------------------------------------------------------------------------------------

export const getDelegates = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/delegati`;
  return httpAuth.get(url, httpConfig);
};


export const saveDelegate = (taxCode, payload, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/delegati`;
  return httpAuth.post(url, payload, httpConfig);
};

export const getDelegators = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/deleganti`;
  return httpAuth.get(url, httpConfig);
};

// Rinuncia alla delega
export const waiveDelegation = (taxCode, delegatorCf, delegationId, payload = {}, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/deleganti/${delegatorCf}/servizi/${delegationId}`;
  return httpAuth.put(url, payload, httpConfig);
}

export const getDelegate = (userCf, delegateCf, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${userCf}/delegati/${delegateCf}`;
  return httpAuth.get(url, httpConfig);
};

// Modifica delle deleghe
export const editDelegate = (userCf, delegateCf, data, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${userCf}/delegati/${delegateCf}`;
  return httpAuth.put(url, data, httpConfig);
}

// Restituisce la lista di dichiarazioni
export const getDeclarations = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/dichiarazioni`
  return httpAuth.get(url, httpConfig)
}

// Restituisce la lista di dichiarazioni per i tutelati
export const getDeclarationMinorList = async (taxCode, httpConfig = {}) => {
  let response = await getDeclarations(taxCode, httpConfig);
  response.data = response.data.filter(d => isDeclarationMinor(d));
  return response;
};


export const getPiedmontSupport = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/assistito-piemontese`;
  return httpAuth.get(url, httpConfig)
}


// Permette di salvare una dichiarazione
export const saveDeclaration = (taxCode, data, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/dichiarazioni`
  return httpAuth.post(url, data, httpConfig)
}


export const getDeclaration = async (taxCode, id, httpConfig = {}) => {
  // const URL = `${BASE_PATH}/cittadini/${cf}/dichiarazioni/${id}`
  // return axiosInstance.get(URL, config)

  let response = await getDeclarations(taxCode, httpConfig)
  let result = response.data.find(d => d.uuid === id)
  if (!result) throw new Error(`Nessuna dichiarazione trovata per l'id ${id}`)
  response.data = result
  return response
}

export const updateDeclaration = (taxCode, id, data, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/dichiarazioni/${id}`
  return httpAuth.put(url, data, httpConfig)
}


// Restituisce la lista di dichiarazioni per i tutelati
export const getDeclarationProtectionList = async (taxCode, httpConfig = {}) => {
  let response = await getDeclarations(taxCode, httpConfig);
  response.data = response.data.filter(d => isDeclarationProtection(d));
  return response;
};
