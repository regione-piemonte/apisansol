

/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

module.exports = {
  // Definisce l'ambiente su cui sta girando l'applicativo.
  // In questo modo l'applicazione può configurarsi di conseguenza.
  ENVIRONMENT: JSON.stringify('development'),

  // Permette di definire il path nel quale verrà hostata l'applicazione di front-end.
  // In questo modo, il prefeisso verrà messo a tutti gli script generati da webpack e non si avranno errori
  // relativi al path.
  PUBLIC_PATH: JSON.stringify('URL'),

  // Definisce l'URL di base per le chiamate AJAX.
  // In questo modo è possibile disaccoppiare le chiamate dall'host su cui si trova il back-end.
  // BFF SLIM
  API_BASE_URL: JSON.stringify('BASE_URL'),
  API_PUBLIC_BASE_URL: JSON.stringify('BASE_URL'),

  // BFF LARAVEL
  // API_BASE_URL: JSON.stringify('http://localhost:8091/auth'),
  // API_PUBLIC_BASE_URL: JSON.stringify('http://localhost:8091/public'),
  // API_BASE_URL: JSON.stringify('http://10.118.10.165:8000/auth'),
  // API_PUBLIC_BASE_URL: JSON.stringify('http://10.118.10.165:8000/public'),

  // Abilita/disabilita i mocks delle chiamate AJAX.
  // Utili per testare l'applicazione quando si hanno a disposizione gli YAML delle API, ma i mock
  // non sono ancora disponibili lato back-end.
  // Utili anche per testare casi al limite (dati vuoti, casistiche particolari, errori, ecc).
  MOCKS_ENABLED: JSON.stringify(true),
  APP_SERVICES_CODES: JSON.stringify({
    name: 'CODE',
  }),

  RECAPTCHA_KEY: JSON.stringify('KEY'),
};
