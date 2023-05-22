/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */

//Consente di modificare l'indirizzo dell'utente per facilitare la ricerca su loccsi

import {deepClone, isEmpty, orderBy} from "src/services/utils";
export const DEFAULT_SCROLL_DURATION = 200;
import {getScrollTarget, setScrollPosition, setHorizontalScrollPosition } from "quasar/src/utils/scroll";
import {extractBirthMonthPart, extractBirthYearPart, getDay, MONTH_MAP} from "src/services/tax-code";
import { date } from "quasar";
const {
  getDateDiff,
  addToDate
} = date;

export const normalizeAddress = (addressString) => {
  let newAddress = addressString?.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
  newAddress = newAddress?.replace(/\s{2,}/g, " ");
  return newAddress
};
export const normalizeLoccsiRoads = (response ) => {
  let features = response.filter(r => r.name ==='ind_loccsi_strade');

  let places = features.reduce((out, index) => {
    let places = index.featureCollection.features.map(feature => {
      return {
        id: feature.id,
        coordinate: feature.geometry,
        indirizzo: feature.properties.loccsi_label,
        comune: feature.properties.comune,
        __feature: feature
      }
    });
    return [...out, ...places];
  }, []);
  if (places.length > 5) places = places.slice(0, 5);
  features = places;

  return features;

};

export const normalizeLoccsiCities = (response ) => {
  let features = response.filter(r => r.name ==='ind_loccsi_comuni');
  let places = features.reduce((out, index) => {
    let places = index.featureCollection.features.map(feature => {
      return {
        id: feature.properties.codice_istat,
        coordinate: feature.geometry,
        indirizzo: feature.properties.loccsi_label,
        __feature: feature
      }
    });
    return [...out, ...places];
  }, []);
  if (places.length > 5) places = places.slice(0, 5);
  features = places;

  return features;
};

export const mapSuggestedAddresses = (resultsList) =>{
  let orderedAddresses = [];
  if (!isEmpty(resultsList)) {
    let addressList = deepClone(resultsList)
    let addresses = addressList.map(address => {
      return {
        label: address.indirizzo,
        value: address.id,
        coords: {
          lat: address.coordinate.coordinates[1],
          lon: address.coordinate.coordinates[0]
        },
        isGeolocated: false
      }
    });

    orderedAddresses = orderBy(addresses, ["label"]);
  }
  return Object.freeze(orderedAddresses);
}

export const normalizeLoccsiPlaces = (response) => {
  const indexOrders = {
    ind_loccsi_comuni: 1,
    ind_loccsi_strade: 2,
    ind_loccsi_civici_full: 3
  };

  // Ordiniamo i cataloghi dando più importanza a "comuni", poi "strade" ed infine "civici"
  let features = response.sort((a, b) => {
    return indexOrders[a.name] > indexOrders[b.name] ? 1 : -1;
  });
  let places = features.reduce((out, index) => {
    let places = index.featureCollection.features.map(feature => {
      return {
        id: feature.id,
        coordinate: feature.geometry,
        indirizzo: feature.properties.loccsi_label,
        comune: feature.properties.comune,
        __feature: feature
      }
    });
    return [...out, ...places];
  }, []);
  if (places.length > 5) places = places.slice(0, 5);
  features = places;

  return features;

};

export const scrollToElement = (element, duration = DEFAULT_SCROLL_DURATION) => {
  let target = getScrollTarget(element);
  let offset = element.offsetTop;
  setScrollPosition(target, offset, duration)
};



/**
 * Verifica se l'utente è minore dal cf (attualmente questo controllo include anche gli ultracentenari)
 *
 * @param taxcode cf del utente
 * @returns {boolean} true se è minorenne
 */
export const getUserMinor = (taxCode) =>{
  if(!taxCode) return false
  // Se il codice fiscale è numerico viene considerato un maggiorenne
  const NUMERIC_REGEX = /^[0-9]*$/;
  let isNumeric = NUMERIC_REGEX.test(taxCode);
  if(isNumeric)
    return false

  const TODAY = new Date();
  const THIS_YEAR = TODAY.getFullYear().toString().slice(-2);

  const yearNumber =  extractBirthYearPart(taxCode);
  const monthLetter = extractBirthMonthPart(taxCode);
  let century = yearNumber<= THIS_YEAR ? '20' : '19';

  let birthYear = century + yearNumber;
  birthYear = parseInt(birthYear)
  let birthMonth =  MONTH_MAP.indexOf(monthLetter) ;
  let birthDay  = getDay(taxCode);

  let birthDate = new Date(birthYear, birthMonth,birthDay );

  // Controlliamo l'età tenendo conto che il compleanno dell'utente di questo anno sia già passato
  // altrimenti riduciamo di 1 l'età dal momento che non ha ancora compiuto gli anni
  let age = getDateDiff(TODAY, birthDate, "years");
  let max = addToDate(birthDate, { year: age });
  let diff = getDateDiff(TODAY, max, "days");
  if (diff < 0)
    age -= 1;

  return age<18

};
