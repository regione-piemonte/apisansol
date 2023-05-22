/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */

export const IS_DEV = process.env.APP_IS_DEV;
export const IS_TEST = process.env.APP_IS_TEST;
export const IS_ALPHA_CERT = process.env.APP_IS_ALPHA_CERT;
export const IS_PROD = process.env.APP_IS_PROD;

export const DELEGATION_STATUS_MAP = {
  ACTIVE: "ATTIVA",
  NOT_ACTIVE: "NON ATTIVA",
  REVOKED: "REVOCATA",
  REFUSED: "RIFIUTATA",
  IS_EXPIRING: "IN_SCADENZA",
  EXPIRED: "SCADUTA",
  UPDATED: "AGGIORNATA"
};


export const FORMAT_DATE = "DD/MM/YYYY";


export const CHANGE_OPERATIONS_MAP = {
  CREATE: 'C',
  MODIFY: 'M',
  REMOVE: 'R'
}
export const GEOPOSITION_LABEL = "LA TUA POSIZIONE";
export const DEFAULT_DISTANCE = 5

export const PHARMACY_ICON_URL = "img:/statics/la-mia-salute/icone/farmacia.svg"


export const USER_DEVICE_UUID_KEY = "DEVICE_UUID"

export const DEVICE_SOURCE_CODES = {
  CITIZEN: "cittadino",
  OPERATOR: "operatore"
}

export const FSE_APP_CODE = "CODE";


export const ONBOARDING_LIST_ITEMS = [
  {
    title: `<h1>Da oggi puoi ricevere i tuoi medicinali in qualunque farmacia <strong>aderente al servizio</strong>, senza bisogno di portare con te la ricetta</h1>`,
    description: `<p>È molto semplice! Basta scegliere dove intendi ritirare i farmaci e presentare la Tessera Sanitaria: le farmacie potranno visualizzare le tue prescrizioni dematerializzate e consegnare i medicinali, a te e alle persone delegate, senza necessità di ricetta cartacea. Una soluzione pratica!</p
        <p>Ricorda: per utilizzare questo servizio, basato sul Fascicolo Sanitario Elettronico, è necessario <strong>esprimere il
        consenso alla consultazione dei tuoi dati clinico-sanitari</strong>.</p>`,
    icon: "farmacia-abituale-vuoto"
  },
  {
    title: `<h1>Puoi abilitare le farmacie che frequenti abitualmente</h1>`,
    description: `<p>Cerca, localizza su mappa e scegli le farmacie di tuo interesse: puoi selezionarle, creare il tuo
        elenco personale, impostare un periodo di validità. E cambiare idea quando vuoi…</p>`,
    icon: "farmacia-abituale-vuoto"
  },
  {
    title: `<h1>Puoi autorizzare una farmacia occasionale</h1>`,
    description: `<p>Ti trovi in una farmacia diversa da quella abituale? Non c’è problema: puoi abilitarla
           in qualunque momento. In questo caso particolare, ti sarà chiesto di certificare il tuo dispositivo mobile.
           Un passaggio in più, per la tua sicurezza.</p>`,
    icon: "farmacia-occasionale-vuoto"
  },
]
