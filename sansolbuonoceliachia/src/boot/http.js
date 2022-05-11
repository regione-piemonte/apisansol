/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import axios from "axios";
import {apiInterceptorRequestId, handleSessionTimeOut} from "src/services/utils";

export const httpAuth = axios.create({
  baseURL: process.env.APP_API_BASE_URL_AUTH
});

export const httpPublic = axios.create({
  baseURL: process.env.APP_API_BASE_URL_PUBLIC
});



[httpAuth, httpPublic].forEach(http => apiInterceptorRequestId(http));
[httpAuth, httpPublic].forEach(http => handleSessionTimeOut(http));


