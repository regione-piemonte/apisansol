/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {format as __format} from "@services/global/utils";
import {DEFAULT_FORMAT} from "@filters/date";

export const PREFIX_ITALY = '0039'


/**
 * @description
 * Rimuove dall'inizio della stringa, in questo caso un numero di telefono mobile, il prefisso internazionale desiderato.
 * Di default rimuove il predisso internazionale italiano (0039).
 *
 * @param {String} s -  Il numero di telefono mobile da formattare rimuovendo il numero di prefisso
 * @param {String} prefix - Il prefisso da rimuovere se presente. Di default prova a rimuovere il prefisso italiano
 * @returns {String} il numero di telefono senza prefisso
 */
export const mobilePhoneStripPrefix = (s, prefix = PREFIX_ITALY) => {
  return s.replace(new RegExp(`^${prefix}`), '')
};

/**
 * @description
 * Restituisce in modo abbreviato i giorni della settimana (Es. "Lunedì" diventa "Lun").
 *
 * @param {String} day -  Il giorno della settimana
 * @returns {String} il giorno della settimana abbreviato
 */

export const dayWeek = (day) => {
  return day.slice(0, 3)
};
