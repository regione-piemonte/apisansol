/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import axios from "axios";
import {apiInterceptorRequestId, errorHasResponse, login, responseHasRequest} from "src/services/utils";

export const httpAuth = axios.create({
  baseURL: process.env.APP_API_BASE_URL_AUTH
});

export const httpPublic = axios.create({
  baseURL: process.env.APP_API_BASE_URL_PUBLIC
});

[httpAuth, httpPublic].forEach(http => apiInterceptorRequestId(http));

handleSessionTimeOut(httpAuth);
handleSessionTimeOut(httpPublic);

function handleSessionTimeOut(instance) {
  instance.interceptors.response.use(
    response => response,
    error => {
      if (!errorHasResponse(error) && responseHasRequest(error)) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.debug("[Interceptor] Detected unknown error:", {error});
        if (!error.config.url.includes('url')) {
          console.debug("[Interceptor] Session timeout => redirect to login")
          let loginUrl = "/login";
          let landingUrl = window.location.pathname;
          login(loginUrl,landingUrl)
          return
        }
      }

      console.debug("[Interceptor] It's ok, we use this error as app logic")
      return Promise.reject(error);
    }
  )
}

