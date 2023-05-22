/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { date, SessionStorage } from "quasar";
import {
  PAYMENT_STATUS_CODE_MAP,
  PAYMENT_STATUS_CODE_LIST_DOWNLOADABLE_PDF,
  IMAGE_STATUS_CODE_LIST_IN_ELABORATION,
  IMAGE_STATUS_CODE_LIST_ERROR,
  IMAGE_STATUS_CODE_LIST_DOWNLOADABLE,
  PAYMENT_STATUS_CODE_LIST_PAYABLE,
  DOCUMENT_EXPIRING_DAYS,
  DOCUMENT_TYPE_CODE_LIST_PAYABLE,
  DOCUMENT_TYPE_CODE_LIST_IMAGE_DOWNLOADABLE,
  IMAGE_STATUS_CODE_LIST_BOOKABLE,
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_HIDE_TYPE_MAP,
  TAG_FIXED_ID_LIST_HEAD,
  TAG_FIXED_ID_LIST_CHEST,
  TAG_FIXED_ID_LIST_ABDOMEN,
  TAG_FIXED_ID_LIST_PELVIS,
  TAG_FIXED_ID_LIST_LIMBS,
  TAG_FIXED_ID_LIST_OTHER, ENROLLMENT_WARNING_CODE_LIST, USER_ENABLING_MAP, ENROLLMENT_BLOCK_CODE_LIST
} from "src/services/config";
import {
  extractBirthDayAndGenderPart,
  extractBirthMonthPart,
  extractBirthYearPart,
  GENDERS,
  getDay,
  MONTH_MAP
} from "src/services/tax-code";
export const DEFAULT_SCROLL_DURATION = 500;

import {getScrollTarget, setScrollPosition} from "quasar/src/utils/scroll";
import store from "src/store";
const {
  getDateDiff,
  subtractFromDate,
  startOfDate,
  endOfDate,
  isBetweenDates,
  addToDate
} = date;

/**
 * Permette di raggruppare le etichette fisse per le parti del corpo umano
 *
 * @param tagListFixed
 * @returns {{head: [], chest: [], limbs: [], abdomen: [], pelvis: [], other: []}}
 */
export const groupTagListFixedByBodySection = tagListFixed => {
  let result = {
    head: [],
    chest: [],
    abdomen: [],
    pelvis: [],
    limbs: [],
    other: []
  };

  tagListFixed.forEach(t => {
    if (TAG_FIXED_ID_LIST_HEAD.includes(t.id)) {
      result.head.push(t);
    }

    if (TAG_FIXED_ID_LIST_CHEST.includes(t.id)) {
      result.chest.push(t);
    }

    if (TAG_FIXED_ID_LIST_ABDOMEN.includes(t.id)) {
      result.abdomen.push(t);
    }

    if (TAG_FIXED_ID_LIST_PELVIS.includes(t.id)) {
      result.pelvis.push(t);
    }

    if (TAG_FIXED_ID_LIST_LIMBS.includes(t.id)) {
      result.limbs.push(t);
    }

    if (TAG_FIXED_ID_LIST_OTHER.includes(t.id)) {
      result.other.push(t);
    }
  });

  return result;
};

/**
 * Permette di raggruppare i conteggi le etichette fisse per le parti del corpo umano
 *
 * @param tagCountsFixed
 * @returns {{head: Number, chest: Number, limbs: Number, abdomen: Number, pelvis: Number, other: Number}}
 */
export const groupTagCountsFixedByBodySection = tagCountsFixed => {
  let result = {
    head: 0,
    chest: 0,
    abdomen: 0,
    pelvis: 0,
    limbs: 0,
    other: 0
  };

  tagCountsFixed.forEach(el => {
    if (TAG_FIXED_ID_LIST_HEAD.includes(el.etichetta?.id)) {
      result.head += el.numero_documenti;
    }

    if (TAG_FIXED_ID_LIST_CHEST.includes(el.etichetta?.id)) {
      result.chest += el.numero_documenti;
    }

    if (TAG_FIXED_ID_LIST_ABDOMEN.includes(el.etichetta?.id)) {
      result.abdomen += el.numero_documenti;
    }

    if (TAG_FIXED_ID_LIST_PELVIS.includes(el.etichetta?.id)) {
      result.pelvis += el.numero_documenti;
    }

    if (TAG_FIXED_ID_LIST_LIMBS.includes(el.etichetta?.id)) {
      result.limbs += el.numero_documenti;
    }

    if (TAG_FIXED_ID_LIST_OTHER.includes(el.etichetta?.id)) {
      result.other += el.numero_documenti;
    }
  });

  return result;
};

