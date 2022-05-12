/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {Notify} from "quasar-framework";

export const isResponseError = (response) => {
  return response instanceof Error
}

// Un errore ha la proprietà "response" quando:
// The request was made and the server responded with a status code
// that falls out of the range of 2xx
export const errorHasResponse = (response) => {
  return isResponseError(response) && !!response.response
}

// Un errore contiene la proprietà "request" quando:
// The request was made but no response was received
// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
// http.ClientRequest in node.js
export const responseHasRequest = (response) => {
  return isResponseError(response) && !!response.request
}

export const getRequest = (response) => {
  if (responseHasRequest(response)) return response.request
}

export const getRequestConfig = (response) => {
  return response.config
}

export const getRequestHeaders = (response) => {
  let config = getRequestConfig(response)
  return config.headers
}


export const getRequestMethod = response => {
  let config = getRequestConfig(response)
  return config.method
}

export const getResponseHeaders = (response) => {
  if (!isResponseError(response)) return response.headers
}

export const getResponseStatusCode = (response) => {
  if (!isResponseError(response)) return response.status
  if (errorHasResponse(response)) return response.response.status
}

export const getResponseStatusText = (response) => {
  if (!isResponseError(response)) return response.statusText
  if (errorHasResponse(response)) return response.response.statusText
}

export const getResponseData = (response) => {
  if (!isResponseError(response)) return response.data
}

export const isStatusIn = (response, lowerBound, upperBound) => {
  let status = getResponseStatusCode(response)
  return !!status && status >= lowerBound && status <= upperBound
}

export const is2XX = response => isStatusIn(response, 200, 299)
export const is3XX = response => isStatusIn(response, 300, 399)
export const is4XX = response => isStatusIn(response, 400, 499)
export const is5XX = response => isStatusIn(response, 500, 599)
export const isClientError = response => is4XX(response)
export const isServerError = response => is5XX(response)


export const notifySuccess = (message) => {
  Notify.create({
    type: 'positive',
    message
  })
};

/**
 * Un metodo standard per notificare all'utente l'errore
 *
 * @param error
 * @param message
 */
export const notifyError = (error, message) => {
  console.error(error)

  let code = getResponseStatusCode(error)
  let _message = code ? `[${code}] ${message}` : message

  Notify.create({
    color: 'negative',
    message: _message
  })
}

export const notifyErrorCsi = (error, message, prop = 'code') => {
  let data

  if (errorHasResponse(error)) data = getResponseData(error.response)
  if (data && data[prop]) message = data[prop]

  notifyError(error, message)
}

/**
 * Permette di ottenere il titolo dall'errore standard restituite dalle API CSI
 * @param error
 * @returns {*}
 */
export const getCsiErrorTitle = (error) => {
  let data
  if (errorHasResponse(error)) data = getResponseData(error.response)
  if (data) return data.title
}


/**
 * Permette di ottenere il dettaglio dell'errore standard restituito dalle API CSI
 * @param error
 */
export const getCsiErrorDetail = (error) => {
  let result = {}
  let data
  if (errorHasResponse(error)) data = getResponseData(error.response)
  if (data) result = data.detail || {}
  return result
}

/**
 * Permette di ottenere il primo messaggio di errore nel detail dell'errore standard restituito dalle API CSI
 * @param error
 * @returns {{value: *, key: *}}
 */
export const getCsiErrorDetailFirst = (error) => {
  let detail = getCsiErrorDetail(error)
  let keys = Object.keys(detail)
  // Se esiste un dettaglio => Stampiamo il primo messaggio
  if (keys.length > 0) return {key: keys[0], value: detail[keys[0]]}
}

