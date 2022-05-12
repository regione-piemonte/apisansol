/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// Configuration for your app
const path = require('path');

let ENV_DEVELOPMENT = require('./envs/development.env');
let ENV_TEST = require('./envs/test.env');
let ENV_TEST_CERT = require('./envs/test-cert.env');
let ENV_TEST_NIVOLA = require('./envs/test-nivola.env');
let ENV_TEST_CERT_NIVOLA = require('./envs/test-cert-nivola.env');
let ENV_ALPHA = require('./envs/alpha.env');
let ENV_ALPHA_CERT = require('./envs/alpha-cert.env');
let ENV_PRODUCTION = require('./envs/production.env');


module.exports = function (ctx) {

  // Identifichiamo prima l'ambiente su cui stiamo buildando
  let IS_TEST = process.env.BUILD_ENVIRONMENT === 'test';
  let IS_TEST_CERT = process.env.BUILD_ENVIRONMENT === 'test-cert';
  let IS_TEST_NIVOLA = process.env.BUILD_ENVIRONMENT === 'test-nivola';
  let IS_TEST_CERT_NIVOLA = process.env.BUILD_ENVIRONMENT === 'test-cert-nivola';
  let IS_ALPHA = process.env.BUILD_ENVIRONMENT === 'alpha';
  let IS_ALPHA_CERT = process.env.BUILD_ENVIRONMENT === 'alpha-cert';
  let IS_PRODUCTION = process.env.BUILD_ENVIRONMENT === 'production';
  let IS_DEVELOPMENT = !IS_TEST && !IS_TEST_CERT && !IS_ALPHA && !IS_ALPHA_CERT && !IS_PRODUCTION;

  // Impostiamo le variabili d'ambiente associate all'ambiente di building
  let env = ENV_DEVELOPMENT;
  if (IS_TEST) env = ENV_TEST;
  if (IS_TEST_CERT) env = ENV_TEST_CERT;
  if (IS_TEST_NIVOLA) env = ENV_TEST_NIVOLA;
  if (IS_TEST_CERT_NIVOLA) env = ENV_TEST_CERT_NIVOLA;
  if (IS_ALPHA) env = ENV_ALPHA;
  if (IS_ALPHA_CERT) env = ENV_ALPHA_CERT;
  if (IS_PRODUCTION) env = ENV_PRODUCTION;

  // Aggiungiamo delle variabili utili all'applicazione
  env.BUILD_ENVIRONMENT = JSON.stringify(process.env.BUILD_ENVIRONMENT);
  env.__ENV = JSON.stringify(process.env);
  // env.__ENV = process.env;

  // Logs
  console.log('Building with envs:');
  console.log(JSON.stringify({...env, __ENV: process.env}, null, 4));

  return {

    // app plugins (/src/plugins)
    plugins: [
      'iosPwa',
      'config',
      'matomo',
      'axios',
      'i18n',
      'portalVue',
      'vuelidate',
      'filters',
      'components',
      'routes',
      'directives',
      'vueGeolocation',
      'newHome'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      // ctx.theme.mat ? 'roboto-font' : null,
      'material-icons', // optional, you are not bound to it
      // 'ionicons',
      'mdi',
      // 'fontawesome'
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
       // vueRouterMode: 'history',
      vueRouterMode: 'hash',
      env: env,
      publicPath: JSON.parse(env.PUBLIC_PATH),
      // vueCompiler: true,
      // gzip: true,
      // minify: false,
      // sourceMap: true,
      // Decommentare se vogliamo un report della build generata
      // analyze: {
      //   analyzerMode: 'static',
      //   reportFilename: 'webpack-report.html',
      //   generateStatsFile: true,
      //   statsFilename: 'webpack-report.json',
      // },
      // extractCSS: false,
      transpileDependencies: [
        // https://github.com/mehwww/vue-sticky-directive/issues/29
        /[\\/]node_modules[\\/]vue-sticky-directive[\\/]/
      ],
      extendWebpack(cfg) {

        cfg.resolve.alias = {
          // Aggiungiamo prima gli alias di impostati da Quasar:
          //
          // 'quasar' -> 'node_modules/quasar-framework/dist/quasar.<configured-theme>.esm.js'
          // 'src' -> '/src'
          // 'components' -> '/src/components'
          // 'layouts' -> '/src/layouts'
          // 'pages' -> '/src/pages'
          // 'assets' -> '/src/assets'
          // 'plugins' -> '/src/plugins'
          // 'variables' -> '/.quasar/variables.styl'
          ...cfg.resolve.alias,

          // Poi aggiungiamo i nostri alias
          '@services': path.resolve(cfg.resolve.alias.src, './services'),
          '@plugins': path.resolve(cfg.resolve.alias.plugins),
          '@store': path.resolve(cfg.resolve.alias.src, './store'),
          '@router': path.resolve(cfg.resolve.alias.src, './router'),
          '@validators': path.resolve(cfg.resolve.alias.src, './validators'),
          '@filters': path.resolve(cfg.resolve.alias.src, './filters'),
          '@mocks': path.resolve(cfg.resolve.alias.src, './mocks'),
          '@mixins': path.resolve(cfg.resolve.alias.src, './mixins'),
          '@envs': path.resolve(__dirname, './envs'),
          '@configs': path.resolve(__dirname, './config'),
        };


        cfg.plugins = [
          ...cfg.plugins,
          // Aggiungi qui plugin webpack
        ];
      },
    },
    devServer: {
      // https: true,
       //port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        // STYLE & IDENTITY
        'QIcon',

        // LAYOUT
        'QLayout',
        'QLayoutHeader',
        'QLayoutFooter',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QPageSticky',

        // BUTTONS
        'QBtn',
        'QBtnGroup',
        'QBtnToggle',
        'QBtnDropdown',
        'QFab',
        'QFabAction',

        // NAVIGATION
        'QToolbar',
        'QToolbarTitle',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',

        // FORM COMPONENTS
        'QField',
        'QInput',
        'QAutocomplete',
        'QSearch',
        'QRadio',
        'QCheckbox',
        'QToggle',
        'QSelect',
        'QOptionGroup',
        'QDatetime',
        "QDatetimePicker",
        'QUploader',
        'QSlider',

        // GROUPING
        'QCard',
        'QCardTitle',
        'QCardMain',
        'QCardMedia',
        'QCardSeparator',
        'QCardActions',
        'QCollapsible',
        'QTable',
        'QTr',
        'QTd',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QItemSeparator',
        'QStepper',
        'QStep',
        'QStepperNavigation',

        // POPUPS
        'QDialog',
        'QModal',
        'QModalLayout',
        'QPopover',
        'QTooltip',

        // PROGRESS
        'QInnerLoading',
        'QSpinner',
        'QSpinnerMat',
        'QSpinnerGrid',
        'QSpinnerDots',

        // SCROLLING
        'QInfiniteScroll',
        'QScrollArea',

        // ANIMATION
        'QSlideTransition',

        // OTHER
        'QAlert',
        'QChip',
        'QChatMessage',
        'QTimeline',
        'QTimelineEntry'
      ],
      directives: [
        'Ripple',
        'CloseOverlay',
        'Scroll',
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'Screen',
        'SessionStorage',
        'LocalStorage',
        'Cookies'
      ],
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      i18n: 'it' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [
      'fadeIn',
      'fadeOut',

      'bounceInLeft',
      'bounceOutRight',
      'bounceOutLeft',

      // 'fadeInLeft',
      'fadeInDown',
      'fadeInUp',
      'fadeOutRight',
      // 'slideInLeft',
      // 'slideOutRight',

      'shake',
    ],
    pwa: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        // exclude: [/\.jpg$/, /\.png$/, /\.svg$/, /\.pdf$/],
        include: [],
      },

      manifest: {
        name: 'Salute Piemonte',
        short_name: 'Salute Piemonte',
        // description: 'Piattaforma web dedicata al cittadino che integra tutti i servizi sanitari messi  a disposizione dalla regione Piemonte',
        display: 'standalone',
        // display: 'browser',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack(cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
};
