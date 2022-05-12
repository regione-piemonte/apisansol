/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance, axiosPublicInstance} from "@plugins/axios";
import {config} from "@plugins/config";
import {getUri, openUrl} from "@services/global/utils";
import {SessionStorage} from 'quasar'
import store from "@store";
import {normalizeRefund} from "@services/health-payments/business-logic";

const BASE_PATH = config.global.basePaths.healthPayments
const FILTER_TO_PAY = {
  stato: {ci: '(000)'},
  pagato: {eq: 0},
  da_pagare: {gt: 0},
}

const FILTER_PAYED = {
  pagato: {gt: 0},
  da_pagare: {eq: 0}
}

const FILTER_REFUNDABLE = {
  in_erogazione: {eq: 0},
  stato_ticket: {eq: 802},
  modalita_rimborso: {eq: 3}
}


// Permette di ottenere la giusta istanza axios in base allo stato della login
// Cioè se l'utente è loggato allora tutte le sue chiamate passano per l'istanza autenticata
// altrimenti passano per l'istanza anonima
const getAxiosInstance = () => {
  return store.getters['global/isUserLogged'] ? axiosInstance : axiosPublicInstance
}

// CHIAMATE TEMPORANEE
// ---------------------------------------------------------------------------------------------------------------------
export const getAsrTemp = async (config = {}) => {
  const URL = `${BASE_PATH}/asr-temp`
  let axios = getAxiosInstance()
  return axios.get(URL, config)
}


export const getReminderPrintableTemp = async (config = {}) => {
  const URL = `${BASE_PATH}/promemoria-stampabili`
  let axios = getAxiosInstance()
  return axios.get(URL, config)
}


export const getCaptchaTemp = async (token, config = {}) => {
  const URL = `${BASE_PATH}/captcha-temp`

  if (!config) config = {}
  if (!config.params) config.params = {}
  config.params = {...config.params, captcha_token: token}

  let axios = getAxiosInstance()
  return axios.get(URL, config)
}


// CHIAMATE YAML
// ---------------------------------------------------------------------------------------------------------------------
export const getAsr = async (config = {}) => {
  const URL = `${BASE_PATH}/asr`
  let axios = getAxiosInstance()
  return axios.get(URL, config)
}


export const postHealthPayments = async (data, config = {}) => {
  const URL = `${BASE_PATH}/pagamento`
  let axios = getAxiosInstance()
  return axios.post(URL, data, config)
}


export const postHealthPaymentVoluntary = async (data, config = {}) => {
  const URL = `${BASE_PATH}/pagamento-spontaneo`

  // Dal momento che le API non sono in grado di dirci si il pagamento appena effettuato è stato fatto con
  // psp o pos, siamo costretti a salvarlo nel local storage per poter discriminare
  //
  // Inoltre il pagamento spontaneo può essere fatto solo tramite PSP, quindi impostiamo il valore sempre a True
  SessionStorage.set('healthPayments.isPspPayment', true)

  let axios = getAxiosInstance()
  return axios.post(URL, data, config)
}


/**
 * Permette di ottenre TUTTI i pagamenti sanitari di un cittadino
 *
 * @param cf - Il codice fiscale del cittadino
 * @param config - La configurazione Axios
 * @returns {Promise<*>} - La risposta Axios
 */
