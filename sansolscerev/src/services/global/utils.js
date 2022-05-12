/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {scroll, date} from 'quasar'
import localeIt from 'date-fns/locale/it'
import __format from 'date-fns/format'
import __distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import __distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import {Platform} from 'quasar-framework'
import {config} from 'plugins/config'
import {SessionStorage} from 'quasar'
import store from '@store/index'
import {extractBirthMonthPart, extractBirthYearPart, getDay} from "@services/global/tax-code";

// Aiutiamo webpack a capire che non ci serve tutto l'ogetto scroll, ma solo qualche parte
const {getScrollTarget, getScrollPosition, setScrollPosition} = scroll;
const {addToDate, getDateDiff} = date;

// @TODO: inserire questo parametro nella configurazione?
export const DEFAULT_SCROLL_DURATION = 500;

export const scrollToElement = (element, duration = DEFAULT_SCROLL_DURATION) => {
  let target = getScrollTarget(element);
  let offset = element.offsetTop;
  setScrollPosition(target, offset, duration)
};


// @see https://dev.to/nestedsoftware/basic-functional-programming-patterns-in-javascript-49p2
export const mash = (arr, callback) => {
  let addKeyValuePair = (acc, item) => {
    let [key, value] = callback ? callback(item) : item;
    return {...acc, [key]: value}
  };

  return arr.reduce(addKeyValuePair, {})
};

export const sumBy = (arr, fn) => {
  return arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => acc + val, 0);
};

// Esempi:
// compareVersion("0.20.7", "0.20.8");  // -1
// compareVersion("0.20.9", "0.20.8");  // 1
// compareVersion("0.20.08", "0.20.8");  // 0
// compareVersion("0.20.08", "0.20.8.1"); // -1
// compareVersion("0.20.8.1", "0.20.8");  // 1
// compareVersion("0.020", "0.20");  // 0
// compareVersion(0.1, 0.2);  // false
// compareVersion("0", "0");  // 0
// compareVersion("0.1", true);  // false
//
// Se v1 > v2 => 1
// Se v1 == v2 => 0
// Se v1 < v2 => -1
export const compareVersion = (v1, v2) => {

  if (typeof v1 !== 'string') return false;
  if (typeof v2 !== 'string') return false;

  v1 = v1.split('.');
  v2 = v2.split('.');

  const k = Math.min(v1.length, v2.length);

  for (let i = 0; i < k; ++i) {
    v1[i] = parseInt(v1[i], 10);
    v2[i] = parseInt(v2[i], 10);
    if (v1[i] > v2[i]) return 1;
    if (v1[i] < v2[i]) return -1;
  }

  return v1.length == v2.length ? 0 : (v1.length < v2.length ? -1 : 1)
};


// Ci dice se il browser supporta i cookie di terze parti
// Al momento solo safari >= 13.1 blocca di default i cookie di terze parti
// Nel 2022 anche chrome adotterà lo stesso comportamento
// Invece Firefox al momento blocca i cookie di terze parti solo nel caso in cui la terza parte è
// un sito di advertising conosciuto e presente in una blacklist
export const supportThirdPartyCookie = () => {
  if (Platform.is.safari && compareVersion('13.1', Platform.is.version) <= 0) return false;
  // Stranamente anche chrome sembra non supportare i cookie di terze parti
  // let isEdge = window.navigator.userAgent.includes('Edg/');
  // if (Platform.is.chrome && !isEdge) return false;
  if (Platform.is.chrome) return false;
  return true
};


export const equalsIgnoreCase = (str1, str2) => {
  let a = str1 && str1.toUpperCase();
  let b = str2 && str2.toUpperCase();
  return a === b;
};

// LODASH REPLACEMENT
// ---------------------------------------------------------------------------------------------------------------------
export const defaultTo = (value, defaultValue) => (value == null || value !== value) ? defaultValue : value;

export const get = (object, path, defaultValue) => {
  let levels = path.replace(/\[([^\[\]]*)\]/g, '.$1.').split('.').filter(l => l !== '');
  let result = levels.reduce((prev, cur) => prev && prev[cur], object);
  return defaultTo(result, defaultValue)
};

// @see: https://30secondsofcode.org/object#defaults
export const defaults = (obj, ...defs) => Object.assign({}, obj, ...defs.reverse(), obj);

// @see https://30secondsofcode.org/index#without
export const without = (arr, ...args) => arr.filter(v => !args.includes(v));

// @see https://30secondsofcode.org/type#isnil
export const isNil = val => val === undefined || val === null;

// @see https://30secondsofcode.org/type#isempty
export const isEmpty = val => val == null || !(Object.keys(val) || val).length;

// @see https://30secondsofcode.org/type#isobject
export const isObject = obj => obj === Object(obj);

