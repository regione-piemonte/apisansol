/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {store} from "src/store";


export const appDetailFaq = (appCode) =>{
  let url = "URL";
  url = `${url}?codice=${appCode}`;
  return url;
}
export const appAssistanceTree = (appCode) => {
  let url = "URL";
  return url;
};

export const appAssistanceForm = (appCode) => {
  let url = "URL";
  return url;
};


export const privacyPolicy = () => {
  let url = "URL";
  url = `${url}/note-legali-e-privacy`;
  return url;
};

export const cookiePolicy = () => {
  let url = "URL";
  url = `${url}/cookie-policy`;
  return url;
};
