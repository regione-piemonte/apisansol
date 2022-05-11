/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {store} from "src/store";


export const appDetailFaq = () =>{
  let workingApp =  store.getters["getWorkingApp"];
  let appCode =  workingApp?.portale_codice ?? null
  let url = "url";
  url = `${url}?codice=${appCode}`;
  return url;
}


export const privacyPolicy = () => {
  let url = "url";
  url = `${url}/note-legali-e-privacy?nid=67`;
  return url;
};

export const cookiePolicy = () => {
  let url = "url";
  url = `${url}/cookie-policy?nid=65`;
  return url;
};


export const urlPiemonteTu = () =>{
  let user = store.getters["getUser"];
  return user
    ? 'url'
    : 'url';
}


export const profileNewContacts = (serviceCode) =>{
  let url = '/la-mia-salute/#/contatti-utente/attiva'

  url = `${url}?assistenza=${serviceCode}`
  return url;
}
