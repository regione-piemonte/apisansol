/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { httpAuth, httpPublic } from "src/boot/http";
import {getUri} from "src/services/utils";
import { openURL } from 'quasar'

export const getUser = (httpConfig = {}) => {
  return httpAuth.get("/bff/identity", httpConfig);
};

export const getConfig = (httpConfig = {}) => {
  return httpPublic.get("/lms/api/v1/configurazione", httpConfig);
};



// DELEGHE
// ---------------------------------------------------------------------------------------------------------------------
export const getDelegatorList = (taxCode, httpConfig = {}) => {
  const url = `/apisanaut/api/v1/cittadini/${taxCode}/deleganti`;
  return httpAuth.get(url, httpConfig);
};

// NOTIFICATORE
// ---------------------------------------------------------------------------------------------------------------------
export const getNotifyMessages = (taxCode, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-lms`;
  return httpAuth.get(url, httpConfig);
};

export const getNotifyMessagesUnseen = (taxCode, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-unseen`;
  return httpAuth.get(url, httpConfig);
};

export const updateMessagesAsSeen = (taxCode, payload, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages-unseen`;
  return httpAuth.put(url, payload, httpConfig);
};

export const deleteMessage = (taxCode, id, httpConfig = {}) => {
  const url = `/notify-messagestore/api/v1/users/${taxCode}/messages/${id}`;
  return httpAuth.delete(url, httpConfig);
};

export const getNotifyContacts = (taxCode, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/contacts`;
  return httpAuth.get(url, httpConfig);
};

export const updateNotifyContacts = (taxCode, payload, httpConfig = {}) => {
  const url = `/notify-preferences/api/v1/users/${taxCode}/contacts`;
  return httpAuth.put(url, payload, httpConfig);
};

// FSE
// ---------------------------------------------------------------------------------------------------------------------
export const getEnrollmentInfo = (taxCode, httpConfig = {}) => {
  const url = `/apisanfse/api/v1/cittadini/${taxCode}/arruolamento`;
  return httpAuth.get(url, httpConfig);
};

// FESTRATTO-CONTO
// ---------------------------------------------------------------------------------------------------------------------

export const getPaymentMode = ( httpConfig = {}) => {
  const url = `/apisanpag/api/v1/modalita-erogazione-ammissibili`;
  return httpAuth.get(url, httpConfig);
};

export const getPaidTicketList = ( taxCode, httpConfig = {}) => {
  const url = `/apisanffe/api/v1/cittadini/${taxCode}/ticket-pagati`;
  return httpAuth.get(url, httpConfig);
};

export const getRefundsList = ( taxCode, httpConfig = {}) => {
  const url = `/apisanffe/api/v1/cittadini/${taxCode}/rimborsi`;
  return httpAuth.get(url, httpConfig);
};

export const downloadReceipt = ( taxCode, ticketId, receiptId, httpConfig = {}) => {
  const url = getUri({
    url:`${httpAuth.defaults.baseURL}/apisanffe/api/v1/cittadini/${taxCode}/ticket-pagati/${ticketId}/ricevute-pagamento/${receiptId}/pdf`,
    ...httpConfig
  })

  openURL(url);
  return url
};



export const downloadRefund = ( taxCode, ticketId, receiptId, httpConfig = {}) => {
  const url = httpAuth.getUri({
    url:`${httpAuth.defaults.baseURL}/apisanffe/api/v1/cittadini/${taxCode}/ticket-pagati/${ticketId}/ricevute-rimborso/${receiptId}/pdf`,
    ...httpConfig
  });
  openURL(url);
  return url
};

export const newRefundPost = (taxCode, ticketId, payload, httpConfig = {}) => {
  const url = `/apisanffe/api/v1/cittadini/${taxCode}/ticket-pagati/${ticketId}/rimborso`;
  return httpAuth.post(url,payload,httpConfig);
}

export const getAslList = ( httpConfig = {}) => {
  const url = `/apisanpag/api/v1/asr-temp`;
  return httpAuth.get(url, httpConfig);
}
