/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// Dato uno status, restituisce true se può essere considerato "valido", false altrimenti
import {
  DECLARATION_DETAIL_ROLE_CODES, DECLARATION_DETAILS_STATUS_CODES,
  DECLARATION_TYPES_CODES,
  DECLARATION_VALID_STATUS, DEFAULT_DELEGATION_DAYS_INTERVAL,
  DELEGATION_RANK_CODES,
  DELEGATION_STATUS_MAP,
  DELEGATION_TYPE_CODES, FORMAT_DATE, FSE_CODES_LIST, FSE_CODES_MATCH
} from "src/services/config";
import {date} from "quasar";
import {defaultTo, equalsIgnoreCase, orderBy} from "src/services/utils";
import {store} from 'src/store/index'
import {extractBirthMonthPart, extractBirthYearPart, getDay, MONTH_MAP} from "src/services/tax-code";
export const isDelegationValid = status => {
  return DECLARATION_VALID_STATUS.includes(status)
};


// Costruisce una delega di default: quella in fase di creazione
export const buildDefaultDelegation = service => {
  let now = new Date()

  let dayDifference = getDelegationDaysInterval(service.numero_giorni);

  return {
    delega_descrizione: service.applicazione?.descrizione ?? '',
    codice_servizio: service.codice_servizio,
    data_inizio_delega: now.toISOString(),
    data_fine_delega: date.addToDate(now, {days: dayDifference}).toISOString(),
    stato_delega: DELEGATION_STATUS_MAP.NOT_ACTIVE,
    tipo_delega: DELEGATION_TYPE_CODES.ADULT,
    grado_delega: null,
  }
};

// Dato un servizio, restituisce il numero di giorni massimo di delegabilità
export const getDelegationDaysInterval = nDays => {
  let value = defaultTo(nDays, DEFAULT_DELEGATION_DAYS_INTERVAL);
  // return Math.min(nDays, DEFAULT_DELEGATION_DAYS_INTERVAL)
  return Math.min(value, DEFAULT_DELEGATION_DAYS_INTERVAL)
};


// Dato un delegante, restituisce true se si tratta di un minore, false altrimenti
export const isDelegatorMinor = delegator => {
  let birthDate = delegator.data_nascita_delega
  const now= new Date()
  let age = date.getDateDiff(now, birthDate, "years");
  let max = date.addToDate(birthDate, { year: age });
  let diff = date.getDateDiff(now, max, "days");
  if (diff < 0) age -= 1;
  return age < 18

};


export const hasFalseValue = obj => {
  for (let i in obj) {
    if (obj[i] === false) {
      return true;
      break;
    }
  }
  return false;
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


// Permette di ottenre l'ultima delega creata per un dato servizio
export const getLastDelegation = (delegations, serviceCode) => {
  let serviceDelegations = delegations.filter(d => d.codice_servizio === serviceCode)
  let serviceDelegationsOrdered = orderBy(serviceDelegations, d => {
    return d.data_revoca_delega || d.data_rinuncia_delega || d.data_inizio_delega
  }, ['desc'])

  return serviceDelegationsOrdered[0]
};

// Permette di ottenere lo stato attuale delle deleghe: per ogni servizio mantiene solo l'ultima delega ed ignora
// il resto che fa parte dello storico
export const getLastDelegations = delegations => {
  let servicesCodes = delegations.map(d => d.codice_servizio)
  let lastDelegations = servicesCodes.map(code => getLastDelegation(delegations, code))
  return lastDelegations
};


export const isFseCodes = delegationCode => {
  for (let i = 0; i < FSE_CODES_MATCH.length; i++) {
    let fseCodes = FSE_CODES_MATCH[i]
    if (fseCodes[1] === delegationCode) {
      return true
      break;
    }
  }
  return false
}

// DICHIARAZIONI MINORI
// ---------------------------------------------------------------------------------------------------------------------
// Permette di sapere se una dichiarazione è una dichiarazione per minori
export const isDeclarationMinor = (declaration) => {
  let code = getDeclarationTypeCode(declaration);
  let codes = [
    DECLARATION_TYPES_CODES.PARENTS_MONO,
    DECLARATION_TYPES_CODES.PARENTS_MULTI,
  ];

  return codes.includes(code)
};

// Permette di ottenere il codice del tipo di dichiarazione
export const getDeclarationTypeCode = (declaration) => {
  return declaration?.tipo?.codice
};

// Permette di ottenere il minore nella dichiarazione
export const getDeclarationMinor = (declaration) => {
  return declaration?.dettagli[0]?.figlio_tutelato_curato
};

// Permette di ottenere il dettaglio dell'altro genitore.
// Utile nelle dichiarazioni multi genitore.
export const getOtherParentDeclarationDetailItem = (declaration, cf) => {
  return declaration.dettagli.find(d => d.genitore_tutore_curatore.codice_fiscale !== cf)
};

// Permette di ottenere il dettaglio del genitore
export const getParentDeclarationDetailItem = (declaration, cf) => {
  let details = declaration && declaration.dettagli || [];
  let detail = details.find(d => d.genitore_tutore_curatore && d.genitore_tutore_curatore.codice_fiscale === cf);
  return detail;
};
// Permette di ottenere l'altro genitore.
// Utile nelle dichiarazioni multi genitore.
export const getDeclarationOtherParent = (declaration, cf) => {
  let item = getOtherParentDeclarationDetailItem(declaration, cf)
  return item && item.genitore_tutore_curatore || null
};

// Permette di ottenere lo stato per il genitore
export const getParentDeclarationStatus = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf)
  return item.stato
};

