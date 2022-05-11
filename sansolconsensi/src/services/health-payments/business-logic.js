/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config'
import {uid} from 'quasar'


// Controlla se un metodo di pagamento è PSP piuttosto che POS
// Attualmente solo PagoPA è di tipo PSP, perciò basta controllare se il pagamento è proprio PagoPA
export const isPspPaymentMethod = (paymentMethod) => {
  return paymentMethod.id === config.healthPayments.pspPaymentMethod.id
}


// Controlla se un pagamento sanitario è da considerarsi come "Da Pagare"
// Un ticket è considerato da pagare se è interamente da pagare, cioè se
// l'importo da pagare è > 0 e l'importo da pagare è <= 0
export const isToPay = (healthPayment) => {

  // let payableImport = 0
  // let payedImport = 0
  // if (healthPayment.da_pagare) payableImport = healthPayment.da_pagare.valore || 0
  // if (healthPayment.pagato) payedImport = healthPayment.pagato.valore || 0

  return healthPayment.stato && healthPayment.stato.includes(config.healthPayments.paymentStatuss.TO_PAY)
  // && payableImport > 0
  // && payedImport <= 0
}


// Controlla se un pagamento sanitario è da considerarsi "Pagato"
export const isPayed = (healthPayment) => {
  // return healthPayment.stato === config.healthPayments.paymentStatuss.PAYED
  return !isToPay(healthPayment)
}


// Controlla se un pagamento può essere aggiunto al carrello
export const canAddToCart = (healthPayment) => {
  return healthPayment.asr.canale_psp;
}

export const normalizeRefund = (refund) => {
  return {
    __id: uid(),
    ...refund.lista_prenotazione[0],
    paziente: refund.paziente,
    stato: {
      codice: refund.errore.codice,
      descrizione: refund.errore.messaggio
    }
  }
}

// Un rimborso è compatibile con un ticket quando le seguenti condizioni sono vere:
//    1: L'utente è lo stesso
//    2: L'ASR è la stessa
//    3: Il codice versamento è lo stesso
//    4: Il codice servizio è lo stesso
//    5: Il motivo di pagamento è lo stesso
export const isRefundCompatible = (healthPayment, refund) => {
  let rTaxCode = refund && refund.paziente && refund.paziente.codice_fiscale
  let rAsr = refund && refund.prenotazione && refund.prenotazione.asr_beneficiaria
  let rPaymentCode = refund && refund.codice_versamento
  let rServiceCode = refund && refund.prenotazione && refund.prenotazione.codice_servizio
  let rPaymentReason = refund && refund.prenotazione && refund.prenotazione.motivo_pagamento

  let hTaxCode = healthPayment && healthPayment.paziente && refund.paziente.codice_fiscale
  let hAsr = healthPayment && healthPayment.asr && healthPayment.asr.id
  let hPaymentCode = healthPayment && healthPayment.codice_versamento
  let hServiceCode = healthPayment && healthPayment.codice_servizio
  //let hPaymentReason = healthPayment && healthPayment.motivo
  let hPaymentReason = healthPayment && healthPayment.numero_pratica_regionale && healthPayment.numero_pratica_regionale.charAt(0)

  return rTaxCode === hTaxCode
    && "" + rAsr === "" + hAsr
    && rPaymentCode === hPaymentCode
    && rServiceCode === hServiceCode
    && rPaymentReason === hPaymentReason
}


export const getCompatibleRefunds = (healthPayment, refundList) => {
  return refundList.filter(r => isRefundCompatible(healthPayment, r))
}


export const getCompatibleHealthPayments = (refund, healthPaymentList) => {
  return healthPaymentList.filter(h => isRefundCompatible(h, refund))
}

