/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config';
import store from "@store/index";
import differenceInCalendarYears from 'date-fns/difference_in_calendar_years'
import {equalsIgnoreCase} from "./utils";

// aggiunge alla lista dei tag quello che indica il messaggio come "visto"
export const markMessageAsSeen = tag => {
  return isMessageSeen(tag) ? tag : [tag.split(','), config.global.unpMessageStoreTags.seen].join(',')
}

// controlla se un messaggio è segnato come visto o meno
export const isMessageSeen = tag => {
  return tag && tag.includes(config.global.unpMessageStoreTags.seen)
}

// controlla se un messaggio è impostato come letto o meno
export const isMessageRead = m => {
  return !!m.read_at
}

export const hasCallToAction = m => {
  return m && m.mex && m.mex.call_to_action
}

export const getCallToAction = m => {
  if (!hasCallToAction(m)) return
  return m.mex.call_to_action
}

// Permette di estrapolare il numero di elementi totali dalla response
export const getNotificationsTotalCount = response => {
  let result = Number(response.headers[config.global.unpMessageStoreHeaderNames.totalCount])
  return isNaN(result) ? 0 : result
}


export const isFemale = gender => {
  return ['F'].includes(gender)
}


export const isMale = gender => {
  return !isFemale(gender)
}


export const isMinor = birthDate => {
  return differenceInCalendarYears(new Date(), birthDate) < 18
}


export const isAdult = birthDate => {
  return !isMinor(birthDate)
}

export const appDetailFaq = (appCode) =>{
  let url = "url";
  url = `${url}?codice=${appCode}`;
  return url;
}
export const appAssistancePage = (serviceCode) =>{
  let url = `/la-mia-salute/assistenza/#/percorsi-guidati/${serviceCode}`;
  return url;
}
export const appAssistanceForm = (serviceCode) => {
  let url =`/la-mia-salute/assistenza/#/richieste/nuova/${serviceCode}`
  return url;
};

export const urlCookiePolicy = (serviceCode) =>{
  let url = "url";
  url = `${url}/cookie-policy?nid=65`;
  return url;
}


export const urlPrivacyPolicy = (serviceCode) =>{
  let url = "url";
  url = `${url}/note-legali-e-privacy?nid=67`;
  return url;
}
