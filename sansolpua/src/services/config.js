/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const MONITORING_CF = {
  SIMON:"XXXXXXXXX"
};

export const DELEGATION_STATUS_MAP = {
  ACTIVE: "ATTIVA",
  NOT_ACTIVE: "NON ATTIVA",
  REVOKED: "REVOCATA",
  REFUSED: "RIFIUTATA",
  IS_EXPIRING: "IN_SCADENZA",
  EXPIRED: "SCADUTA",
  UPDATED: "AGGIORNATA"
};

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

// Elenco dei tag da usare per filtrare le notifiche da mostrare
export const NOTIFY_TAG_COMMUNICATION = "comunicazioni";
export const NOTIFY_TAG_EXPIRE = "scadenza";
export const NOTIFY_TAG_MINOR = "figli_minori";
export const NOTIFY_TAG_PROTECTED = "deleganti_tutelati";
export const NOTIFY_TAG_MATCH = `${NOTIFY_TAG_COMMUNICATION} ${NOTIFY_TAG_EXPIRE} ${NOTIFY_TAG_MINOR} ${NOTIFY_TAG_PROTECTED}`;

export const ORDER_APP_LIST_MAP = {
  USE: "UTILIZZO",
  ALPHABETIC: "ALFABETICO"
};

export const ONBOARDING_LIST_ITEMS = [
  {
    title: `Benvenuto su Piemonte Salute`,
    description: `<p>un mondo di servizi sanitari digitali, sempre a tua disposizione, usali per te, per i tuoi figli
    minori e per le persone che ti hanno autorizzato grazie alle deleghe <br> Scopri i vantaggi!</p>`,
    icon: "onboarding-benvenuto"
  },
  {
    title: `Resta sempre in contatto col tuo medico`,
    description: `<p>Trovi l’indirizzo dello studio, i recapiti, l’orario di ricevimento…</p>`,
    icon: "onboarding-medico"
  },
  {
    title: `Ricevi aggiornamenti in tempo reale`,
    description: `<p>vuoi avere comunicazioni personalizzate quando ci sono novità che ti riguardano?
<br>Inserisci i tuoi contatti e resta sempre aggiornato!  </p>`,
    icon: "onboarding-aggiornamenti"
  },
  {
    title: `gestisci in autonomia i tuoi dati e personalizza i contenuti`,
    description: `<p>vuoi avere comunicazioni personalizzate quando ci sono novità che ti riguardano?
<br>Inserisci i tuoi contatti e resta sempre aggiornato!  </p>`,
    icon: "onboarding-contenuti"
  }
];

export const FSE_LIST_ITEMS = [
  {
    title: `New in`,
    description: `<p>Il Fascicolo Sanitario elettronico si arricchisce di nuove funzionalità. </p>
    <p>Scopri le novità!</p>`,
    icon: "fse-tutorial"
  },
  {
    title: `Come funziona il nuovo Fascicolo Sanitario Elettronico`,
    description: `<p>Una prospettiva a 360° sul tuo stato di salute: lo spazio dove trovi insieme tutti i referti, i
    documenti prodotti dalle strutture e i professionisti che si prendono cura di te, i documenti inseriti autonomamente </p>`,
    icon: "fse-tutorial"
  },
  {
    title: `La tutela della tua privacy `,
    description: `<p>La riservatezza dei tuoi dati sanitari è importante. Per questo puoi decidere di renderli visibili
    o nasconderli, tutti o in parte, in base alla situazione che stai affrontando</p>`,
    icon: "fse-tutorial"
  },
  {
    title: `La libertà di cambiare idea `,
    description: `<p>In qualunque momento potrai modificare le preferenze espresse precedentemente </p>`,
    icon: "fse-tutorial"
  },
  {
    title: `Le potenzialità della delega `,
    description: `<p>Non puoi occuparti direttamente della gestione del tuo Fascicolo Sanitario?
    Puoi delegare una persona di fiducia e selezionare le informazioni da condividere</p>`,
    icon: "fse-tutorial"
  },
  {
    title: `Ecco i nuovi servizi disponibili nel tuo Fascicolo Sanitario elettronico `,
    description: `<p>Ritiro e consultazione documenti, Esenzioni per patologia, Ricette dematerializzate
    Ritiro referti e immagini con accesso semplificato, Prevenzione Serena e Taccuino</p>`,
    icon: "fse-tutorial"
  }
];