// ---------------------------------------------------------------------------------------------------------------------
// DOCUMENTO AREA BLU
// ---------------------------------------------------------------------------------------------------------------------
export const getAslFse = document => {
  return document?.metadati?.azienda;
};

export const getTypeCodeFse = document => {
  return document?.metadati?.tipo_documento?.codice;
};

export const getPaymentStatusFse = document => {
  return document?.metadati?.pagato_ticket;
};

export const getPayableImportFse = document => {
  return document?.metadati?.ticket_da_pagare?.valore;
};

export const getPayedImportFse = document => {
  return document?.metadati?.ticket_pagato?.valore;
};

export const hasAccessionNumbersFse = document => {
  return document?.accession_numbers?.length > 0;
};

export const getImageStatusFse = document => {
  return document?.stato_generazione_pacchetto;
};

export const isPersonalFse = document => {
  return document?.categoria === DOCUMENT_CATEGORY_MAP.PERSONAL;
};

export const isVisibleFse = document => {
  let visibleCodes = ["N"];
  return visibleCodes.includes(document?.oscurato);
};

/**
 *
 * @param document Il documento da cui ottenere il codice del tipo di documento da oscurare/deoscurare
 * @returns {string} Il codice del tipo di documento da passare alla API di oscuramento/deoscuramento
 */
export const getHideTypeCode = document => {
  if (isPersonalFse(document)) {
    return DOCUMENT_HIDE_TYPE_MAP.PERSONAL;
  }

  return DOCUMENT_HIDE_TYPE_MAP.FSE;
};

/**
 * Un documento è rimborsabile se lo stato del pagamento "RIMBORSO"
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il rimborso è scaricabile, false altrimenti
 */
export const hasRefundFse = document => {
  let codes = [PAYMENT_STATUS_CODE_MAP.REFUND];
  let status = getPaymentStatusFse(document);
  return codes.includes(status);
};

/**
 * Un rimborso è scaricabile quando ha almeno un'importo pagabile o pagato
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il rimborso è scaricabile, false altrimenti
 */
export const isRefundDownloadableFse = document => {
  let isRefund = hasRefundFse(document);
  let payable = getPayableImportFse(document);
  let payed = getPayedImportFse(document);
  return isRefund && (payable !== null || payed !== null);
};

/**
 * Un documento è scaricabile se
 *  1. Il download è abilitato, cioè non deve essere "oscurata" la possibilità di download
 *  2. La data di scadenza download non è passata
 *  3. Può essere sempre scaricato oppure il ticket è considerato pagato
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il PDF è scaricabile, false altrimenti
 */
export const canDownloadPdfFse = document => {
  let paymentStatus = getPaymentStatusFse(document);
  let _isRefundDownloadable = isRefundDownloadableFse(document);

  let hasValidStatus =
    _isRefundDownloadable ||
    PAYMENT_STATUS_CODE_LIST_DOWNLOADABLE_PDF.includes(paymentStatus);

  return hasValidStatus;
};

/**
 * L'immagine del documento può essere generata se:
 *  1. Il referto è scaricabile
 *  2. Il referto deve rientrare tra le categorie che permettono il download dell'immagine
 *  3. Deve avere l'accession number (Questo perchè se mandano un referto di radiologia da una ASL su cui non abbiamo
 *     l'integrazione con le immagini NON DEVE essere visualizzato il pulsante di download immagini)
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se può essere generata un'immagine, false altrimenti
 * @private
 */
