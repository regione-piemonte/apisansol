/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { Notify, uid } from "quasar";
import router from "src/router";
import {getScrollTarget, setScrollPosition, setHorizontalScrollPosition } from "quasar/src/utils/scroll";


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

export const DEFAULT_SCROLL_DURATION = 200;

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
// Un errore contiene la proprietà "request" quando:
// The request was made but no response was received
// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
// http.ClientRequest in node.js
export const responseHasRequest = (response) => {
  return isResponseError(response) && !!response.request
}


// Un errore ha la proprietà "response" quando:
// The request was made and the server responded with a status code
// that falls out of the range of 2xx
export const errorHasResponse = (response) => {
  return isResponseError(response) && !!response.response
}
export const isResponseError = (response) => {
  return response instanceof Error
}
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
          let loginUrl = "/login";
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


//@see https://www.30secondsofcode.org/js/s/is-empty
export const isEmpty = val => val == null || !(Object.keys(val) || val).length;


export const scrollToElement = (element, duration = DEFAULT_SCROLL_DURATION) => {
  let target = getScrollTarget(element);
  let offset = element.offsetTop;
  setScrollPosition(target, offset, duration)
};


export const scrollHorizontalToElement = (element, duration = DEFAULT_SCROLL_DURATION) => {
  let target = getScrollTarget(element);
  let offset = element.offsetLeft;
  setHorizontalScrollPosition (target, offset, duration)
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


//@see https://www.30secondsofcode.org/js/s/deep-clone
export const deepClone = obj => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
      ? Array.from(obj)
      : clone;
};


//Consente di modificare l'indirizzo dell'utente per facilitare la ricerca su loccsi
export const normalizeAddress = (addressString) => {
 let newAddress = addressString.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
  newAddress = newAddress.replace(/\s{2,}/g, " ");
  return newAddress
};


export const capitalize = ([first, ...rest]) => {
  if(!first) return ''
  return  first.toUpperCase() + rest.join('').toLowerCase() ;
}


//@see https://www.30secondsofcode.org/js/s/equals
export const equals = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k]));
};

export const GEOPOSITION_LABEL = "LA TUA POSIZIONE";
export const DEFAULT_DISTANCE = 5



export const booleanToBinary = (value) => {
  let binary = value ? 1 : 0;
  return binary
};
