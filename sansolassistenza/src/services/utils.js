/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { Notify, uid } from "quasar";
import router from "src/router";

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
      label: options.canTryAgain ? 'Chiudi' : undefined,
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

    let route = router?.currentRoute;
    let routeName = route?.name;
    let appCode = process.env.APP_CODE;

    if (routeName) config.headers["X-Front-End-Route"] = routeName;
    if (appCode) config.headers["X-Front-End-Application"] = appCode;
    config.headers["X-Front-End-Page"] = window.location.href;

    return config;
  });
};


export const  handleSessionTimeOut = http => {
  http.interceptors.response.use(
    response => response,
    error => {

      if (!errorHasResponse(error) && responseHasRequest(error)) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.debug("[Interceptor] Detected unknown error:", {error});

        if (!error.config.url.includes('bff/identity')) {
          console.debug("[Interceptor] Session timeout => redirect to login")
          let loginUrl = "/api/bff/login";
          let landingUrl = window.location.pathname;
          login(loginUrl,landingUrl)
          return
        }
      }

      console.debug("[Interceptor] It's ok, we use this error as app logic")
      return Promise.reject(error);
    }
  )
}


export const isResponseError = (response) => {
  return response instanceof Error
}

// Un errore ha la proprietà "response" quando:
// The request was made and the server responded with a status code
// that falls out of the range of 2xx
export const errorHasResponse = (response) => {
  return isResponseError(response) && !!response.response
}

// Un errore contiene la proprietà "request" quando:
// The request was made but no response was received
// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
// http.ClientRequest in node.js
export const responseHasRequest = (response) => {
  return isResponseError(response) && !!response.request
}



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

export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const sortBy = (arr, prop, descending = false, isDate = false) => {
  let result = [...arr];
  result.sort((a, b) => {
    a = a[prop];
    b = b[prop];
    if (isDate) {
      a = new Date(a);
      b = new Date(b);
    }
    if (descending) return a < b ? 1 : -1;
    return a > b ? 1 : -1;
  });
  return result;
};

//@see https://www.30secondsofcode.org/js/s/is-empty
export const isEmpty = val => val == null || !(Object.keys(val) || val).length;

//@see https://www.30secondsofcode.org/js/s/order-by
export const orderBy = (arr, props, orders) =>
  [...arr].sort((a, b) =>
    props.reduce((acc, prop, i) => {
      if (acc === 0) {
        const [p1, p2] =
          orders && orders[i] === 'desc'
            ? [b[prop], a[prop]]
            : [a[prop], b[prop]];
        acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
      }
      return acc;
    }, 0)
  );


export const deepClone = obj => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
        typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};


export const equalsIgnoreCase = (str1, str2) => {
  let a = str1 && str1.toUpperCase();
  let b = str2 && str2.toUpperCase();
  return a === b;
};



export const getUri = cfg => {
  function isArray(val) {
    return toString.call(val) === "[object Array]";
  }

  function isURLSearchParams(val) {
    return (
      typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams
    );
  }

  function isDate(val) {
    return toString.call(val) === "[object Date]";
  }

  function isObject(val) {
    return val !== null && typeof val === "object";
  }

  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === "undefined") {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== "object") {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  function encode(val) {
    return encodeURIComponent(val)
      .replace(/%40/gi, "@")
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");
  }

  function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    let serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }

        if (isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }

        forEach(val, function parseValue(v) {
          if (isDate(v)) {
            v = v.toISOString();
          } else if (isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + "=" + encode(v));
        });
      });

      serializedParams = parts.join("&");
    }

    if (serializedParams) {
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }

    return url;
  }

  return buildURL(cfg.url, cfg.params, cfg.paramsSerializer);
};



export const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc;
  }, []);


// '--Foo-Bar--' => 'Foo Bar'
// 'fooBar' => 'Foo Bar'
export const startCase = s => s ? capitalizeEveryWord(fromCamelCase(toCamelCase(s), ' ')) : '';


// @see https://30secondsofcode.org/string#tocamelcase
export const toCamelCase = str => {
  let s =
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][à-ú]+[0-9]*|\b)|[A-Z]?([a-z]|[à-ú])+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1)
};

// @see https://30secondsofcode.org/string#fromcamelcase
export const fromCamelCase = (str, separator = ' ') => {
  return str
    .replace(/([a-zà-ú\d])([A-Z])/g, '$1' + separator + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    .toLowerCase()
};

// @see https://30secondsofcode.org/string#capitalizeeveryword
export const capitalizeEveryWord = str => str.replace(/\b[a-z]/g, char => char.toUpperCase());



// @see https://30secondsofcode.org/string#capitalize
export const capitalize = ([first, ...rest], lowerRest = false) => {
  return first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''))
};