export const getHealthPayments = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/utenti/${cf}/pagamenti-sanitari`
  let axios = getAxiosInstance()
  return axios.get(URL, config)
}


/**
 * Permette di ottenere la lista dei pagamenti sanitari DA PAGARE di un cittadino
 *
 * @param cf - Il codice fiscale del cittadino intestatario dei pagamenti sanitari
 * @param config - La configurazione Axios
 * @returns {Promise<*>} - La risposta Axios
 */
export const getHealthPaymentsToPay = (cf, config = {}) => {
  if (!config.params) config.params = {}
  if (!config.params.filter) config.filter = {}
  config.params.filter = {...FILTER_TO_PAY, ...config.params.filter}
  return getHealthPayments(cf, config)
}


/**
 * Permette di ottenere il singolo pagamento sanitario partendo dal numero pratica regionale
 *
 * @param cf - Il codice fiscale dell'intestatario del pagamento sanitario
 * @param npr - Il Numero Pratica Regionale da cercare
 * @param config - La configurazione della richeista Axios
 * @returns {Promise} - La risposta Axios
 */
export const getHealthPayment = (cf, npr, config = {}) => {
  const URL = `${BASE_PATH}/utenti/${cf}/pagamenti-sanitari/${npr}`
  let axios = getAxiosInstance()
  return axios.get(URL, config)
}


/**
 * Se la ricerca effettuata è per RICETTA => effettuiamo la chiamata per la lista di pagamenti ed impostiamo il filtro per NRE
 * Se la ricerca effettuata è per PRATICA => dobbiamo distinguqere tra due casistiche:
 *    Il numero di ricetta è lungo 27 caratteri => si tratta di NPR (Numero Pratica Regionale) ed usiamo il filtro di NPR
 *    Il numero di ricetta non è lungo 27 caratteri => si tratta di NPA (Numero Pratica Asr) ed usiamo il filtro per NPA + id_asr
 *
 * @param cf - Il codice fiscale dell'intestatario del pagamento sanitario
 * @param type - Il tipo di ricerca (pratica o ricetta)
 * @param number - Il numero da cercare
 * @param id_asr - L'id dell'asr che ha generato il pagamento sanitario
 * @param toPay - Se cercare solo tra i ticket da pagare o meno
 * @param token
 * @param requestConfig - La configurazione Axios
 * @returns {Promise<*>} - Promise Axios
 */
export const searchHealthPayments = (cf, type, number, id_asr = null, toPay = false, token = null, requestConfig = {}) => {


  let isReceipt = type === config.healthPayments.procedureTypes.RICETTA
  if (!requestConfig.params) requestConfig.params = {}
  if (!requestConfig.params.filter) requestConfig.params.filter = {}

  // Se vogliamo cercare solo tra i ticket da pagare => dobbiamo aggiungere il filtro
  if (toPay) requestConfig.params.filter = {...FILTER_TO_PAY, ...requestConfig.params.filter}
  if (token) requestConfig.params = {...requestConfig.params, captcha_token: token}


  if (isReceipt) {
    // Se si tratta di una ricetta => ci basta inserire il filtro per NRE
    requestConfig.params.filter.nre = {eq: number}
    return getHealthPayments(cf, requestConfig)
  }

  // Se si tratta di una pratica => dobbiamo distinguere tra ricerca per numero pratica regionale e ricerca per numero pratica asr
  let isNpr = number.length === 27

  // Se si tratta di NPR => dobbiamo usare lo shortcut
  if (isNpr) return getHealthPayment(cf, number, requestConfig)

  // Se non si tratta di NPR assumiamo che sia un NPA => impostiamo il filtro per NPA e per id_asr
  requestConfig.params.filter.numero_pratica_asr = {eq: number}
  requestConfig.params.filter.id_asr = {eq: id_asr}
  return getHealthPayments(cf, requestConfig)
}


/**
 * Permette di scaricare il PDF della ricevuta
 *
 * @param cf - Il codice fiscale dell'utente intestatario della ricevuta
 * @param config - La configurazione Axios
 * @param ajax - Booleano che indica se effettuare una chiamata ajax o una redirect per la chiamata HTTP
 * @returns {string} - La url costruita
 */
export const getHealthPaymentsReceiptPdf = (cf, config = {}, ajax = false) => {

  let axios = getAxiosInstance()
  let url = `${BASE_PATH}/utenti/${cf}/ricevute-pagamenti-sanitari`
  let uri = `${axios.defaults.baseURL}${url}`

  if (ajax) {
    return axios.get(url, config)
  }

  let cfg = {url: uri, ...config}
  uri = getUri(cfg)

  openUrl(uri)
  return uri
}


/**
 * Permette di scaricare il PDF del fac-simile della ricevuta (il mandato pagamento) che viene restituito in caso di
 * pagamento psp (PagoPA)
 *
 * @param id - l'Id del mandato di pagamento
 * @param config - La configurazione Axios
 * @param ajax - Booleano che indica se effettuare una chiamata ajax o una redirect per la chiamata HTTP
 * @returns {string} - La url costruita
 */
export const getHealthPaymentsFacsimileReceiptPdf = (id, config = {}, ajax = false) => {

  let axios = getAxiosInstance()
  let url = `${BASE_PATH}/mandato-pagamento/${id}`
  let uri = `${axios.defaults.baseURL}${url}`

  if (ajax) {
    return axios.get(url, config)
  }

  let cfg = {url: uri, ...config}
  uri = getUri(cfg)

  openUrl(uri)
  return uri
}


/**
 * Permette di scaricare il PDF del promemoria di pagamento
 *
 * @param cf - Il codice fiscale dell'utente intestatario della ricevuta
 * @param config - La configurazione Axios
 * @returns {string} - La url costruita
 */
export const getHealthPaymentsReminderPdf = (cf, npr, config = {}) => {

  let axios = getAxiosInstance()
  let url = `${axios.defaults.baseURL}${BASE_PATH}/utenti/${cf}/avviso-pagamento/${npr}`

  let cfg = {url, ...config}
  url = getUri(cfg)

  openUrl(url)
  return url
}


export const postReceipt = async (transactionId, data, config = {}) => {
  const URL = `${BASE_PATH}/pagamento/${transactionId}/ricevuta`
  let axios = getAxiosInstance()
  return axios.post(URL, data, config)
}


export const getRefundList = async (cf, httpConfig = {}) => {
  const URL = `${BASE_PATH}/utenti/${cf}/rimborsi`
  let axios = getAxiosInstance()
  return axios.get(URL, httpConfig)
}

// Carica l'elenco dei rimborsi a disposizione per un codice fiscale
// Inoltre normalizza la struttura dati per renderla più fruibile
export const getRefundRefundableList = async (cf, httpConfig = {}) => {
  if (!httpConfig.params) httpConfig.params = {}
  if (!httpConfig.params.filter) httpConfig.filter = {}
  httpConfig.params.filter = {...FILTER_REFUNDABLE, ...httpConfig.params.filter}
  let response = await getRefundList(cf, httpConfig)
  response.data = response.data.map(r => normalizeRefund(r))
  return response
}

export const deliveryModeList = async (cf, httpConfig = {}) => {
  const URL = `${BASE_PATH}/modalita-erogazione-ammissibili`
  let axios = getAxiosInstance()
  return axios.get(URL, httpConfig)
}

export const updateTransactionDeliveryStatus = async (transactionId, payload, httpConfig = {}) => {
  const URL = `${BASE_PATH}/rimborsi/${transactionId}/stato-erogazione`;
  let axios = getAxiosInstance();
  return axios.put(URL, payload, httpConfig)
}