const _canGenerateImageFse = document => {
  let typeCode = getTypeCodeFse(document);

  return (
    canDownloadPdfFse(document) &&
    DOCUMENT_TYPE_CODE_LIST_IMAGE_DOWNLOADABLE.includes(typeCode) &&
    hasAccessionNumbersFse(document)
  );
};

/**
 * Controlla se per il client (session storage) l'immagine del documento è già stata prenotata
 *
 * @NOTE: abbiamo bisogno di salvare l'unformazione sul client dal momento che la modifica di stato sul server non è immediato
 *        questo potrebbe causare una prenotazione multipla delle immagini ed offre anche una UX non ottimale dal momento che
 *        l'utente prenota l'immagine e poi vede che non è successo nulla, anzi può prenotarla di nuovo
 *        e potrebbe sembrare un errore silente
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se l'immagine è già stata richiesta, false altrimenti
 * @private
 */
const _isRequestedFse = document => {
  let key = `STORAGE_KEY_${report.id_documento_ilec}`;
  return SessionStorage.has(key) && SessionStorage.getItem(key) === true;
};

/**
 * L'immagine può essere prenotata se:
 *  1. Il referto prevede la possibilità di generarla
 *  2. Lo stato dell'immagine permette la generazione (es: non è già generata)
 *  3. La richiesta di prenotazione non è salvata nel client
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se è possibile richiedere l'immagine, false altrimenti
 */
export const canRequestImageFse = document => {
  let status = getImageStatusFse(document);
  let isBookable = IMAGE_STATUS_CODE_LIST_BOOKABLE.includes(status);
  return _canGenerateImageFse(document) && isBookable;
};

/**
 * L'immagine viene considerata "In elaborazione" quando:
 *  1. Il referto prevede la possibilità di generarla
 *  2. Lo stato dell'immagine indica che è in generazione oppure abbiamo salvato sul client che la richiesta è stata effettuata
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se l'immagine è in eleborazione, false altrimenti
 */
export const isImageInElaborationFse = document => {
  let status = getImageStatusFse(document);
  let isInElaboration = IMAGE_STATUS_CODE_LIST_IN_ELABORATION.includes(status);
  return _canGenerateImageFse(document) && isInElaboration;
};

/**
 * L'immagine viene considerata "in errore irreversibile" quando
 *  1. Il referto prevede la possibilità di generarla
 *  2. Lo stato dell'immagine indica che è in errore
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se l'immagine ha un errore, false altrimenti
 */
export const imageHasIrreversibleErrorFse = document => {
  let status = getImageStatusFse(document);
  let hasError = IMAGE_STATUS_CODE_LIST_ERROR.includes(status);
  return _canGenerateImageFse(document) && hasError;
};

/**
 * L'immagine può essere scaricata se:
 *  1. Il referto prevede la possibilità di generarla
 *  2. Lo stato dell'immagine permette il download (es: è stata generata)
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se è possibile scaricare l'immagine, false altrimenti
 */
export const canDownloadImageFse = document => {
  let status = getImageStatusFse(document);
  let isDownloadable = IMAGE_STATUS_CODE_LIST_DOWNLOADABLE.includes(status);
  return _canGenerateImageFse(document) && isDownloadable;
};

/**
 * E' possibile pagare il documento se:
 *  1. Rientra in una delle tipologie "pagabili"
 *  2. Ha uno stato per cui è consentito il pagamento
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se è possibile pagare il documento, false altrimenti
 */
export const canPayFse = document => {
  let typeCode = getTypeCodeFse(document);
  let paymentStatus = getPaymentStatusFse(document);

  return (
    DOCUMENT_TYPE_CODE_LIST_PAYABLE.includes(typeCode) &&
    PAYMENT_STATUS_CODE_LIST_PAYABLE.includes(paymentStatus)
  );
};

/**
 * Il documento è "in scadenza" quando days(data_scadenza - now) < giorni_scadenza
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il documento è in scadenza, false altrimenti
 */
