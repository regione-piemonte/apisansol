/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const SERVICES_TYPES = [
  {
    servizio_codice: "ritiroreferti",
    categorie: [
      {
        codice: 1,
        descrizione: "Referto non trovato"
      },
      {
        codice: 2,
        descrizione:
          "Impossibilità a ritirare il referto in quanto il sistema indica che deve essere pagato il ticket"
      },
      {
        codice: 3,
        descrizione: "Difficoltà a scaricare immagini di radiologia"
      },
      {
        codice: 4,
        descrizione:
          "Non corrispondenza tra Codice Fiscale e Codice identificativo"
      },
      {
        codice: 5,
        descrizione: "Non corrispondenza tra Codice Fiscale e Tessera Sanitaria"
      },
      {
        codice: 6,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "SCEREV",
    categorie: [
      {
        codice: 1,
        descrizione: "Scelta medico"
      },
      {
        codice: 2,
        descrizione: "Scelta per minori pediatra/medico di medicina generale"
      },
      {
        codice: 3,
        descrizione: "Scelta medico in caso di trasferimento in Piemonte"
      },
      {
        codice: 4,
        descrizione:
          "Richiesta medico in caso di domicilio temporaneo diverso dalla residenza (altra città; asl; regione)"
      },
      {
        codice: 5,
        descrizione: "Rinnovo assistenza temporanea"
      },
      {
        codice: 6,
        descrizione: "Errori nei dati anagrafici, come correggerli"
      },
      {
        codice: 7,
        descrizione: "Revoca e/o emissione documento di revoca"
      },
      {
        codice: 8,
        descrizione:
          "Informazioni sulla presa in carico della richiesta dalla ASL"
      },
      {
        codice: 9,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 10,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "ESENRED",
    categorie: [
      {
        codice: 1,
        descrizione: "Informazioni su inserimento autocertificazione esenzione"
      },
      {
        codice: 2,
        descrizione: "Informazioni sul rinnovo"
      },
      {
        codice: 3,
        descrizione: "Problemi di inserimento e/o visualizzazione esenzione"
      },
      {
        codice: 4,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 5,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "SIRVA",
    categorie: [
      {
        codice: 1,
        descrizione: "Elenco vaccini effettuati NO Covid-19"
      },
      {
        codice: 2,
        descrizione: "Elenco vaccini effettuati Covid-19"
      },
      {
        codice: 3,
        descrizione: "Vaccini NO Covid-19 effettuati presso altra Regione"
      },
      {
        codice: 4,
        descrizione: "Vaccini Covid-19 effettuati presso altra Regione"
      },
      {
        codice: 5,
        descrizione: "Mancanza vaccini NO Covid-19 effettuati"
      },
      {
        codice: 6,
        descrizione: "Mancanza vaccini Covid-19 effettuati"
      },
      {
        codice: 7,
        descrizione: "Visualizzazione/stampa Vaccinazione NO COVID-19"
      },
      {
        codice: 8,
        descrizione:
          "Come registrare le dosi effettuate all'estero o in altre regioni "
      }
    ]
  },
  {
    servizio_codice: "CONSENSI",
    categorie: [
      {
        codice: 1,
        descrizione: "Notifica con variazione consensi: richiesta verifica"
      },
      {
        codice: 2,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 3,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "SOLCOVID",
    categorie: [
      {
        codice: 3,
        descrizione: "Esito tampone non presente"
      },
      {
        codice: 5,
        descrizione: "Prenotazione tampone non presente"
      },
      {
        codice: 7,
        descrizione: "Green Pass"
      },
      {
        codice: 8,
        descrizione:
          "Problemi di accesso riscontrati in fase di accesso con autenticazione (SPID, CIE, TNS)"
      },
      {
        codice: 9,
        descrizione:
          "Problemi di accesso riscontrati in fase di accesso senza autenticazione (Tessera Sanitaria e OTP)"
      },
      {
        codice: 10,
        descrizione: "Esito tampone errato"
      },
      {
        codice: 12,
        descrizione: "Prenotazione tampone errata"
      },
      {
        codice: 13,
        descrizione: "Non mi è arrivato sms di inizio isolamento"
      },
      {
        codice: 14,
        descrizione: "Non mi è arrivato sms di fine isolamento"
      },
      // {
      //   codice: 14,
      //   descrizione: "Non mi è arrivato sms di inizio quarantena"
      // },
      // {
      //   codice: 15,
      //   descrizione: "Non mi è arrivato sms di fine quarantena"
      // },
      {
        codice: 17,
        descrizione: "Non visualizzo il provvedimento di inizio isolamento"
      },
      {
        codice: 18,
        descrizione: "Non visualizzo il provvedimento di fine isolamento"
      },
      // {
      //   codice: 19,
      //   descrizione: "Non visualizzo il provvedimento di inizio quarantena"
      // },
      // {
      //   codice: 20,
      //   descrizione: "Non visualizzo il provvedimento di fine quarantena"
      // }
    ]
  },
  {
    servizio_codice: "promem",
    categorie: [
      {
        codice: 1,
        descrizione: "Informazioni per scarico ricette figli minorenni"
      },
      {
        codice: 2,
        descrizione: "Ricetta mancante"
      },
      {
        codice: 3,
        descrizione: "Promemoria incompleto"
      },
      {
        codice: 4,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 5,
        descrizione: "Residenza / Domicilio non corretto"
      },
      // {
      //   codice: 6,
      //   descrizione: "Richiesta verifica (non corrispondenza farmaci ritirati)"
      // }
    ]
  },
  {
    servizio_codice: "deleghe",
    categorie: [
      {
        codice: 1,
        descrizione: "Informazioni per deleghe"
      },
      {
        codice: 2,
        descrizione: "Inserimento deleghe per minori"
      },
      {
        codice: 4,
        descrizione: "Inserimento deleghe per adulti"
      },
      {
        codice: 3,
        descrizione:
          "Conferma del secondo genitore (per inserimento delega minori)"
      },
      {
        codice: 5,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 6,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "BUONO_CELIACHIA",
    categorie: [
      {
        codice: 1,
        descrizione: "Rinvio PIN"
      },
      {
        codice: 2,
        descrizione: "Abilitazione tessera sanitaria in caso di rinnovo"
      },
      {
        codice: 3,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 4,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "RISCRE",
    categorie: [
      {
        codice: 1,
        descrizione:
          "Problemi di visualizzazione appuntamenti (solo screening citologico e mammografico)"
      },
      {
        codice: 2,
        descrizione:
          "Problemi di visualizzazione esami effettuati (solo screening citologico e mammografico)"
      },
      {
        codice: 3,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 4,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "RESERVATIONS",
    categorie: []
  },
  {
    servizio_codice: "TROVAUN",
    categorie: [
      {
        codice: 1,
        descrizione: "Mancanza informazioni"
      },
      {
        codice: 2,
        descrizione: "Errore tecnico segnalato dal sistema"
      }
    ]
  },
  {
    servizio_codice: "FFE",
    categorie: [
      {
        codice: 1,
        descrizione: "Mancanza informazioni"
      },
      {
        codice: 2,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 3,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "FSE",
    categorie: [
      {
        codice: 1,
        descrizione:
          "Informazioni su FSE (Fascicolo sanitario elettronico) e sui documenti presenti"
      },
      {
        codice: 2,
        descrizione:
          "Come apro il FSE (Fascicolo Sanitario Elettronico)? Come lo consulto? Dove lo trovo?"
      },
      {
        codice: 3,
        descrizione:
          "Documenti pregressi all'interno del FSE (Fascicolo Sanitario Elettronico)"
      },
      {
        codice: 4,
        descrizione:
          "Informazioni su FSE (Fascicolo Sanitario Elettronico)  per minori"
      },
      {
        codice: 5,
        descrizione:
          "Impossibilità a trovare il certificato vaccinale sul proprio FSE (Fascicolo Sanitario Elettronico)"
      },
      {
        codice: 6,
        descrizione:
          "Trasferimento in Regione Piemonte e accesso al FSE (Fascicolo sanitario elettronico)"
      },
      {
        codice: 7,
        descrizione: "Referto non trovato"
      },
      {
        codice: 8,
        descrizione:
          "Impossibilità a ritirare il referto per segnalazione di ticket non pagato"
      },
      {
        codice: 9,
        descrizione: "Difficoltà a scaricare immagini di radiologia"
      },
      {
        codice: 10,
        descrizione: "Green Pass"
      },
      {
        codice: 11,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 12,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "PTW",
    categorie: [
      {
        codice: 1,
        descrizione: "Impossibilità a pagare il ticket sanitario"
      },
      {
        codice: 2,
        descrizione: "Impossibilità ad avere la ricevuta di pagamento"
      },
      {
        codice: 3,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 4,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "ESENPAT",
    categorie: [
      {
        codice: 1,
        descrizione: "Informazioni sul rinnovo"
      },
      {
        codice: 2,
        descrizione: "Non trovo la mia esenzione"
      },
      {
        codice: 3,
        descrizione: "Esenzione rilasciata in altra regione"
      },
      {
        codice: 4,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 5,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "TACCUINO",
    categorie: [
      {
        codice: 1,
        descrizione: "Informazioni sull'utilizzo"
      },
      {
        codice: 2,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 3,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "ESTRATTO_CONTO",
    categorie: [
      {
        codice: 1,
        descrizione: "Mancanza informazioni"
      },
      {
        codice: 2,
        descrizione: "Mancanza spese effettuate"
      },
      {
        codice: 3,
        descrizione: "Difficoltà a scaricare la ricevuta"
      },
      {
        codice: 4,
        descrizione: "Errore tecnico segnalato dal sistema"
      }
    ]
  },
  {
    servizio_codice: "HOME",
    categorie: [
      // {
      //   "codice": 1,
      //   "descrizione": "Difficoltà generiche di accesso ai servizi"
      // },
      {
        codice: 1,
        descrizione:
          "Problemi di accesso riscontrati in fase di accesso con autenticazione (SPID, CIE, TNS)"
      },
      {
        codice: 2,
        descrizione: "Difficoltà di accesso al Fascicolo Sanitario Elettronico"
      },
      {
        codice: 3,
        descrizione: "Residenza / Domicilio non corretto"
      }
    ]
  },
  {
    servizio_codice: "PROFILO_UTENTE_OLD",
    categorie: []
  },
  {
    servizio_codice: "FARAB",
    categorie:[
      {
        codice: 1,
        descrizione: "Errore tecnico segnalato dal sistema"
      },
      {
        codice: 2,
        descrizione: "Scelta Farmacia abituale"
      },
      {
        codice: 3,
        descrizione: "Certificazione dispositivo"
      },
      {
        codice: 4,
        descrizione: " Ritiro farmaci in qualità di delegato"
      },


    ]
  }
];
