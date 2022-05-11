/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// aggiunge alla lista dei tag quello che indica il messaggio come "visto"
export const markMessageAsSeen = tag => {
  return isMessageSeen(tag) ? tag : [tag.split(","), "noticed"].join(",");
};

// controlla se un messaggio è segnato come visto o meno
export const isMessageSeen = tag => {
  return tag && tag.includes("noticed");
};

// controlla se un messaggio è impostato come letto o meno
export const isMessageRead = m => {
  return !!m.read_at;
};

export const hasCallToAction = m => {
  return m && m.mex && m.mex.call_to_action;
};

export const getCallToAction = m => {
  if (!hasCallToAction(m)) return;
  return m.mex.call_to_action;
};

// Permette di estrapolare il numero di elementi totali dalla response
export const getNotificationsTotalCount = response => {
  let result = Number(response.headers["total-elements"]);
  return isNaN(result) ? 0 : result;
};

export const  getFullName = (surname, name) => {
  return [surname, name]
    .filter(el => !!el)
    .join(" ")
    .trim();
};
