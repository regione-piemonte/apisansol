/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */
const appEnvs = require("./envs");

module.exports = function(/* ctx */) {
  // Aggiungiamo delle variabili utili all'applicazione
  let envs = appEnvs.get(process.env.ENV);

  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: ["http", "filters", "globals"],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ["app.sass"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons" // optional, you are not bound to it
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: "material-icons", // Quasar icon set
      lang: "it", // Quasar language pack
      config: {},

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: "auto",

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ["Notify", "Dialog", "SessionStorage"]
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: "hash", // available values: 'hash', 'history'
      env: envs,

      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/
        });
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: true, // opens browser window automatically

      // Aggiungiamo i proxy nel server di sviluppo per simulare il più possibile
      // l'ambiente di test e produzione.
      // Inoltre grazie a questa accortezza il browser passerà i cookie ad ogni richiesta AJAX
      // dal momento che rispetta la same-origin policy
      proxy: {
        "/api-public/": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
          pathRewrite: { "^/api-public/": "/public/" }
        },
        "/api/": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
          pathRewrite: { "^/api/": "/auth/" }
        },
        // Tutte le immagini ed i file statici li vogliamo prendere
        // da test quando siamo in sviluppo
        "/statics/la-mia-salute/": {
          target: "url",
          changeOrigin: true,
          secure: false
        },
        // Tutti gli statici li prendiamo da test
        "/la-mia-salute/": {
          target: "url",
          changeOrigin: true,
          secure: false
        },
      }
    }
  };
};
