/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/**
 * FILE DI CONFIGURAZIONE WEBPACK DUMMY.
 * -------------------------------------------------
 *
 * @important
 * Questo file è utilizzato solamente dagli IDE.
 * L'applicazione e la chain di build non sa neanche che esiste.
 *
 * @description
 * Dal momento che Quasar genera dinamicamente la configurazione di webpack e non offre attualmente alcun supporto
 * per l'integrazione con gli IDE, per far sì che gli IDE riconoscano i path che usano gli alias di webpack,
 * può essere usata questa configurazione statica.
 *
 * Sostanzialmente, se cambiano gli alias di default di Quasar
 * (@see https://quasar-framework.org/guide/app-pre-processors-and-webpack.html#Webpack-Aliases)
 * oppure ogni volta che si aggiungono degli alias custom nel file `quasat.conf.js`
 * (@see https://quasar-framework.org/guide/app-quasar.conf.js.html#Adding-you-own-alias-to-Webpack)
 * si modifica di conseguenza questo file e l'IDE, leggendolo dovrebbe risolvere correttamente l'alias
 * aiutando con l'autocomplention/riferimenti/click&jump ecc.
 */
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      // CUSTOM ALIAS
      '@services': path.resolve(__dirname, './src/services'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@store': path.resolve(__dirname, './src/store'),
      '@router': path.resolve(__dirname, './src/router'),
      '@validators': path.resolve(__dirname, './src/validators'),
      '@filters': path.resolve(__dirname, './src/filters'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@mixins': path.resolve(__dirname, './src/mixins'),
      '@envs': path.resolve(__dirname, './envs'),
      '@configs': path.resolve(__dirname, './config'),

      // QUASAR DEFAULTS
      'components': path.resolve(__dirname, './src/components'),
      'layouts': path.resolve(__dirname, './src/layouts'),
      'pages': path.resolve(__dirname, './src/pages'),
      'assets': path.resolve(__dirname, './src/assets'),
      'plugins': path.resolve(__dirname, './src/plugins'),
      'src': path.resolve(__dirname, './src'),
      'variables': path.resolve(__dirname, './.quasar/variables.styl'),
      'quasar': path.resolve(__dirname, 'node_modules/quasar-framework/dist/quasar.<configured-theme>.esm.js'),
    }
  },
};
