/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { SessionStorage, openURL, date } from "quasar";
import qs from "qs";
import {
  IMAGE_OS_LABEL_MAP,
  REPORT_EXPIRING_DAYS,
  REPORT_IMAGE_STATUS_DOWNLOADABLE_LIST,
  REPORT_IMAGE_STATUS_ERROR_LIST,
  REPORT_IMAGE_STATUS_IN_ELABORATION_LIST,
  REPORT_IMAGE_STATUS_REQUESTABLE_LIST,
  REPORT_PAYMENT_STATUS_DOWNLOADABLE_LIST,
  REPORT_PAYMENT_STATUS_LABEL_MAP,
  REPORT_PAYMENT_STATUS_MAP,
  REPORT_PAYMENT_STATUS_PAYABLE_LIST,
  REPORT_TYPE_DOWNLOADABLE_IMAGE_LIST,
  REPORT_TYPE_LABEL_MAP,
  REPORT_TYPES_PAYABLE_LIST
} from "src/services/config";

const {
  getDateDiff,
  startOfDate,
  endOfDate,
  isBetweenDates,
  subtractFromDate
} = date;

export const getTypeCode = report => {
  return report?.tipo_documento?.codice ?? null;
};

export const getPaymentStatus = report => {
  // return report?.stato_pagamento ?? null
  return report?.pagato_ticket_stato ?? null;
};

export const getImageStatus = report => {
  return report?.stato_richiesta ?? null;
};

export const getTypeLabel = type => {
  return REPORT_TYPE_LABEL_MAP[type];
};

export const getPaymentStatusLabel = report => {
  let status = getPaymentStatus(report);
  return REPORT_PAYMENT_STATUS_LABEL_MAP[status];
};

export const getOsLabel = os => {
  return IMAGE_OS_LABEL_MAP[os];
};

export const getAsl = report => {
  return report?.luogo_produzione_documento?.azienda ?? null;
};

// il campo "accession_number" è un flag che può valere S o N a seconda se è presente o meno uno o più "accession_numbers"
export const hasAccessionNumbers = report => {
  return report?.accession_number === "S";
};

export const getImageDownloadPin = report => {
  if (!hasAccessionNumbers(report)) {
    console.warn(
      `Stai provando ad ottenere il PIN per un'immagine non scaricabile`
    );
  }


  return report?.accession_numbers?.[0] ?? null;
};

export const getPayableImport = report => {
  return report?.ticket_da_pagare?.valore ?? null;
};

export const getPayedImport = report => {
  return report?.ticket_pagato?.valore ?? null;
};

export const hasRefund = report => {
  let status = getPaymentStatus(report);
  let statusList = [REPORT_PAYMENT_STATUS_MAP.REFUND];

  return statusList.includes(status);
};

export const isRefundDownloadable = report => {
  let isRefund = hasRefund(report);
  let payable = getPayableImport(report);
  let payed = getPayedImport(report);
  return isRefund && (payable !== null || payed !== null);
};

// Un referto è scaricabile se
//  1. il download è abilitato, cioè non deve essere "oscurata" la possibilità di download
//  2. la data di scadenza download non è passata
//  3. può essere sempre scaricato oppure il ticket è considerato pagato
export const canDownloadPdf = report => {
  let paymentStatus = getPaymentStatus(report);
  let _isRefundDownloadable = isRefundDownloadable(report);
  let visibleCodes = ["N", "M"];

  let isVisible = visibleCodes.includes(report?.oscura_scarico_cittadino);
  let hasValidStatus = REPORT_PAYMENT_STATUS_DOWNLOADABLE_LIST.includes(
    paymentStatus
  );
  hasValidStatus = hasValidStatus || _isRefundDownloadable;
  hasValidStatus = hasValidStatus || report?.scaricabile_se_ticket_non_pagato;

  let isFutureDate =
    getDateDiff(new Date(), report?.data_scaricabile_fino_al, "days") <= 0;

  return isVisible && isFutureDate && hasValidStatus;
};

