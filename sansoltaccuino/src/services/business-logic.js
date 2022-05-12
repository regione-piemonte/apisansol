/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { date, LocalStorage } from "quasar";
import { groupBy, orderBy, sortBy } from "src/services/utils";
import {extractBirthMonthPart, extractBirthYearPart, getDay, MONTH_MAP} from "src/services/tax-code";

const { formatDate, getDateDiff, addToDate } = date;

export const getPreference = (notebook, entityCode, groupCode) => {
  let preferenceList = notebook?.preferenze ?? [];
  return preferenceList.find(
    p => p.entita_codice === entityCode && p.gruppo_codice === groupCode
  );
};

export const getPreferenceValue = (notebook, entityCode, groupCode) => {
  let preference = getPreference(notebook, entityCode, groupCode);
  return preference?.visibile ?? false;
};

export const getPreferencePayload = (
  notebook,
  entityCode,
  groupCode,
  value
) => {
  let preference = getPreference(notebook, entityCode, groupCode);
  return {
    id: preference.id,
    visibile: value,
    entita_codice: entityCode,
    gruppo_codice: groupCode
  };
};

// export const getDetectionChartData = (detectionList, dayList) => {
//   return dayList.map(day => {
//     return detectionList.find(
//       d => formatDate(day, "DD MMM YYYY") === formatDate(d.data, "DD MMM YYYY")
//     );
//   });
// };

export const getLastSelectedMeasure = descriptorCode => {
  let key = `LMS_TAC_UM_${descriptorCode}`;
  return LocalStorage.getItem(key);
};

export const setLastSelectedMeasure = (descriptorCode, measureCode) => {
  let key = `LMS_TAC_UM_${descriptorCode}`;
  return LocalStorage.set(key, measureCode);
};

export const getProfile = ({ gender, birthDate }) => {
  // Se non abbiamo i dati sul sesso o sulla data di nascita => restituiamo un profilo "FALLBACK"
  if (!gender || !birthDate) return null;

  let now = new Date();
  let isMale = ["M", "m"].includes(gender);

  // Controlliamo l'età tenendo conto che il compleanno dell'utente di questo anno sia già passato
  // altrimenti riduciamo di 1 l'età dal momento che non ha ancora compiuto gli anni
  let age = getDateDiff(now, birthDate, "years");
  console.log("age", age);
  let max = addToDate(birthDate, { year: age });
  console.log("max", max);
  let diff = getDateDiff(now, max, "days");
  console.log("diff", diff);
  if (diff < 0) age -= 1;
  console.log("age", age);
  let result = isMale ? "UOMO" : "DONNA";

  if (age <= 10) result += "-BAMBINO";
  else if (age <= 24) result += "-RAGAZZO";
  else if (age <= 55) result += "-ADULTO-GIOVANE";
  else if (age <= 79) result += "-ADULTO-GRANDE";
  else result += "-ANZIANO";

  return result;
};

export const getProfileAvatarUrl = ({ gender, birthDate }) => {
  let profile = getProfile({ gender, birthDate });
  if (!profile) return null;
  profile = profile.toLowerCase();
  return `images/avatar-profilo-${profile}.svg`;
};

/**
 * Dato un elenco di rilevazioni, genera un elenco di punti {x, y} ordinati per data in cui la y è il valore numerico
 * della rilevazione e la x è la data formattata in DD MMM HH:mm
 *
 * @typedef {Object} DetectionDatasetPoint
 * @property {Number} x - Il valore numerico della rilevazione
 * @property {String} y - La data della rilevazione formattata
 *
 * @param detectionList L'elenco delle rilevazioni da cui ottenere l'elenco dei punti
 * @returns {DetectionDatasetPoint[]} - L'elenco dei punti {x, y}
 */
export const getDetectionDatasetPointList = detectionList => {
  return orderBy(detectionList, ["data"], ["asc"]).map(el => {
    return {
      x: formatDate(el.data, "DD MMM HH:mm"),
      y: el.valore_numerico ?? null
    };
  });
};

/**
 * Data una lista di rilevazioni permette di raggrupparle per unità di misura.
 *
 * @returns {[String, Array]} - Restituisce una entry in cui il primo elemento è il codice dell'unità di misura ed il secondo è l'elenco delle rilevazioni associate
 */
export const getDetectionEntryListByMeasure = list => {
  let result = groupBy(list, d => d.unita_misura_codice);
  result = Object.entries(result);
  return sortBy(result, ([key, list]) => key);
};




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

  console.log(age)
  return age<18

};
