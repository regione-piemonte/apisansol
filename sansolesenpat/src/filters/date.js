/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import isWithinRange from 'date-fns/is_within_range';
import subDays from 'date-fns/sub_days';
import addDays from 'date-fns/add_days';
import {format as __format, distanceInWordsToNow, distanceInWordsStrict} from "@services/global/utils";


// @TODO: spostare la definizione nella configurazione e poi importarla
export const DEFAULT_FORMAT = 'DD MMM YYYY';

/**
 * @param {Date|String} date - La data da formattare
 * @param {String} format=DEFAULT_FORMAT - Una stringa che descrive come formattare la data attraverso date-fns
 * @returns {String} - La data formattata
 *
 * @description
 * Permette di ottenere una formattazione delle date omogenea in tutto il progetto.
 * Per casi estremi, basta passare il parametro `format` per ottenere la formattazione desiderata.
 */
export const format = (date, format = DEFAULT_FORMAT) => {
  return __format(date, format)
};


/**
 * @param {Date|String} date - La data da formattare
 * @param {Number} daysBefore=null - Se now - daysBefore <= date <= now => formatta la data relativamente
 * @param {Number} daysAfter=null - Se now <= date <= now + daysAfter => formatta la data relativamente
 * @param {String} _format=DEFAULT_FORMAT - Una stringa che descrive come formattare la data attraverso date-fns
 * @returns {string} - La data formattata
 *
 * @description
 * Formatta una data relativamente rispetto a `now()`
 */
export const formatRelative = (date, daysBefore = null, daysAfter = null, _format = DEFAULT_FORMAT) => {

  let options = {unit: 'd'}
  let now = new Date();
  let lowerLimit = date;
  let upperLimit = date;

  if (daysBefore !== null) {
    lowerLimit = subDays(date, daysBefore);
  }

  if (daysAfter !== null) {
    upperLimit = addDays(date, daysAfter);
  }

  // return isWithinRange(now, lowerLimit, upperLimit) ? distanceInWordsStrict(now, date, options) : format(date, _format);
  return isWithinRange(now, lowerLimit, upperLimit) ? distanceInWordsToNow(date) : format(date, _format);
};


