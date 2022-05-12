/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance, axiosPublicInstance} from "@plugins/axios";
import {config} from "@plugins/config";
import {getUri, openUrl} from "@services/global/utils";
import {SessionStorage} from 'quasar'
import store from "@store";
import {normalizeLoccsiPlaces} from "@services/api/cross";
const BASE_PATH = config.global.basePaths.changeDoctor;


// Permette di ottenere la giusta istanza axios in base allo stato della login
// Cioè se l'utente è loggato allora tutte le sue chiamate passano per l'istanza autenticata
// altrimenti passano per l'istanza anonima
const getAxiosInstance = () => {
  return store.getters['global/isUserLogged'] ? axiosInstance : axiosPublicInstance
};


// CHIAMATE YAML
// ---------------------------------------------------------------------------------------------------------------------

// Informazioni utente assistito
export const getUserInfo = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/info`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};

// Dettaglio medico
export const getDoctorDetails = async (id, config = {}) => {
  const URL = `${BASE_PATH}/medici/${id}`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};

// Lista delle associazione per ogni medico
export const getAssociationsList= async (id, config = {}) => {
  const URL = `${BASE_PATH}/medici/${id}/associazioni`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};

// Disponibilità per i medici
export const doctorsAvailability= async (data, config = {}) => {
  const URL = `${BASE_PATH}/disponibilita`;
  let axios = getAxiosInstance();
  return axios.post(URL, data, config)
};

//Elenco medici monitorati
export const getMonitoredDoctors = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/medici-monitorati`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};

// Permette di monitorare un medico
export const postMonitoredDoctor = async (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/medici-monitorati`;
  let axios = getAxiosInstance();
  return axios.post(URL, data, config)
};

// Permette di annullare il monitorraggi di un medico medico
export const deleteMonitoring = async (cf, id_medico, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/medici-monitorati/${id_medico}`;
  let axios = getAxiosInstance();
  return axios.delete(URL, config)
};

// Permette di revocare un medico
export const revokeDoctor = async (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/revoca-medico`;
  let axios = getAxiosInstance();
  return axios.post(URL, data, config)
};

// Permette di revocare un medico (solo in prod)
export const revokeDoctorDelete = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/medico`;
  let axios = getAxiosInstance();
  return axios.delete(URL, config)
};

// Permette di revocare l'assistenza
export const revokeAssistance = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/assistenza`;
  let axios = getAxiosInstance();
  return axios.delete(URL, config)
};


// Permette di avere la lista dei medici
export const doctorsListResults = async (config = {}) => {
  const URL = `${BASE_PATH}/medici`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};


// Permette di avere la lista degli ambulatori
export const doctorsOfficesListResults = async (config = {}) => {
  const URL = `${BASE_PATH}/ambulatori`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};


// Permette di avere la lista suggest medici
export const getSuggestDoctors = async (config = {}) => {
  const URL = `${BASE_PATH}/medici/_search`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};

// Permette di avere la lista di tipologie dei medici
export const getDoctorsTypes = async (config = {}) => {
  const URL = `${BASE_PATH}/tipologie-medico`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};


// Permette di avere la lista suggest cittadinanze
export const getNationalities = async (config = {}) => {
  const URL = `${BASE_PATH}/cittadinanze`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};

// Permette di avere il controllo combinazioni
export const combinationControl = async (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/controllo-combinazione`;
  let axios = getAxiosInstance();
  return axios.post(URL, data, config)
};

// Permette di avere la lista delle motivazioni di soggiorno
export const getStayMotivation = async (config = {}) => {
  const URL = `${BASE_PATH}/motivazioni-soggiorno`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};

// Permette di avere la lista delle motivazioni di domicilio
export const getDomicileMotivation = async (config = {}) => {
  const URL = `${BASE_PATH}/motivazioni-domicilio`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)
};

