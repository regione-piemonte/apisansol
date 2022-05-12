/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

let config = {}

config.cartMaxLength = 5;

// Canale di pagamento pagoPA che rispecchia la stessa struttura del campo "pos" delle API
config.pspPaymentMethod = {
  id: -1,
  tesoriere: {
    id: -1,
    descrizione: "PagoPA",
    // descrizione: "È il nodo unico dei pagamenti pubblici italiani. Le forme di pagamento elettronico accettate e le commissioni possono variare a seconda delle scelte successive.",
    url_logo: 'url',
  },
  carte_commissione: []
}


config.procedureTypes = {
  PRATICA: 'PRATICA',
  RICETTA: 'RICETTA',
}


config.paymentStatuss = {
  PAYED: 'Pagato',
  TO_PAY: '(000)'
}

config.deliveryStatuss = {
  TO_BE_DISPENSED: 0,
  IN_DELIVERY: 1,
  DISBURSED: 2
}

export default config
