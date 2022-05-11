/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/**
 * @author Alessandro Napoli
 * @description
 * Questo file permette di descrivere le variabili d'ambiente da impostare in sviluppo.
 *
 * Per leggere le variabili d'ambiente impostate:
 *    let myEnv = process.env.MY_ENV
 *
 * NOTA: usare sempre JSON.stringify() per il valore della variabile d'ambiente dal momento che è richiesto
 * dal plugin Webpack usato da Quasar
 */

module.exports = {
  ENVIRONMENT: JSON.stringify('test-cert'),
  PUBLIC_PATH: JSON.stringify('la-mia-salute-cert/ptw'),
  // PUBLIC_PATH: JSON.stringify(''),
  API_BASE_URL: JSON.stringify('https://tst-niv-sansol.isan.csi.it/api'),
  API_PUBLIC_BASE_URL: JSON.stringify('https://tst-niv-sansol.isan.csi.it/api-public'),
  MOCKS_ENABLED: JSON.stringify(true),
  APP_SERVICES_CODES: JSON.stringify({
    onlineReports: 'ritiroreferti',
    healthPayments: 'PTW',
    incomeExemption: 'ESENRED',
    delegations: 'deleghe',
    prescriptions: 'promem',
    unp: 'UNP',
    consents: 'CONSENSI',
    vaccinations: 'SIRVA',
    pathologyExemption: 'ESENPAT',
    reservations: 'RESERVATIONS',
    changeDoctor: 'SCEREV',
    asr: 'notif_asr', // Questo non è un vero e proprio verticale
    covid: 'SOLCOVID',
    fse: 'nuovo_fse_tst',
    fseExceptions: 'FSEESE'
  }),

  RECAPTCHA_KEY: JSON.stringify('6LesSLoUAAAAAFEpLa_ZQCOyMaJBRUnNLvsLJeqJ'),
};
