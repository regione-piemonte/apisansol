/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import axios from 'axios'
import store from "@store";
import {config} from "plugins/config";
import mocks from '@mocks';
import {deepClone} from "@services/global/utils";
import {errorHasResponse, is4XX, is5XX, isStatusIn, responseHasRequest} from "@services/api/utils";
import {Notify, SessionStorage} from 'quasar'
import {login} from "@services/global/session";
import router from "@router";
import {routes} from "@plugins/routes";
import {uid, Platform} from 'quasar'

// Configurazione di base di axios che sarà poi usara internamente da ogni servizio per le API
let axiosConfig = {baseURL: config.global.envs.API_BASE_URL};
let axiosPublicConfig = {baseURL: config.global.envs.API_PUBLIC_BASE_URL};


// Se siamo in modalità 'development' aggiungiamo degli header e dei parametri nella query string
// per poter debuggare lato server
if (config.global.isDevelopment) {
  axiosConfig.withCredentials = true;
  axiosPublicConfig.withCredentials = true;
}

let axiosInstance = axios.create(axiosConfig);
let axiosPublicInstance = axios.create(axiosPublicConfig);



handleSessionTimeOut(axiosInstance)
handleSessionTimeOut(axiosPublicInstance)

handleErrors(axiosInstance)
handleErrors(axiosPublicInstance)

addMock(axiosInstance)
addMock(axiosPublicInstance)

addIdRequestAndVersion(axiosInstance)
addIdRequestAndVersion(axiosPublicInstance)


if (config.global.areMocksEnabled) {
  console.debug('[Axios] Enabling mocks')
  mocks(axiosInstance);
  mocks(axiosPublicInstance);
}

// Esportiamo l'istanza creata e iniettiamole nel prototipo Vue così da poterlo usare `this.$axios`
export {axiosInstance, axiosPublicInstance};
export default ({Vue}) => {
  Vue.prototype.$axios = axiosInstance;
  Vue.prototype.$axiosPublic = axiosPublicInstance;
}


function getTheVersion() {
  return config.global.version
}


function addIdRequestAndVersion(instance) {
  instance.interceptors.request.use(
    config => {
      if (!config._noRequestId) config.headers['X-Request-Id'] = uid()
      if (!config._noFrontEndVersion) config.headers['X-Front-End-Version'] = getTheVersion()
      config.headers['X-Front-End-Page'] = window.location.href;

      let route = router.currentRoute;
      let routeName = route && route.name;
      let appCode = route && route.meta && route.meta.appServiceCode;

      if (routeName) config.headers['X-Front-End-Route'] = routeName;
      if (appCode) config.headers['X-Front-End-Application'] = appCode;

      return config;
    })
}

function addPlatformInfo(instance) {
  instance.interceptors.request.use(
    config => {
      if (config._noPlatformInfo) return config

      config.headers['X-Front-End-Os-Name'] = Platform.is.platform
      config.headers['X-Front-End-Browser-Name'] = Platform.is.name
      config.headers['X-Front-End-Browser-Version'] = Platform.is.versionNumber
      return config;
    })
}

function addMock(instance) {
  instance.interceptors.request.use(
    cfg => {
      let mockableServicesCodes = SessionStorage.get.item('preferenceOfMocks') || []
      let mockedServices = config.global.mockableServices.filter(s => mockableServicesCodes.includes(s.code))
      if (mockedServices.some(s => cfg.url.includes(s.apiPath))) cfg.headers['PARAM'] = true
      return cfg;
    },
  );
}





function handleErrors(instance) {

  function on4XXError(error) {
    let message = 'Errore del client'
    if (isStatusIn(error, 400, 400)) message = `Oops, si è verificato un errore nell'app`
    if (isStatusIn(error, 401, 401)) message = 'Non sei autenticato, prova ad effettuare nuovamente il login'
    if (isStatusIn(error, 403, 403)) message = 'Potresti non avere i permessi per compiere questa operazione'
    if (isStatusIn(error, 404, 404)) message = 'Non abbiamo trovato quello che cercavi'

    Notify.create({
      color: 'warning',
      message,
      position: 'bottom-left',
      timeout: 0,
      closeBtn: true,
    })
  }

  function on5XXError(error) {
    let name = routes.ERRORS.ERROR_500.name
    let params = {error}
    router.push({name, params})

  }


  function onUnknownError(error) {
    console.error("Request:", error.request);

    Notify.create({
      color: 'warning',
      message: 'Errore sconosciuto',
      position: 'bottom-left',
      timeout: 0,
      closeBtn: true,
    })
  }


  // Questo errore è solitamente un errore di programmazione
  // es. "cannot read ABC of undefined" e similari
  function onRequestGenerationError(error) {
    Notify.create({
      color: 'warning',
      message: 'Errore del client',
      position: 'bottom-left',
      timeout: 0,
      closeBtn: true,
    })
  }


  instance.interceptors.response.use(
    response => response,
    error => {

      if (errorHasResponse(error)) {
        // if (is4XX(error)) on4XXError(error)
        if (is5XX(error)) {

          if (!error.config._no5XXRedirect)
            on5XXError(error)
        }


      } else if (responseHasRequest(error)) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // onUnknownError(error)

      } else {
        // Something happened in setting up the request that triggered an Error
        // onRequestGenerationError(error)
      }

      return Promise.reject(error);
    }
  );
}


function handleSessionTimeOut(instance) {
  instance.interceptors.response.use(
    response => response,
    error => {

      if (!errorHasResponse(error) && responseHasRequest(error)) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.debug("[Interceptor] Detected unknown error:", {error});

        if (!error.config.url.includes('IDENTITY_URL')) {
          console.debug("[Interceptor] Session timeout => redirect to login")
          login()
          return
        }
      }

      console.debug("[Interceptor] It's ok, we use this error as app logic")
      return Promise.reject(error);
    }
  )
}

