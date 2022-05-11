/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { Cookies } from "quasar";

const COOKIE_OPTIONS = { path: "/" };

export const getUserMockParams = () => {
  let taxCode = Cookies.get("param");
  let lastName = Cookies.get("param");
  let firstName = Cookies.get("param");
  return { taxCode, lastName, firstName };
};

export const setUserMockParams = ({ taxCode, lastName, firstName }) => {
  Cookies.set("param", taxCode, COOKIE_OPTIONS);
  Cookies.set("param", lastName, COOKIE_OPTIONS);
  Cookies.set("param", firstName, COOKIE_OPTIONS);
};

export const clearUserMockParams = () => {
  Cookies.remove("param", COOKIE_OPTIONS);
  Cookies.remove("param", COOKIE_OPTIONS);
  Cookies.remove("param", COOKIE_OPTIONS);
};


export const getApiMockParams = () => {
  return Cookies.get("param");
};

export const setApiMockParams = value => {
  Cookies.set("param", value, COOKIE_OPTIONS);
};

export const clearApiMockParams = () => {
  Cookies.remove("param", COOKIE_OPTIONS);
};