// @see https://30secondsofcode.org/math#randomintarrayinrange
export const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// @see https://30secondsofcode.org/string#capitalize
export const capitalize = ([first, ...rest], lowerRest = false) => {
  return first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''))
};

// @see https://30secondsofcode.org/string#capitalizeeveryword
export const capitalizeEveryWord = str => str.replace(/\b[a-z]/g, char => char.toUpperCase());

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

// @see https://30secondsofcode.org/index#last
export const last = arr => arr[arr.length - 1];

// @see https://30secondsofcode.org/index#sample
export const sample = arr => arr[Math.floor(Math.random() * arr.length)];

// @see https://30secondsofcode.org/object#orderby
export const orderBy = (arr, props, orders) => {
  return [...arr].sort((a, b) =>
    props.reduce((acc, prop, i) => {
      if (acc === 0) {
        const [p1, p2] = orders && orders[i] === 'desc' ? [b[prop], a[prop]] : [a[prop], b[prop]];
        acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0
      }
      return acc
    }, 0)
  )
};

// @see: https://30secondsofcode.org/object#omit
export const omit = (obj, arr) => {
  return Object.keys(obj)
    .filter(k => !arr.includes(k))
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {})
};

// @see https://30secondsofcode.org/object#deepclone
export const deepClone = obj => {

  if (obj === undefined) return undefined;
  if (obj === null) return null;

  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );

  if (Array.isArray(obj)) {
    clone.length = obj.length;
    clone = Array.from(clone)
  }

  return clone
};

// @see https://30secondsofcode.org/index#uniqueelements
export const uniqueElements = arr => [...new Set(arr)];


// @see https://30secondsofcode.org/index#uniqueelementsby
export const uniqueElementsBy = (arr, fn) => {
  return arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc
  }, [])
};


// @see https://30secondsofcode.org/index#unionby
export const unionBy = (a, b, fn) => {
  const s = new Set(a.map(fn));
  return Array.from(new Set([...a, ...b.filter(x => !s.has(fn(x)))]))
};


// @see https://30secondsofcode.org/index#zipobject
export const zipObject = (props, values) => {
  return props.reduce((obj, prop, index) => ((obj[prop] = values[index]), obj), {})
};


// @see https://30secondsofcode.org/index#groupby
export const groupBy = (arr, fn) => {
  return arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc
  }, {})
};


// @see https://30secondsofcode.org/index#intersectionby
const _intersectionBy = (a, b, fn) => {
  let s = new Set(b.map(fn));
  return a.filter(x => s.has(fn(x)))
};

export const intersectionBy = (...args) => {
  let fn = args[args.length - 1];
  let initial = args[0];
  let arrays = args.slice(1, -1);
  return arrays.reduce((result, array) => _intersectionBy(result, array, fn), initial)
};


export const keyBy = (arr, fn) => {
  let result = {};
  arr.forEach(el => {
    let key = fn(el);
    if (result.hasOwnProperty(key)) console.warn('Overriding', result[key], 'with', el);
    result[fn(el)] = el
  });
  return result
};

// @see https://www.30secondsofcode.org/js/s/equals/
export const equals = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k]));
};

//check if at least one object key has true value
export const hasTrueValue = (obj) => {
  for (let i in obj) {
    if (obj[i] === true) {
      return true;
      break;
    }
  }
  return false;
};


// DATE-FSN WRAPPERS
// @see: https://date-fns.org/v1.29.0/docs/I18n
// ---------------------------------------------------------------------------------------------------------------------
const DEFAULT_DATE_FNS_OPTIONS = {locale: localeIt};

export const format = (date, formatStr, options) => {
  options = defaults(options, DEFAULT_DATE_FNS_OPTIONS);
  return __format(date, formatStr, options)
};

export const distanceInWordsToNow = (date, options) => {
  options = defaults(options, DEFAULT_DATE_FNS_OPTIONS);
  return __distanceInWordsToNow(date, options)
};


export const distanceInWordsStrict = (dateToCompare, date, options) => {
  options = defaults(options, DEFAULT_DATE_FNS_OPTIONS);
  return __distanceInWordsStrict(dateToCompare, date, options)
};


// OTHER
// ---------------------------------------------------------------------------------------------------------------------

// Controlla se il browser supporta ES6
// @see https://www.bram.us/2016/10/31/checking-if-a-browser-supports-es6/
export const supportsES6 = () => {
  try {
    // new Function("(a = 0) => a");
    eval('var foo = (x = \'hope\') => \'yay\'');
    return true
  } catch (err) {
    return false
  }
};