// Permette di ottenere il ruolo di un genitore nella dichiarazione
export const getParentDeclarationRole = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf)
  return item.ruolo_genitore_tutore_curatore
};

// @NOTE: il ruolo "GENITORE_1" indica il genitore che ha richiesto la dichiarazione
// @NOTE: il ruolo "GENITORE_2" indica il genitore che deve confermare la dichiarazione
export const isDeclarationRequestingParent = (declaration, cf) => {
  let role = getParentDeclarationRole(declaration, cf)
  return role.codice === DECLARATION_DETAIL_ROLE_CODES.PARENT_1
};

export const isDeclarationMinorRevocable = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf);
  let statusCode = item && item.stato && item.stato.codice;
  let statusCodes = [
    DECLARATION_DETAILS_STATUS_CODES.VALIDATE_OPERATOR,
    DECLARATION_DETAILS_STATUS_CODES.VALIDATE_USER,
  ];

  return statusCodes.includes(statusCode);
};


export const getDateMonth= (selectedDate) =>{
  if(!selectedDate) return null
  let dateObj = date.extractDate(selectedDate, FORMAT_DATE)
  return dateObj.getMonth()
}
export const isValidDate= (selectedDate, minDate, maxDate) =>{
  let validFormat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(selectedDate)

  let dateObj = date.extractDate(selectedDate, FORMAT_DATE)
  let isValidRange = date.isBetweenDates(dateObj, minDate, maxDate,  { onlyDate: true, inclusiveFrom: true, inclusiveTo: true })
  return isValidRange && validFormat

}

export const getAvatarIcon = (gender, minor=false, add=false) =>{
  let icon = ''
  if(add){
    icon = (gender === 'F') ? 'donna' : 'uomo'
    return `img:/statics/la-mia-salute/icone/avatar-${icon}-aggiungi.svg`
  }else{
    if(minor){
      icon = (gender === 'F') ? 'ragazza' : 'ragazzo'
    }else{
      icon = (gender === 'F') ? 'donna' : 'uomo'
    }
    return `img:/statics/la-mia-salute/icone/avatar-${icon}.svg`
  }

}

export const getServiceName = (serviceCode) =>{
  let appList = store.getters['getAppList']
  let service = appList.find(a => equalsIgnoreCase(a.codice_servizio, serviceCode))
  return service && service.descrizione || serviceCode
}


// Permette di ottenere il genitore della dichiarazione
export const getDeclarationParent = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf)
  return item.genitore_tutore_curatore
};


export const excludeFseCodes = (delegationList) =>{
  return delegationList?.filter(delegation => !FSE_CODES_LIST.includes(delegation.deleghe_codice) )
}
export const getServiceWithFseCodes = (delegationList) =>{
  let servicesCodes = []
  FSE_CODES_MATCH.forEach( codes => servicesCodes.push(codes[0]))

  return delegationList?.filter(delegation => servicesCodes.includes(delegation.codice_servizio) )
}

export const  getFseCode = (serviceCode) =>{
  let match = FSE_CODES_MATCH.find(codes => codes[0] === serviceCode)
  return match ? match[1] : null
}


// Permette di ottenere il soggetto tuttelato nella dichiarazione per tutela
export const getDeclarationProtected = (declaration) => {
  return declaration.dettagli[0].figlio_tutelato_curato
};


// Permette di sapere se una dichiarazione è una dichiarazione per minori
export const isDeclarationProtection = (declaration) => {
  let code = getDeclarationTypeCode(declaration);
  let codes = [
    DECLARATION_TYPES_CODES.PROTECTION_MINOR,
    DECLARATION_TYPES_CODES.PROTECTION_MAJOR,
    DECLARATION_TYPES_CODES.SUPPORT,
  ];

  return codes.includes(code)
};
// Permette di ottenere il soggetto tutelante nella dichiarazione per tutela
export const getDeclarationProtector = (declaration) => {
  return declaration.dettagli[0].genitore_tutore_curatore
};

export const isDeclarationProtectionRevocable = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf);
  let statusCode = item && item.stato && item.stato.codice;
  let statusCodes = [
    DECLARATION_DETAILS_STATUS_CODES.VALIDATE_OPERATOR,
    DECLARATION_DETAILS_STATUS_CODES.VALIDATE_USER,
  ];

  return statusCodes.includes(statusCode);
};


export const isMinor = birthDate => {
  return  date.getDateDiff(new Date(), birthDate, 'years') < 18
}


export const isGrownChildDelegator= delegation =>{
  return delegation?.tipo_delega === DECLARATION_TYPES_CODES.PARENTS_MULTI
    && delegation?.stato_delega === DELEGATION_STATUS_MAP.EXPIRED
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
  let age = date.getDateDiff(TODAY, birthDate, "years");
  let max =  date.addToDate(birthDate, { year: age });
  let diff =  date.getDateDiff(TODAY, max, "days");
  if (diff < 0)
    age -= 1;

  console.log('Age:', age);
  return age<18

};
