/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { Notify, uid } from "quasar";

export const ISO_DATE_FULL_YEAR = "YYYY";
export const ISO_DATE_MONTH = "MM";
export const ISO_DATE_MONTH_DAY = "DD";
export const ISO_TIME_HOUR = "HH";
export const ISO_TIME_MINUTE = "mm";
export const ISO_TIME_SECOND = "ss";
export const ISO_TIME_SEC_FRAC = "SSS";
export const ISO_TIME_OFFSET = "Z";

export const ISO_FULL_DATE = `${ISO_DATE_FULL_YEAR}-${ISO_DATE_MONTH}-${ISO_DATE_MONTH_DAY}`;
export const ISO_PARTIAL_TIME = `${ISO_TIME_HOUR}:${ISO_TIME_MINUTE}:${ISO_TIME_SECOND}`;
export const ISO_FULL_TIME = `${ISO_PARTIAL_TIME}${ISO_TIME_OFFSET}`;
export const ISO_DATE_TIME = `${ISO_FULL_DATE}T${ISO_FULL_TIME}`;

export const DEFAULT_FORMAT_DATE = "DD MMM YYYY";
export const DEFAULT_FORMAT_TIME = "HH:mm";
export const DEFAULT_FORMAT_DATETIME = "DD MMM YYYY HH:mm";
export const MOBILE_PHONE_PREFIX_ITALY = "0039";

// API UTILS
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Estende il Notify di Quasar per mostrare all'utente un messaggio di errore.
 *
 * Di solito questo metodo viene usato per notificare errori nelle chiamate AJAX, per questo motivo di default
 * non svanisce mai e mostra un bottone di chiusura della notifica.
 *
 * Inoltre è possibile aggiungere facilmente un altro bottone di "riprova" con una callback relativa per riprovare
 * la chiamata.
 *
 * @param {Object} options
 */
export const apiErrorNotify = (options = {}) => {
  const noop = () => {};

  // Impostiamo alcuni defaults
  options.color = options.color || "negative";
  options.message = options.message || "";
  options.actions = options.actions || [];
  options.timeout = options.timeout || 0;
  if (!("closable" in options)) options.closable = true;
  if (!("canTryAgain" in options)) options.canTryAgain = false;
  if (!("progress" in options)) options.progress = true;
  options.onClose = options.onClose || noop;
  options.onTryAgain = options.onTryAgain || noop;

  if (options.error) {
    let error = options.error;
    let code = null;

    if (!(error instanceof Error)) {
      code = error.status;
    } else if (error.response) {
      code = error.response.status;
      options.caption = error?.response?.data?.title;
    }

    if (code) options.message = `[${code}] ${options.message}`;
  }

  if (options.canTryAgain) {
    options.actions.push({
      label: "Riprova",
      color: "white",
      handler: options.onTryAgain
    });
  }

  if (options.closable) {
    options.actions.push({
      label: options.canTryAgain ? "Chiudi" : undefined,
      icon: options.canTryAgain ? undefined : "close",
      dense: !options.canTryAgain,
      round: !options.canTryAgain,
      color: "white",
      handler: options.onClose
    });
  }

  Notify.create(options);
};

export const apiInterceptorRequestId = http => {
  http.interceptors.request.use(config => {
    config.headers["X-Request-Id"] = uid();
    return config;
  });
};

export const login = (loginUrl, landingUrl = window.location.href) => {
  let encodedPublicUrl = encodeURIComponent(landingUrl);
  let loginRedirectUrl = `${loginUrl}?landingUrl=${encodedPublicUrl}`;

  try {
    location.assign(loginRedirectUrl);
  } catch (e) {
    window.open(loginRedirectUrl, "_self");
  }
};

export const logout = logoutUrl => {
  try {
    location.assign(logoutUrl);
  } catch (e) {
    window.open(logoutUrl, "_self");
  }
};

export const isEmpty = val => val == null || !(Object.keys(val) || val).length;

// @see https://30secondsofcode.org/index#uniqueelementsby
export const uniqueElementsBy = (arr, fn) => {
  return arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc
  }, [])
};


// @see https://www.30secondsofcode.org/js/s/order-by
export const orderBy = (arr, props, orders) => {
  return [...arr].sort((a, b) =>
    props.reduce((acc, prop, i) => {
      if (acc === 0) {
        const [p1, p2] =
          orders && orders[i] === "desc"
            ? [b[prop], a[prop]]
            : [a[prop], b[prop]];
        acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
      }
      return acc;
    }, 0)
  );
};



// @see https://www.30secondsofcode.org/js/s/group-by
export const groupBy = (arr, fn) =>
  arr
    .map(typeof fn === 'function' ? fn : val => val[fn])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i]);
      return acc;
    }, {});



export const keyBy = (arr, fn) => {
  let result = {};
  arr.forEach(el => {
    let key = fn(el);
    if (result.hasOwnProperty(key)) console.warn('Overriding', result[key], 'with', el);
    result[fn(el)] = el
  });
  return result
};


// '--Foo-Bar--' => 'Foo Bar'
// 'fooBar' => 'Foo Bar'
export const startCase = s =>
  s ? capitalizeEveryWord(fromCamelCase(toCamelCase(s), " ")) : "";

// @see https://30secondsofcode.org/string#capitalizeeveryword
export const capitalizeEveryWord = str =>
  str.replace(/\b[a-z]/g, char => char.toUpperCase());


// @see https://30secondsofcode.org/string#tocamelcase
export const toCamelCase = str => {
  let s =
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][à-ú]+[0-9]*|\b)|[A-Z]?([a-z]|[à-ú])+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join("");
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

// @see https://30secondsofcode.org/string#fromcamelcase
export const fromCamelCase = (str, separator = " ") => {
  return str
    .replace(/([a-zà-ú\d])([A-Z])/g, "$1" + separator + "$2")
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
    .toLowerCase();
};

// @see https://30secondsofcode.org/string#capitalize
export const capitalize = ([first, ...rest], lowerRest = false) => {
  return (
    first.toUpperCase() +
    (lowerRest ? rest.join("").toLowerCase() : rest.join(""))
  );
};

export const equalsIgnoreCase = (str1, str2) => {
  let a = str1 && str1.toUpperCase();
  let b = str2 && str2.toUpperCase();
  return a === b;
};
