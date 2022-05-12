/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {store} from "src/store";


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

export const appAssistanceTree = (appCode) => {
  let url =`/la-mia-salute/assistenza/#/percorsi-guidati/${appCode}`
  return url;
};

export const appAssistanceForm = (appCode) => {
  let url =`/la-mia-salute/assistenza/#/richieste/nuova/${appCode}`
  return url;
};

export const faqUrl = () => {
  let workingApp = store.getters["getWorkingApp"];
  let appCode = workingApp?.portale_codice ?? null;
  let url = "url";
  url = `${url}?codice=${appCode}`;
  return url;
}
