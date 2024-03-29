/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */

import { date, format } from "quasar";
import {
  DEFAULT_FORMAT_DATE,
  DEFAULT_FORMAT_DATETIME,
  DEFAULT_FORMAT_TIME,
  capitalize as _capitalize,
  startCase as _startCase,
} from "src/services/utils";

const { formatDate } = date;
const { pad } = format;

export default ({ app, router, store, Vue }) => {
  // Installazione filtri
  Vue.filter("date", (v, format = DEFAULT_FORMAT_DATE) => {
    return v ? formatDate(v, format) : "";
  });

  Vue.filter("time", (v, format = DEFAULT_FORMAT_TIME) => {
    return v ? formatDate(v, format) : "";
  });

  Vue.filter("datetime", (v, format = DEFAULT_FORMAT_DATETIME) => {
    return v ? formatDate(v, format) : "";
  });

  Vue.filter("empty", (v, fallback = "-") => {
    return v || fallback;
  });

  Vue.filter("trimRight", (v, toTrim = "s") => {
    let pattern = "(" + toTrim + ")+$";
    let regex = new RegExp(pattern, "g");
    return v.replace(regex, "");
  });

  Vue.filter("trimLeft", (v, toTrim = "s") => {
    let pattern = "^(" + toTrim + ")+";
    let regex = new RegExp(pattern, "g");
    return v.replace(regex, "");
  });

  Vue.filter("number", v => Number(v).toLocaleString());

  Vue.filter("padLeft", (v, length = 2, char = " ") => {
    return pad(v, length, char);
  });

  Vue.filter("decimals", (v, decimals = 2) => {
    return Number(v).toFixed(decimals);
  });

  Vue.filter("capitalize", (s) => ( s ? _capitalize(s, true) : '' ));
  Vue.filter("startCase", (s) => ( s ? _startCase(s, true) : '' ));
  Vue.filter("truncate", (v, length) => {
    if (!v) return "";
    v = v.toString();
    if (v.length > length) {
      return v.substring(0, length) + "...";
    } else {
      return v;
    }
  });
};
