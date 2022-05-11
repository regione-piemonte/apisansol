/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {store} from "src/store";


export const appDetailFaq = (appCode) =>{
  let url = "BASE_URL";
  url = `${url}?codice=${appCode}`;
  return url;
}
export const appAssistanceTree = (appCode) => {
  let url =`BASE_URL/${appCode}`
  return url;
};

export const privacyPolicy = () => {
  let url = "BASE_URL";

  url = `${url}/note-legali-e-privacy`;
  return url;
};

export const cookiePolicy = () => {
  let url = "BASE_URL";

  url = `${url}/cookie-policy`;
  return url;
};


export const urlPiemonteTu = () =>{
  let user = store.getters["getUser"];
  return 'URL'

}
