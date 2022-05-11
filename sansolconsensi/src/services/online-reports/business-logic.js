/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config'
import isFuture from 'date-fns/is_future'
import subDays from 'date-fns/sub_days'
import isWithinRange from 'date-fns/is_within_range'
import endOfDay from 'date-fns/end_of_day'
import startOfDay from 'date-fns/start_of_day'
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import {SessionStorage} from 'quasar'
import qs from 'qs'
import {openURL} from 'quasar'
import {is} from "@validators/global";


export const getTypeCode = report => {
  return report.tipo_documento.codice
}

export const getPaymentStatus = report => {
  // return report.stato_pagamento
  return report.pagato_ticket_stato
}

export const getImageStatus = report => {
  return report.stato_richiesta
}

export const getTypeLabel = type => {
  return config.onlineReports.types2label[type]
}

export const getPaymentStatusLabel = report => {
  let status = getPaymentStatus(report)
  return config.onlineReports.paymentStatus2Label[status]
}


export const getOsLabel = os => {
  return config.onlineReports.os2label[os]
}

export const getAsl = report => {
  return report.luogo_produzione_documento.azienda
}

export const hasAccessionNumbers = report => {
  // il campo "accession_number" è un flag che può valere S o N a seconda se è presente o meno uno o più "accession_numbers"
  return report.accession_number === 'S'
}

export const getImageDownloadPin = report => {
  if (!hasAccessionNumbers(report)) console.warn(`Stai provando ad ottenere il PIN per un'immagine non scaricabile`)
  return report.accession_numbers[0]
}

export const getPayableImport = report => {
  if (!report.ticket_da_pagare) return null
  return report.ticket_da_pagare.valore
}

export const getPayedImport = report => {
  if (!report.ticket_pagato) return null
  return report.ticket_pagato.valore
}

export const hasRefund = report => {
  let status = getPaymentStatus(report)
  return status === config.onlineReports.paymentStatuss.REFUND
}

export const isRefundDownloadable = report => {
  let isRefund = hasRefund(report)
  let payable = getPayableImport(report)
  let payed = getPayedImport(report)
  return isRefund && (payable !== null || payed !== null)
}

// Un referto è scaricabile se
//  1. il download è abilitato, cioè non deve essere "oscurata" la possibilità di download
//  2. la data di scadenza download non è passata
//  3. può essere sempre scaricato oppure il ticket è considerato pagato
export const canDownloadPdf = report => {
  let paymentStatus = getPaymentStatus(report)
  let _isRefundDownloadable = isRefundDownloadable(report)
  let visibleCodes = ['N', 'M']

  let isVisible = visibleCodes.includes(report.oscura_scarico_cittadino)
  let hasValidStatus = config.onlineReports.downloadablePdfPaymentStatuss.includes(paymentStatus)
  hasValidStatus = hasValidStatus || _isRefundDownloadable
  hasValidStatus = hasValidStatus || report.scaricabile_se_ticket_non_pagato

  return isVisible && isFuture(report.data_scaricabile_fino_al) && hasValidStatus
}


// L'immagine del referto può essere generata se:
//  1. il referto è scaricabile
//  2. il referto deve reintrare tra le categorie che permettono il download dell'immagine
//  3. deve avere l'accession number (Questo perchè se mandano un referto di radiologia da una ASL su cui non abbiamo
//     l'integrazione con le immagini NON DEVE essere visualizzato il pulsante di download immagini)
const _canGenerateImage = report => {
  let typeCode = getTypeCode(report)
  return canDownloadPdf(report)
    && config.onlineReports.downloadableImagesTypes.includes(typeCode)
    && hasAccessionNumbers(report)
}


// Controlla se per il client (session storage) l'immagine del report è già stata prenotata
// @NOTE: abbiamo bisogno di salvare l'unformazione sul client dal momento che la modifica di stato sul server non è immediato
//        questo potrebbe causare una prenotazione multipla delle immagini ed offre anche una UX non ottimale dal momento che
//        l'utente prenota l'immagine e poi vede che non è successo nulla, anzi può prenotarla di nuovo
//        e potrebbe sembrare un errore silente
const _isRequested = report => {
  let key = `rol_report_image_requested_${report.id_referto}`
  return SessionStorage.has(key) && SessionStorage.get.item(key) === true
}


// L'immagine può essere prenotata se:
//  1. il referto prevede la possibilità di generarla
//  2. lo stato dell'immagine permette la generazione (es: non è già generata)
//  3. la richiesta di prenotazione non è salvata nel client
export const canRequestImage = report => {
  let imageStatus = getImageStatus(report)
  let hasRequestableStatus = config.onlineReports.requestableImagesStatuss.includes(imageStatus)
  return _canGenerateImage(report)
    && hasRequestableStatus
}


// L'immagine viene considerata "In elaborazione" quando
//  1. il referto prevede la possibilità di generarla
//  2. lo stato dell'immagine indica che è in generazione oppure abbiamo salvato sul client che la richiesta è stata effettuata
export const isImageInElaboration = report => {
  let imageStatus = getImageStatus(report)
  let hasElaborationStatus = config.onlineReports.imageInElaborationStatuss.includes(imageStatus)
  return _canGenerateImage(report)
    && (hasElaborationStatus)
}


// L'immagine viene considerata "in errore irreversibile" quando
//  1. il referto prevede la possibilità di generarla
//  2. lo stato dell'immagine indica che è in errore
export const imageHasIrreversibleError = report => {
  let imageStatus = getImageStatus(report)
  let hasErrorStatus = config.onlineReports.imageIrreversibleErrorStatuss.includes(imageStatus)
  return _canGenerateImage(report)
    && (hasErrorStatus)
}


// L'immagine può essere sacricata se:
//  1. il referto prevede la possibilità di generarla
//  2. lo stato dell'immagine permette il download (es: è stata generata)
export const canDownloadImage = report => {
  let imageStatus = getImageStatus(report)
  return _canGenerateImage(report)
    && config.onlineReports.downloadableImagesStatuss.includes(imageStatus)
}

export const canPay = report => {
  let typeCode = getTypeCode(report)
  let paymentStatus = getPaymentStatus(report)
  return config.onlineReports.payableTypes.includes(typeCode)
    && config.onlineReports.payablePaymentStatuss.includes(paymentStatus)
}


// Il referto sta per scadere?
// Un referto sta per scadere quando days(data_scadenza - now) < giorni_scadenza
export const isExpiring = report => {
  let now = new Date()
  let upperBound = report.data_scaricabile_fino_al
  let lowerBound = subDays(upperBound, config.onlineReports.expiringDays)
  return isWithinRange(now, startOfDay(lowerBound), endOfDay(upperBound))
}

// Il referto è scaduto?
// Un referto è scaduto quando la sua data di fine validità è passata
export const isExpired = report => {
  let now = new Date()
  let expireDate = report.data_scaricabile_fino_al
  return differenceInCalendarDays(expireDate, now) < 0
  // return isFuture(now, expireDate)
}


export const onPayOldAsr = report => {
  let baseUrl = 'url'
  let asl = getAsl(report)
  let query = {servizio: 'ticket', idAsl: asl ? asl.codice : 'UNKNOWN'}
  let queryString = qs.stringify(query)
  let url = `${baseUrl}?${queryString}`
  let win = openURL(url)
}