// Permette di inviare una richiesta cambio medico
export const newChangeDoctorRequest = async (cf, doctor_id, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/cambio-medico/${doctor_id}/richiesta`;
  let axios = getAxiosInstance();
  return axios.post(URL, data, config)
};

// Permette di cancellare una richiesta cambio medico
export const deleteRequest = async (cf, request_id, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/info/richiesta_cambio/${request_id}`;
  let axios = getAxiosInstance();
  return axios.delete(URL, config)
};

// Permette di rettificare una richiesta cambio medico
export const requestCorrection = async (cf, request_id, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/cambio-medico/richiesta/${request_id}/rettifica`;
  let axios = getAxiosInstance();
  return axios.post(URL, data, config)
};


// Permette di ricevere la lista degli allegati richiesti
export const attachmentControl = async (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/controllo-allegati`;
  let axios = getAxiosInstance();
  return axios.post(URL, data, config)
};

// disclaimer informativa
export const getDisclaimer = async ( config = {}) => {
  const URL = `${BASE_PATH}/disclaimer`;
  let axios = getAxiosInstance();
  return axios.get(URL, config)

};

/**
 * Permette di scaricare il PDF del certificato della revoca
 *
 * @param cf - Il codice fiscale dell'utente intestatario
 * @param config - La configurazione Axios
 * @param ajax - Booleano che indica se effettuare una chiamata ajax o una redirect per la chiamata HTTP
 * @returns {string} - La url costruita
 */
export const getRevokeCertificatePdf = (cf, config = {}, ajax = false) => {

  let axios = getAxiosInstance();
  let url = `${BASE_PATH}/cittadini/${cf}/certificato-revoca/pdf`;
  let uri = `${axios.defaults.baseURL}${url}`;

  if (ajax) {
    return axios.get(url, config)
  }

  let cfg = {url: uri, ...config};
  uri = getUri(cfg);

  openUrl(uri);
  return uri
};

/**
 * Permette di scaricare il PDF del tesserino medico
 *
 * @param cf - Il codice fiscale dell'utente intestatario
 * @param config - La configurazione Axios
 * @param ajax - Booleano che indica se effettuare una chiamata ajax o una redirect per la chiamata HTTP
 * @returns {string} - La url costruita
 */
export const getMedicalCardPdf = (cf, config = {}, ajax = false) => {

  let axios = getAxiosInstance();
  let url = `${BASE_PATH}/cittadini/${cf}/tesserino-medico/pdf`;
  let uri = `${axios.defaults.baseURL}${url}`;

  if (ajax) {
    return axios.get(url, config)
  }

  let cfg = {url: uri, ...config};
  uri = getUri(cfg);

  openUrl(uri);
  return uri
};

// Permette di scaricare il pdf della richiesta cambio medico
export const getRequestPdf = async (cf, request_id, config = {}, ajax = false) => {

  let axios = getAxiosInstance();
  const url = `${BASE_PATH}/cittadini/${cf}/cambio-medico/richiesta/${request_id}/pdf`;
  let uri = `${axios.defaults.baseURL}${url}`;

  if (ajax) {
    return axios.get(url, config)
  }
  let cfg = {url: uri, ...config};
  uri = getUri(cfg);

  openUrl(uri);
  return uri
};


// Permette di scaricare il pdf degli allegati della richiesta
export const getAttachment = async (cf, attachment_id, config = {}, ajax = false) => {

  let axios = getAxiosInstance();
  const url = `${BASE_PATH}/cittadini/${cf}/allegato/${attachment_id}`;
  let uri = `${axios.defaults.baseURL}${url}`;

  if (ajax) {
    return axios.get(url, config)
  }
  let cfg = {url: uri, ...config};
  uri = getUri(cfg);

  openUrl(uri);
  return uri
};


// Permette di scaricare il pdf con il modulo del delegante

// Da modificare per renderlo compatibile su safari e IE
export const delegationFormPdf = async (cf, data, config = {}) => {
  const url = `${BASE_PATH}/cittadini/${cf}/modulo-delegante/pdf`;
  let axios = getAxiosInstance();

  return axios.post(url, data, config)

};



