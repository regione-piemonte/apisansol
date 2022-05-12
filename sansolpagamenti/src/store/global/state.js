/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export default {
  // Lista dei servizi applicativi (accelleratori) e relativi metadati
  appServices: [],
  // L'identità dell'utente loggato
  userIdentity: undefined,
  // Il profilo dell'utente loggato
  userProfile: undefined,
  // Contatti UNP dell'utente loggato
  userContacts: undefined,
  // Informazioni sul FSE dell'utente loggato
  enrollmentInfo: undefined,
  // Token FCM per le notifiche push
  fcmToken: undefined,
  // La configurazione dinamica dell'app che ci arriva dal BFF
  appConfig: undefined,
  // Lista di messaggi dinamici provenienti dalle API esposte dal CMS
  messageList: [],
  // L'elenco delle applicazioni che fanno parte del progetto "La mia salute"
  // e censite sul DB
  appList: [],
  // L'elenco delle associazioni applicazione-utente
  userApplicationsList: [],
}