export const isExpiringFse = document => {
  let now = new Date();
  // @TODO: qual è questo campo?
  let upperBound = document?.data_scaricabile_fino_al;
  let lowerBound = subtractFromDate(upperBound, {
    days: DOCUMENT_EXPIRING_DAYS
  });

  upperBound = endOfDate(upperBound, "day");
  lowerBound = startOfDate(lowerBound, "day");

  return isBetweenDates(now, lowerBound, upperBound);
};

/**
 * Il documento è scaduto quando la sua data di fine validità è nel passato
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il documento è scaduto, false altrimenti
 */
export const isExpiredFse = document => {
  let now = new Date();

  let expireDate = document?.data_scaricabile_fino_al;
  return getDateDiff(expireDate, now, "days") < 0;
};

/**
 * Controlla se il documento è una richiesta di recupero pregresso
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il documento è in fase di recupero pregresso, false altrimenti
 */
export const isPreviousRecoveryFse = document => {
  return document?.metadati?.recupero_pregresso === "S";
};

// ---------------------------------------------------------------------------------------------------------------------
// DOCUMENTO AREA ROSSA (ROL)
// ---------------------------------------------------------------------------------------------------------------------
export const getAslRol = document => {
  return document?.azienda;
};

export const getTypeCodeRol = document => {
  return document?.tipo_documento?.codice;
};

export const getPaymentStatusRol = document => {
  return document?.pagato_ticket;
};

export const getPayableImportRol = document => {
  return document?.importo_da_pagare?.valore ?? null;
};

export const getPayedImportRol = document => {
  return document?.importo_pagato?.valore ?? null;
};

export const hasAccessionNumbersRol = document => {
  return document?.accession_numbers?.length > 0;
};

export const getImageStatusRol = document => {
  // return document?.stato_richiesta;
  return document?.stato_generazione_pacchetto;
};

export const isWithdrawableRol = document => {
  let rol = document?.rol;

  return rol === "N";
};

// @TODO: dove prendo questo dato?
export const isVisibleRol = document => {
  let visibleCodes = ["N", "M"];
  return visibleCodes.includes(document?.oscurato);
};

/**
 * Un documento è rimborsabile se lo stato del pagamento "RIMBORSO"
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il rimborso è scaricabile, false altrimenti
 */
export const hasRefundRol = document => {
  let codes = [PAYMENT_STATUS_CODE_MAP.REFUND];
  let status = getPaymentStatusRol(document);
  return codes.includes(status);
};

/**
 * Un rimborso è scaricabile quando ha almeno un'importo pagabile o pagato
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il rimborso è scaricabile, false altrimenti
 */
export const isRefundDownloadableRol = document => {
  let isRefund = hasRefundRol(document);
  let payable = getPayableImportRol(document);
  let payed = getPayedImportRol(document);
  return isRefund && (payable !== null || payed !== null);
};

/**
 * Un documento è scaricabile se
 *  1. Il download è abilitato, cioè non deve essere "oscurata" la possibilità di download
 *  2. La data di scadenza download non è passata
 *  3. Può essere sempre scaricato oppure il ticket è considerato pagato
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il PDF è scaricabile, false altrimenti
 */
export const canDownloadPdfRol = document => {
  let rol = document?.rol;
  let paymentStatus = getPaymentStatusRol(document);

  let isFuture = true;
  let isVisible = true;

  let hasValidStatus = PAYMENT_STATUS_CODE_LIST_DOWNLOADABLE_PDF.includes(
    paymentStatus
  );

  console.log({
    rol,
    isFuture,
    hasValidStatus,
    isVisible,
    document
  });
  return rol === "S" && isVisible && isFuture && hasValidStatus;
};


/**
 * Un documento è scaricabile se
 *  1. Il download è abilitato, cioè non deve essere "oscurata" la possibilità di download
 *  2. La data di scadenza download non è passata
 *  3. Può essere sempre scaricato oppure il ticket è considerato pagato
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il PDF è scaricabile, false altrimenti
 */
export const canDownloadImmagineRol = document => {
  let rol = document?.rol;
  let paymentStatus = getPaymentStatusRol(document);

  let isFuture = true;
  let isVisible = true;

  let hasValidStatus = PAYMENT_STATUS_CODE_LIST_DOWNLOADABLE_PDF.includes(
    paymentStatus
  );

  console.log({
    rol,
    isFuture,
    hasValidStatus,
    isVisible,
    document
  });
  return isVisible && isFuture && hasValidStatus;
};