// L'immagine del referto può essere generata se:
//  1. il referto è scaricabile
//  2. il referto deve reintrare tra le categorie che permettono il download dell'immagine
//  3. deve avere l'accession number (Questo perchè se mandano un referto di radiologia da una ASL su cui non abbiamo
//     l'integrazione con le immagini NON DEVE essere visualizzato il pulsante di download immagini)
const _canGenerateImage = report => {
  let typeCode = getTypeCode(report);
  return (
    canDownloadPdf(report) &&
    REPORT_TYPE_DOWNLOADABLE_IMAGE_LIST.includes(typeCode) &&
    hasAccessionNumbers(report)
  );
};

// Controlla se per il client (session storage) l'immagine del report è già stata prenotata
// @NOTE: abbiamo bisogno di salvare l'unformazione sul client dal momento che la modifica di stato sul server non è immediato
//        questo potrebbe causare una prenotazione multipla delle immagini ed offre anche una UX non ottimale dal momento che
//        l'utente prenota l'immagine e poi vede che non è successo nulla, anzi può prenotarla di nuovo
//        e potrebbe sembrare un errore silente
const _isRequested = report => {
  let key = `rol_report_image_requested_${report?.id_referto}`;
  return SessionStorage.has(key) && SessionStorage.getItem(key) === true;
};

// L'immagine può essere prenotata se:
//  1. il referto prevede la possibilità di generarla
//  2. lo stato dell'immagine permette la generazione (es: non è già generata)
//  3. la richiesta di prenotazione non è salvata nel client
export const canRequestImage = report => {
  let imageStatus = getImageStatus(report);
  let hasRequestableStatus = REPORT_IMAGE_STATUS_REQUESTABLE_LIST.includes(
    imageStatus
  );

  return _canGenerateImage(report) && hasRequestableStatus;
};

// L'immagine viene considerata "In elaborazione" quando
//  1. il referto prevede la possibilità di generarla
//  2. lo stato dell'immagine indica che è in generazione oppure abbiamo salvato sul client che la richiesta è stata effettuata
export const isImageInElaboration = report => {
  let imageStatus = getImageStatus(report);
  let hasElaborationStatus = REPORT_IMAGE_STATUS_IN_ELABORATION_LIST.includes(
    imageStatus
  );

  return _canGenerateImage(report) && hasElaborationStatus;
};

// L'immagine viene considerata "in errore irreversibile" quando
//  1. il referto prevede la possibilità di generarla
//  2. lo stato dell'immagine indica che è in errore
export const imageHasIrreversibleError = report => {
  let imageStatus = getImageStatus(report);
  let hasErrorStatus = REPORT_IMAGE_STATUS_ERROR_LIST.includes(imageStatus);
  return _canGenerateImage(report) && hasErrorStatus;
};

// L'immagine può essere sacricata se:
//  1. il referto prevede la possibilità di generarla
//  2. lo stato dell'immagine permette il download (es: è stata generata)
export const canDownloadImage = report => {
  let imageStatus = getImageStatus(report);
  return (
    _canGenerateImage(report) &&
    REPORT_IMAGE_STATUS_DOWNLOADABLE_LIST.includes(imageStatus)
  );
};

export const canPay = report => {
  let typeCode = getTypeCode(report);
  let paymentStatus = getPaymentStatus(report);
  return (
    REPORT_TYPES_PAYABLE_LIST.includes(typeCode) &&
    REPORT_PAYMENT_STATUS_PAYABLE_LIST.includes(paymentStatus)
  );
};

// Il referto sta per scadere?
// Un referto sta per scadere quando days(data_scadenza - now) < giorni_scadenza
export const isExpiring = report => {
  let now = new Date();
  let upperBound = report?.data_scaricabile_fino_al;
  let lowerBound = subtractFromDate(upperBound, { days: REPORT_EXPIRING_DAYS });

  lowerBound = startOfDate(lowerBound, "day");
  upperBound = endOfDate(upperBound, "day");

  return isBetweenDates(now, lowerBound, upperBound);
};

// Il referto è scaduto?
// Un referto è scaduto quando la sua data di fine validità è passata
export const isExpired = report => {
  let now = new Date();
  let expireDate = report?.data_scaricabile_fino_al;
  return getDateDiff(now, expireDate, "days") < 0;
};

export const onPayOldAsr = report => {
  let baseUrl = "url";
  let asl = getAsl(report);
  let query = { servizio: "ticket", idAsl: asl ? asl.codice : "UNKNOWN" };
  let queryString = qs.stringify(query);
  let url = `${baseUrl}?${queryString}`;
  let win = openURL(url);
};
