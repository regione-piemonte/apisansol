/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import differenceInYears from 'date-fns/difference_in_years'
import addDays from 'date-fns/add_days';
import {config} from '@plugins/config'
import {defaultTo, orderBy} from "@services/global/utils";

// DELEGHE
// ---------------------------------------------------------------------------------------------------------------------
// Restituisce una mappa contenente gli stati delle deleghe
export const getDelegationStatuss = () => config.delegations.delegationStatuss;

// Dato uno status, restituisce la label associata
export const getDelegationStatusLabel = status => config.delegations.delegationStatus2Label[status];

// Dato un servizio, restituisce il numero di giorni massimo di delegabilità
export const getDelegationDaysInterval = service => {
  let value = service && service.numero_giorni_delegabile || null;
  value = defaultTo(value, config.delegations.defaultDelegationDaysInterval);
  // Il massimo accettabile è config.delegations.defaultDelegationDaysInterval
  return Math.min(value, config.delegations.defaultDelegationDaysInterval)
};

// Dato uno status, restituisce true se può essere considerato "valido", false altrimenti
export const isDelegationValid = status => {
  return config.delegations.delegationValidStatuss.includes(status)
};

// Permette di ottenere le sole delege attive in una lista di deleghe
export const getActiveDelegations = delegations => {
  return delegations.filter(d => isDelegationValid(d.stato_delega))
};

// Costruisce una delega di default: quella in fase di creazione
export const buildDefaultDelegation = service => {
  let now = new Date()
  let dayDifference = getDelegationDaysInterval(service);

  return {
    codice_servizio: service.codice_servizio,
    data_inizio_delega: now.toISOString(),
    data_fine_delega: addDays(now, dayDifference).toISOString(),
    stato_delega: config.delegations.delegationStatuss.NOT_ACTIVE,
    tipo_delega: config.delegations.delegationTypeCodes.ADULT,
    grado_delega: config.delegations.delegationRankCodes.WEAK,
  }
};

// Permette di ottenre l'ultima delega creata per un dato servizio
export const getLastDelegation = (delegations, serviceCode) => {
  let serviceDelegations = delegations.filter(d => d.codice_servizio === serviceCode)
  let serviceDelegationsOrdered = orderBy(serviceDelegations, d => {
    return d.data_revoca || d.data_rinuncia || d.data_inizio_delega
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

// Permette di ottenre solo le deleghe da passare nel payload per la creazione e l'aggiornamento delle deleghe
// Attualmente filtra le deleghe prima per ottenere lo stato attuale e poi rimuove tutte quelle impostate come
// "Non attive"
export const getDelegationPayload = delegations => {
  let lastDelegations = getLastDelegations(delegations)
  return lastDelegations.filter(d => d.stato_delega !== config.delegations.delegationStatuss.NOT_ACTIVE)
};

// DICHIARAZIONI
// ---------------------------------------------------------------------------------------------------------------------
// Dato un delegante, restituisce true se si tratta di un minore, false altrimenti
export const isDelegatorMinor = delegator => {
  return differenceInYears(new Date(), delegator.data_nascita_delega) < 18;
};

// Permette di ottenere il codice del tipo di dichiarazione
export const getDeclarationTypeCode = (declaration) => {
  return declaration && declaration.tipo && declaration.tipo.codice
};

// DICHIARAZIONI MINORI
// ---------------------------------------------------------------------------------------------------------------------
// Permette di sapere se una dichiarazione è una dichiarazione per minori
export const isDeclarationMinor = (declaration) => {
  let code = getDeclarationTypeCode(declaration);
  let codes = [
    config.delegations.declarationTypeCodes.PARENTS_MONO,
    config.delegations.declarationTypeCodes.PARENTS_MULTI,
  ];

  return codes.includes(code)
};

export const isDeclarationMinorRevocable = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf);
  let statusCode = item && item.stato && item.stato.codice;
  let statusCodes = [
    config.delegations.declarationDetailStatusCodes.VALIDATE_OPERATOR,
    config.delegations.declarationDetailStatusCodes.VALIDATE_USER,
  ];

  return statusCodes.includes(statusCode);
};

// Permette di ottenere il dettaglio del genitore
export const getParentDeclarationDetailItem = (declaration, cf) => {
  let details = declaration && declaration.dettagli || [];
  let detail = details.find(d => d.genitore_tutore_curatore && d.genitore_tutore_curatore.codice_fiscale === cf);
  return detail;
};

// Permette di ottenere il dettaglio dell'altro genitore.
// Utile nelle dichiarazioni multi genitore.
export const getOtherParentDeclarationDetailItem = (declaration, cf) => {
  return declaration.dettagli.find(d => d.genitore_tutore_curatore.codice_fiscale !== cf)
};

// Permette di ottenere il genitore della dichiarazione
export const getDeclarationParent = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf)
  return item.genitore_tutore_curatore
};