/**
 * L'immagine del documento può essere generata se:
 *  1. Il referto è scaricabile
 *  2. Il referto deve rientrare tra le categorie che permettono il download dell'immagine
 *  3. Deve avere l'accession number (Questo perchè se mandano un referto di radiologia da una ASL su cui non abbiamo
 *     l'integrazione con le immagini NON DEVE essere visualizzato il pulsante di download immagini)
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se può essere generata un'immagine, false altrimenti
 * @private
 */
const _canGenerateImageRol = document => {
  let typeCode = getTypeCodeRol(document);

  return (
    canDownloadImmagineRol(document) &&
    DOCUMENT_TYPE_CODE_LIST_IMAGE_DOWNLOADABLE.includes(typeCode) &&
    hasAccessionNumbersRol(document)
  );
};




/**
 * Controlla se per il client (session storage) l'immagine del documento è già stata prenotata
 *
 * @NOTE: abbiamo bisogno di salvare l'unformazione sul client dal momento che la modifica di stato sul server non è immediato
 *        questo potrebbe causare una prenotazione multipla delle immagini ed offre anche una UX non ottimale dal momento che
 *        l'utente prenota l'immagine e poi vede che non è successo nulla, anzi può prenotarla di nuovo
 *        e potrebbe sembrare un errore silente
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se l'immagine è già stata richiesta, false altrimenti
 * @private
 */
const _isRequestedRol = document => {
  let key = `KEY_${report.id_documento_ilec}`;
  return SessionStorage.has(key) && SessionStorage.getItem(key) === true;
};

/**
 * L'immagine può essere prenotata se:
 *  1. Il referto prevede la possibilità di generarla
 *  2. Lo stato dell'immagine permette la generazione (es: non è già generata)
 *  3. La richiesta di prenotazione non è salvata nel client
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se è possibile richiedere l'immagine, false altrimenti
 */
export const canRequestImageRol = document => {
  let status = getImageStatusRol(document);
  let isBookable = IMAGE_STATUS_CODE_LIST_BOOKABLE.includes(status);
  let typeCode = getTypeCodeRol(document);
  let paymentStatus = getPaymentStatusRol(document);
  let hasValidStatus = PAYMENT_STATUS_CODE_LIST_DOWNLOADABLE_PDpF.includes(
    paymentStatus
  );

  return (
    hasValidStatus &&
    DOCUMENT_TYPE_CODE_LIST_IMAGE_DOWNLOADABLE.includes(typeCode) &&
    hasAccessionNumbersRol(document)   && isBookable
  );


};

/**
 * L'immagine viene considerata "In elaborazione" quando:
 *  1. Il referto prevede la possibilità di generarla
 *  2. Lo stato dell'immagine indica che è in generazione oppure abbiamo salvato sul client che la richiesta è stata effettuata
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se l'immagine è in eleborazione, false altrimenti
 */
export const isImageInElaborationRol = document => {
  let status = getImageStatusRol(document);
  let isInElaboration = IMAGE_STATUS_CODE_LIST_IN_ELABORATION.includes(status);
  return _canGenerateImageRol(document) && isInElaboration;
};

/**
 * L'immagine viene considerata "in errore irreversibile" quando
 *  1. Il referto prevede la possibilità di generarla
 *  2. Lo stato dell'immagine indica che è in errore
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se l'immagine ha un errore, false altrimenti
 */
export const imageHasIrreversibleErrorRol = document => {
  let status = getImageStatusRol(document);
  let hasError = IMAGE_STATUS_CODE_LIST_ERROR.includes(status);
  return _canGenerateImageRol(document) && hasError;
};

/**
 * L'immagine può essere scaricata se:
 *  1. Il referto prevede la possibilità di generarla
 *  2. Lo stato dell'immagine permette il download (es: è stata generata)
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se è possibile scaricare l'immagine, false altrimenti
 */
