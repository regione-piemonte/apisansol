
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

module.exports = {
  ENVIRONMENT: JSON.stringify('test-cert'),
  PUBLIC_PATH: JSON.stringify('URL'),
  API_BASE_URL: JSON.stringify('BASE_URL'),
  API_PUBLIC_BASE_URL: JSON.stringify('BASE_URL'),

  MOCKS_ENABLED: JSON.stringify(true),
  APP_SERVICES_CODES: JSON.stringify({
    name: 'CODE',
  }),

  RECAPTCHA_KEY: JSON.stringify('KEY'),
};
