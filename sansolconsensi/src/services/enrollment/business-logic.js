/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config'
export const canOpenFse = (activeUserEnrollmentInfo, isDelegationActive, isDeclarationActive) => {

  // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile
  let isEnrollable = activeUserEnrollmentInfo && activeUserEnrollmentInfo.risposta;
  let code = activeUserEnrollmentInfo
    ? activeUserEnrollmentInfo.codice_risposta
    : null;
  let enrollableCodes = [
    config.enrollment.DO_NOT_ASK_ME_AGAIN,
    config.enrollment.codes.FSE_NOT_APPROVED
  ];
  // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile oppure se ha un codice
  // che permette l'arruolamento
  isEnrollable = isEnrollable || enrollableCodes.includes(code);

  // Se la delega non è attiva => basta controllare se l'utente risulta "arruolabile"
  if (!isDelegationActive) return isEnrollable;

  // Se la delega è attiva => è possibile aprire il FSE solo per i minori
  return isDeclarationActive;
}


export const urlEnrollment = (serviceCode, isDeclarationActive, isDelegationActive, activeDelegation) =>{
  let url = `/la-mia-salute/arruolamento/#/?servizio=${serviceCode}`
  let uuid= activeDelegation ?  activeDelegation.uuid : ''
  if (isDeclarationActive) {
    url += `&minore=${uuid}`;
  }else if(isDelegationActive){
    url += `&d=${uuid}`;
  }
  return url
}
