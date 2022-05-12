/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

let config = {};

config.archivedStatuses = {
  Revocata: 'REV',
  Annullata: 'ANN',
  Scaduta: 'SCA'
};
config.typology = {
  Malattie_rare: 'MR',
  Malattie_croniche: 'MC',
  Invalidita: 'IN',
}
config.toEdit = {
  RettificaMedico: 'REM',
  RettificaOperatore: 'REO',
  SCADUTA: 'Scaduta'
};

config.listStatus=[
  {
    InviataDalMedico : "INM",

    //color: "info"


    Inviata: "INV",

    //color: "info"


    RichiestaAppuntamento: "RAP",

    //color: "info"


    Annullata: "ANN",

    //color: "negative"


    RichiestaRettificaDatiOperatore: "REO",

    //color: "negative"


    Respinta: "RES",

    //color: "negative"


    DaValidare: "DAV",

    //color: "info"

    InLavorazione: "LAV",
   // color: "info"
  },
  {
    Validata: "VAL",

    //color: "positive"
  },
  {
    InScadenza: "INS",

    //color: "negative"
  },
  {
    Scaduta: "SCA",

   // color: "negative"
  },
  {
    Revocata: "REV",

    //color: "negative"
  },
  {
    RichiestaRettificaDatiMedico: "REM",

    //color: "negative"
  },
  {
    ValidataInScadenza: "VIS",

    //color: "negative"
  },
  {
    RichiestaDiRinnovo: "RDR",

    //color: "info"
  }
]

config.mapStatus= [
  {
    label: "Revocata",
    value: 'REV'
  },
  {
    label: "Annullata",
    value: 'ANN'
  },
  {
    label: "Scaduta",
    value: 'SCA'
  }
];

config.fseConfig = {
  hiddenCode: 'WA',
  type:{
    codice: 'ESE',
    descrizione: 'ESENZIONI'
  },
}

export default config