export const openUrl = (url) => {

  // Il parametro per il debug deve essere inserito solo se siamo in sviluppo.
  // Inoltre, evitiamo di rompere l'app se non riusciamo ad aggiungere il parametro nella query per il debug
  if (config.global.isDevelopment) {
    try {
      let q = 'PARAM';
      url += (url.includes('?') ? '&' : '?') + q
    } catch (e) {

    }
  }


  // Sovrascriviamo l'utente ed aggiungiamo il parametro dei mocks solo se siamo in sviluppo o in test
  if (config.global.isDevelopment || config.global.isTest) {
    // Evitiamo di rompere l'app se non riusciamo ad aggiungere i parametri nella query per simulare l'utenza
    try {
      let isUserLogged = store.getters['global/isUserLogged'];
      if (isUserLogged) {
        let user = store.getters['global/user'];
        let q = `param=${user.cf}&param=${user.nome}&param=${user.cognome}`;
        url += (url.includes('?') ? '&' : '?') + q
      }
    } catch (e) {

    }

    // Evitiamo di rompere l'app se non riusciamo ad utilizzare i mocks
    try {
      let mockableServicesCodes = SessionStorage.get.item('preferenceOfMocks') || [];
      let mockedServices = config.global.mockableServices.filter(s => mockableServicesCodes.includes(s.code));
      if (mockedServices.some(s => url.includes(s.apiPath))) {
        let q = 'param=true';
        url += (url.includes('?') ? '&' : '?') + q
      }
    } catch (e) {
    }
  }


  // Su iOS apriamo il PDF in una nuova tab mentre su tutti gli altri sistemi proviamo ad aprirlo nella stessa tab
  if (Platform.is.ios) {
    console.log('[iOS] openUrl:', url);
    window.open(url)
  } else {
    console.log('[!iOS] openUrl:', url);
    // window.location = url
    window.location.assign(url)
  }

};


// IN ATTESA DI AXIOS 0.19 stabile
// ---------------------------------------------------------------------------------------------------------------------
// @NOTE: Al momento axios 0.18 non offre la possibilità di ottenre la URL che costruisce (es. querystring encodata ecc)
//        Nella versione 0.19 mette a disposizione il metodo getUri() che è proprio quello che ci serve ma introduce
//        alcuni bug per funzionalità che attualmente usiamo: le proprietà custom nella configurazione (es. _no5XXRedirect)
//        Per questo motivo abbiamo momentaneamente riportato qui la logica che usa Axios per costruire le URL. Appena
//        la nuova versione sarà stabile potremo fare uno switch relativamente semplice
//
//  @see https://github.com/axios/axios/issues/2203
// ---------------------------------------------------------------------------------------------------------------------
export const getUri = (cfg) => {

  function isArray(val) {
    return toString.call(val) === '[object Array]'
  }

  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  }

  function isDate(val) {
    return toString.call(val) === '[object Date]'
  }

  function isObject(val) {
    return val !== null && typeof val === 'object'
  }

  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj]
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj)
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj)
        }
      }
    }
  }

  function encode(val) {
    return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']')
  }

  function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url
    }

    let serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params)
    } else if (isURLSearchParams(params)) {
      serializedParams = params.toString()
    } else {
      var parts = [];

      forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return
        }

        if (isArray(val)) {
          key = key + '[]'
        } else {
          val = [val]
        }

        forEach(val, function parseValue(v) {
          if (isDate(v)) {
            v = v.toISOString()
          } else if (isObject(v)) {
            v = JSON.stringify(v)
          }
          parts.push(encode(key) + '=' + encode(v))
        })
      });

      serializedParams = parts.join('&')
    }

    if (serializedParams) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }

    return url
  }


  return buildURL(cfg.url, cfg.params, cfg.paramsSerializer)
};


export const getUserMinor = taxCode => {
  // Se il codice fiscale è numerico viene considerato un maggiorenne
  const NUMERIC_REGEX = /^[0-9]*$/;
  let isNumeric = NUMERIC_REGEX.test(taxCode);
  // if (isNumeric) return false
  if (isNumeric) return 999;

  const TODAY = new Date();
  const THIS_YEAR = TODAY.getFullYear().toString().slice(-2);

  const yearNumber = extractBirthYearPart(taxCode);
  const monthLetter = extractBirthMonthPart(taxCode);
  let century = yearNumber <= THIS_YEAR ? '20' : '19';

  let birthYear = century + yearNumber;
  birthYear = parseInt(birthYear);
  let birthMonth = MONTH_MAP.indexOf(monthLetter);
  let birthDay = getDay(taxCode);

  let birthDate = new Date(birthYear, birthMonth, birthDay);

  // Controlliamo l'età tenendo conto che il compleanno dell'utente di questo anno sia già passato
  // altrimenti riduciamo di 1 l'età dal momento che non ha ancora compiuto gli anni
  let age = getDateDiff(TODAY, birthDate, "years");
  let max = addToDate(birthDate, {year: age});
  let diff = getDateDiff(TODAY, max, "days");
  if (diff < 0) age -= 1;

  console.log('Age:', age);
  return age < 18;
};
