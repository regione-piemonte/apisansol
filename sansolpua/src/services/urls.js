/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const delegateDetail = uuid => {
  return `/la-mia-salute/deleghe/#/delegati/${uuid}/modifica`;
};

export const delegatorListAdult = () => {
  return `/la-mia-salute/deleghe/#/deleganti`;
};

export const delegatorListMinor = () => {
  return `/la-mia-salute/deleghe/#/minori`;
};

export const messageList = () => {
  return `/la-mia-salute/#/notifiche-utente`;
};

export const messageDetail = id => {
  return `/la-mia-salute/#/notifiche-utente/${id}`;
};

export const notifyContacts = () => {
  return `/la-mia-salute/profilo-utente/#/contatti-utente`;
};

export const changeDoctor = () => {
  return `/la-mia-salute/#/il-mio-medico`;
};

export const findAHospital = () => {
  return `/la-mia-salute/trova-un/#/ospedali-case-di-cura`;
};

export const findADoctor = () => {
  return `/la-mia-salute/trova-un/#/medici-pediatri`;
};

export const findAPharmacy = () => {
  return `/la-mia-salute/trova-un/#/farmacie`;
};

export const findAStructure = () => {
  return `/la-mia-salute/trova-un/#/strutture-sanitarie`;
};

export const findACeliacOutlet = () => {
  return `/la-mia-salute/trova-un/#/punti-vendita-prodotti-celiaci`;
};

export const appDetailInfo = appCode => {
  let url = "url";

  url = `${url}?codice=${appCode}`;
  return url;
};

export const appDetailFaq = appCode => {
  let url = "url";
  url = `${url}?codice=${appCode}`;
  return url;
};

export const authGetCredentials = () => {
  let url =
    "url";

  if (process.env.APP_IS_PROD) {
    url =
      "url";
  }

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


export const assistanceNewRequest = () => {
  return `/la-mia-salute/assistenza/#/richieste/nuova`;
};

export const assistanceRequestList = () => {
  return `/la-mia-salute/assistenza/#/richieste/aperte`;
};
