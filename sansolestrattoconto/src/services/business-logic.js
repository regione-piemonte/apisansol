/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {extractBirthMonthPart, extractBirthYearPart, getDay, MONTH_MAP} from "src/services/tax-code";
import { date } from "quasar";
const {
  getDateDiff,
  addToDate
} = date;

export const getYearsOptions = () =>{
  let presentYear = new Date().getFullYear()
  let years = []
  for (let k = 1970; k < presentYear + 1; k++) {
    years.push(k.toString());
  }
  return years.reverse()
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