// Permette di ottenere l'altro genitore.
// Utile nelle dichiarazioni multi genitore.
export const getDeclarationOtherParent = (declaration, cf) => {
  let item = getOtherParentDeclarationDetailItem(declaration, cf)
  return item && item.genitore_tutore_curatore || null
};

// Permette di ottenere il ruolo di un genitore nella dichiarazione
export const getParentDeclarationRole = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf)
  return item.ruolo_genitore_tutore_curatore
};

// Permette di ottenere il ruolo dell'altro genitore nella dichiarazione
// Utile nelle dichiarazioni multi genitore.
export const getOtherParentDeclarationRole = (declaration, cf) => {
  let item = getOtherParentDeclarationDetailItem(declaration, cf)
  return item.ruolo_genitore_tutore_curatore
};

// @NOTE: il ruolo "GENITORE_1" indica il genitore che ha richiesto la dichiarazione
// @NOTE: il ruolo "GENITORE_2" indica il genitore che deve confermare la dichiarazione
export const isDeclarationRequestingParent = (declaration, cf) => {
  let role = getParentDeclarationRole(declaration, cf)
  return role.codice === config.delegations.declarationDetailRoleCodes.PARENT_1
};

// Permette di ottenere lo stato per il genitore
export const getParentDeclarationStatus = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf)
  return item.stato
};

// Permette di ottenere lo stato dell'altro genitore
// Utile nelle dichiarazione multi genitore
export const getOtherParentDeclarationStatus = (declaration, cf) => {
  let item = getOtherParentDeclarationDetailItem(declaration, cf)
  return item.stato
};

// Permette di ottenere il minore nella dichiarazione
export const getDeclarationMinor = (declaration) => {
  return declaration.dettagli[0].figlio_tutelato_curato
};

// DICHIARAZIONI PER TUTELE
// ---------------------------------------------------------------------------------------------------------------------
// Permette di sapere se una dichiarazione è una dichiarazione per minori
export const isDeclarationProtection = (declaration) => {
  let code = getDeclarationTypeCode(declaration);
  let codes = [
    config.delegations.declarationTypeCodes.PROTECTION_MINOR,
    config.delegations.declarationTypeCodes.PROTECTION_MAJOR,
    config.delegations.declarationTypeCodes.SUPPORT,
  ];

  return codes.includes(code)
};

export const isDeclarationProtectionRevocable = (declaration, cf) => {
  let item = getParentDeclarationDetailItem(declaration, cf);
  let statusCode = item && item.stato && item.stato.codice;
  let statusCodes = [
    config.delegations.declarationDetailStatusCodes.VALIDATE_OPERATOR,
    config.delegations.declarationDetailStatusCodes.VALIDATE_USER,
  ];

  return statusCodes.includes(statusCode);
};

// Permette di ottenere il soggetto tuttelato nella dichiarazione per tutela
export const getDeclarationProtected = (declaration) => {
  return declaration.dettagli[0].figlio_tutelato_curato
};

// Permette di ottenere il soggetto tutelante nella dichiarazione per tutela
export const getDeclarationProtector = (declaration) => {
  return declaration.dettagli[0].genitore_tutore_curatore
};