export const canDownloadImageRol = document => {
  let status = getImageStatusRol(document);
  let isDownloadable = IMAGE_STATUS_CODE_LIST_DOWNLOADABLE.includes(status);
  return _canGenerateImageRol(document) && isDownloadable;
};

/**
 * E' possibile pagare il documento se:
 *  1. Rientra in una delle tipologie "pagabili"
 *  2. Ha uno stato per cui è consentito il pagamento
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se è possibile pagare il documento, false altrimenti
 */
export const canPayRol = document => {
  let rol = document?.rol;
  let typeCode = getTypeCodeRol(document);
  let paymentStatus = getPaymentStatusRol(document);

  return (
    rol === "S" &&
    DOCUMENT_TYPE_CODE_LIST_PAYABLE.includes(typeCode) &&
    PAYMENT_STATUS_CODE_LIST_PAYABLE.includes(paymentStatus)
  );
};

/**
 * Il documento è "in scadenza" quando days(data_scadenza - now) < giorni_scadenza
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il documento è in scadenza, false altrimenti
 */
export const isExpiringRol = document => {
  let now = new Date();
  let upperBound = document?.data_scaricabile_fino_al;
  let lowerBound = subtractFromDate(upperBound, {
    days: DOCUMENT_EXPIRING_DAYS
  });

  upperBound = endOfDate(upperBound, "day");
  lowerBound = startOfDate(lowerBound, "day");

  return isBetweenDates(now, lowerBound, upperBound);
};

/**
 * Il documento è scaduto quando la sua data di fine validità è nel passato
 *
 * @param document Il documento da controllare
 * @returns {boolean} true se il documento è scaduto, false altrimenti
 */
export const isExpiredRol = document => {
  let now = new Date();

  let expireDate = document?.data_scaricabile_fino_al;
  return getDateDiff(expireDate, now, "days") < 0;
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
console.log('birthDate', birthDate)
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

export const scrollToElement = (element, duration = DEFAULT_SCROLL_DURATION) => {
  let target = getScrollTarget(element);
  let offset = element.offsetTop;
  setScrollPosition(target, offset, duration)
};


export const  attachmentName = (attachment) => {
  let structureName = attachment.descrizione_struttura ?? ''
  let aslName = attachment.azienda?.descrizione ?? ''
  let issueDate = attachment.data_validazione ? date.formatDate(attachment.data_validazione, 'DD/MM/YYYY') : ''

  return `${structureName} - ${aslName} - ${issueDate}`

}


export const getGender = (taxCode = "") => {
  let dayAndGenderPart = extractBirthDayAndGenderPart(taxCode);
  let number = Number(dayAndGenderPart);
  if (isNaN(number)) return undefined;
  return number > 40 ? GENDERS.FEMALE : GENDERS.MALE;
};


export const doctorIcon = (taxCode = "") => {
  let doctorGender  = getGender(taxCode)
  let gender = doctorGender === 'F' ? 'donna' : 'uomo'
  return `img:/statics/la-mia-salute/icone/medico-${gender}.svg`
}


export const searchMessageRegex = (str) =>{
  let escapeRegEx = str.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  //return new RegExp('\\b' + escapeRegEx + '[a-zA-Z0-9]*', 'gi')
  return new RegExp('\\b(' + escapeRegEx + ')\\w*', 'gi')


}



export const hasEnrollmentBlock = () => {
  let enrollmentCode = store.getters["getEnrollmentCode"];
  return ENROLLMENT_BLOCK_CODE_LIST.includes(enrollmentCode);
}



export const hasEnrollmentWarning = () => {
  let enrollmentCode = store.getters["getEnrollmentCode"];
  return ENROLLMENT_WARNING_CODE_LIST.includes(enrollmentCode);
}


export const isUserEnabled = () => {
  let enablingInfo = store.getters["getUserEnablingInfo"]
  let hasNoDoctor = store.getters["isNotDoctor"];
  let enrollmentWarning = hasEnrollmentWarning()

  return enablingInfo === USER_ENABLING_MAP.ENABLE && !enrollmentWarning && !hasNoDoctor

}
