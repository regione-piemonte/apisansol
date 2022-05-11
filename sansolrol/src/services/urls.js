/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {store} from "src/store";


export const appDetailFaq = (appCode) =>{
  let url = "url";
  url = `${url}?codice=${appCode}`;
  return url;
}
export const appAssistanceTree = (appCode) => {
  let url =`/la-mia-salute/assistenza/#/percorsi-guidati/${appCode}`
  return url;
};

export const appAssistanceForm = (appCode) => {
  let url =`/la-mia-salute/assistenza/#/richieste/nuova/${appCode}`
  return url;
};

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


export const  urlEnrollment = (delegatorSelected, isDeclarationActive) => {
  if (delegatorSelected) {
    let taxCode = delegatorSelected.codice_fiscale_delega;
    let serviceCode = process.env.APP_CODE;
    if(isDeclarationActive)
      return `/la-mia-salute/arruolamento/#/?minore=${taxCode}&servizio=${serviceCode}`;
    else
      return `/la-mia-salute/arruolamento/#/?d=${taxCode}&servizio=${serviceCode}`;
  }
  return "/la-mia-salute/arruolamento/";
}
