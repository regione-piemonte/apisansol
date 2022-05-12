/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {store} from "src/store";
import {extractBirthMonthPart, extractBirthYearPart, getDay, MONTH_MAP} from "src/services/tax-code";
import { date } from "quasar";
const {
  getDateDiff,
  subtractFromDate,
  startOfDate,
  endOfDate,
  isBetweenDates,
  addToDate
} = date;

export const sortByDate = dateList => {
  function dateToNum(d) {
    d = d.split("/");
    return Number(d[2] + d[1] + d[0]);
  }

  dateList.sort(function(a, b) {
    return dateToNum(a) - dateToNum(b);
  });

  return dateList;
};

export const sortByTime = hoursList => {
  hoursList.sort(function(a, b) {
    return (
      new Date("1970/01/01 " + a.ora_slot) -
      new Date("1970/01/01 " + b.ora_slot)
    );
  });

  return hoursList;
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
        __feature: feature
      }
    });
    return [...out, ...places];
  }, []);
  if (places.length > 5) places = places.slice(0, 5);
  features = places;

  return features;

};
export const normalizeLoccsiRoads = (response ) => {
  let features = response.filter(r => r.name ==='ind_loccsi_strade');

  let places = features.reduce((out, index) => {
    let places = index.featureCollection.features.map(feature => {
      return {
        id: feature.id,
        coordinate: feature.geometry,
        indirizzo: feature.properties.loccsi_label,
        comune: feature.properties.localita,
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


export const screeningLevel = level =>{
  if (level === "1") {
    return "I livello";
  }else if(level === "2"){
    return "II livello"
  } else
    return ''
}



/**
 * Verifica se l'utente è minore dal cf (attualmente questo controllo include anche gli ultracentenari)
 *
 * @param taxcode cf del utente
 * @returns {boolean} true se è minorenne
 */
export const getUserMinor = (taxCode) =>{

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

