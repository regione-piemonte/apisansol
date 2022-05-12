/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/**
 * @description
 * Contiene dei validatori custom con Vualidate per i codici fiscali
 */
import {
  extractBirthMonthPart, extractBirthYearPart,
  extractNamePart,
  extractSurnamePart, GENDERS,
  generateNamePart,
  generateSurnamePart, getDay, getGender,
  hasValidCin,
  hasValidForm,
  hasValidLength, hasValidLengthTemporary,
  MONTH_MAP,
} from '@services/global/tax-code'


// @TODO: rimuovere quando verrà sostituito con 'taxCodeLength' ovunque
export const taxCode = hasValidLength;
export const taxCodeRegex = hasValidForm;
export const taxCodeLength = hasValidLength;
export const taxCodeTemporaryLength = hasValidLengthTemporary;
export const taxCodeCin = taxCode => hasValidLength(taxCode) && hasValidCin(taxCode);

export const taxCodeName = name => {
  return taxCode => {
    if(!name) return false;
    return generateNamePart(name) === extractNamePart(taxCode);
  }
};

export const taxCodeSurname = surname => {
  return taxCode => {
    if(!surname) return false;
    return generateSurnamePart(surname) === extractSurnamePart(taxCode);
  }
};

export const taxCodeMonth = monthNumber => {
  return taxCode => {
    if (monthNumber === undefined || monthNumber === null) return false;
    return MONTH_MAP[monthNumber] === extractBirthMonthPart(taxCode);
  }
};

export const taxCodeYear = year => {
  return taxCode => {
    if (!year) return false;
    return String(year).endsWith(extractBirthYearPart(taxCode));
  }
};

export const taxCodeDay = day => {
  return taxCode => {
    if (!day) return false;
    return day === getDay(taxCode);
  }
};

export const taxCodeGender = gender => {
  return taxCode => {
    if(![GENDERS.MALE, GENDERS.FEMALE].includes(gender)) return false;
    return gender === getGender(taxCode);
  }
};
