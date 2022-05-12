<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-browser-guard">

    <slot v-if="supportLevel !== SUPPORT_LEVELS.NONE" />

    <!-- In questa parte non possiamo utlizzare classi che sfruttano funzionalità recenti -->
    <!-- dal momento che deve esser visibile su browser non supportati e probabilmente vecchi -->
    <div v-else class="q-pa-lg">

      <div v-html="$t('GLOBAL.BROWSER_OBSOLETE')" class="text-center csi-h2 text-primary"></div>

      <!-- BROWSERS SUGGERITI -->
      <div class="browsers-grid q-pt-lg">
        <div v-for="browser in SUGGESTED_BROWSERS" class="browsers-grid-item shadow-3">
          <h2 class="browsers-grid-item__title csi-h5">
            {{browser.name}}
          </h2>

          <div class="browsers-grid-item__image">
            <img :src="browser.image" alt="Icona browser" class="responsive">
          </div>

          <div class="browsers-grid-item__actions">
            <q-btn
              color="primary"
              label="Scarica"
              class="full-width"
              @click="goToUrl(browser.urlDownload)"
            />
          </div>
        </div>
      </div>
    </div>


  </div>
</template>


<script>

  const SUPPORT_LEVELS = {
    NONE: 'NONE',
    PARTIAL: 'PARTIAL',
    FULL: 'FULL',
  }

  let SUGGESTED_BROWSERS = []

  const SUGGESTED_BROWSERS_DESKTOP = [
    {
      name: 'Google Chrome',
      image: 'statics/images/browser-chrome.png',
      urlDownload: 'https://www.google.com/chrome/'
    },
    {
      name: 'Mozilla Firefox',
      image: 'statics/images/browser-firefox.png',
      urlDownload: 'https://www.mozilla.org/it/firefox/new/'
    },
    {
      name: 'Edge',
      image: 'statics/images/browser-edge.png',
      urlDownload: 'https://www.microsoft.com/software-download/windows10'
    },
    {
      name: 'Opera',
      image: 'statics/images/browser-opera.png',
      urlDownload: 'https://www.opera.com/it'
    },
  ]

  const SUGGESTED_BROWSERS_DESKTOP_MAC = [
    {
      name: 'Google Chrome',
      image: 'statics/images/browser-chrome.png',
      urlDownload: 'https://www.google.com/chrome/'
    },
    {
      name: 'Mozilla Firefox',
      image: 'statics/images/browser-firefox.png',
      urlDownload: 'https://www.mozilla.org/it/firefox/new/'
    },
    {
      name: 'Safari',
      image: 'statics/images/browser-safari.png',
      urlDownload: 'http://www.apple.com/osx/'
    },
    {
      name: 'Opera',
      image: 'statics/images/browser-opera.png',
      urlDownload: 'https://www.opera.com/it'
    },
  ]

  const SUGGESTED_BROWSERS_ANDROID = [
    {
      name: 'Google Chrome',
      image: 'statics/images/browser-chrome.png',
      urlDownload: 'https://play.google.com/store/apps/details?id=com.android.chrome&hl=it'
    },
  ]

  const SUGGESTED_BROWSERS_IOS = [
    {
      name: 'Safari',
      image: 'statics/images/browser-safari.png',
      urlDownload: 'https://support.apple.com/it-it/HT204204'
    },
  ]


  export default {
    name: 'CsiAppGuardBrowser',
    components: {},
    props: {},
    data() {
      return {
        supportLevel: '',
        SUPPORT_LEVELS,
        SUGGESTED_BROWSERS: [],
        SUGGESTED_BROWSERS_DESKTOP: [
          {
            name: 'Google Chrome',
            image: 'statics/images/browser-chrome.png',
            urlDownload: 'https://www.google.com/chrome/'
          },
          {
            name: 'Mozilla Firefox',
            image: 'statics/images/browser-firefox.png',
            urlDownload: 'https://www.mozilla.org/it/firefox/new/'
          },
          {
            name: 'Edge',
            image: 'statics/images/browser-edge.png',
            urlDownload: 'https://www.microsoft.com/software-download/windows10'
          },
          {
            name: 'Opera',
            image: 'statics/images/browser-opera.png',
            urlDownload: 'https://www.opera.com/it'
          },
        ],
        SUGGESTED_BROWSERS_DESKTOP_MAC: [
          {
            name: 'Google Chrome',
            image: 'statics/images/browser-chrome.png',
            urlDownload: 'https://www.google.com/chrome/'
          },
          {
            name: 'Mozilla Firefox',
            image: 'statics/images/browser-firefox.png',
            urlDownload: 'https://www.mozilla.org/it/firefox/new/'
          },
          {
            name: 'Safari',
            image: 'statics/images/browser-safari.png',
            urlDownload: 'http://www.apple.com/osx/'
          },
          {
            name: 'Opera',
            image: 'statics/images/browser-opera.png',
            urlDownload: 'https://www.opera.com/it'
          },
        ],
        SUGGESTED_BROWSERS_ANDROID : [
          {
            name: 'Google Chrome',
            image: 'statics/images/browser-chrome.png',
            urlDownload: 'https://play.google.com/store/apps/details?id=com.android.chrome&hl=it'
          },
        ],
        SUGGESTED_BROWSERS_IOS: [{
          name: 'Safari',
          image: 'statics/images/browser-safari.png',
          urlDownload: 'https://support.apple.com/it-it/HT204204'
        }]
      }
    },
    computed: {},
    created() {

      let platform = this.$q.platform

      // Su Chrome dalla 60 in giu diciamo che potrebbero esserci problemi
      if (platform.is.chrome) {
        if (platform.is.versionNumber < 60) this.supportLevel = SUPPORT_LEVELS.PARTIAL
      }

      // Su Firefox dalla 60 in giu diciamo che potrebbero esserci problemi
      else if (platform.is.mozilla) {
        if (platform.is.versionNumber < 60) this.supportLevel = SUPPORT_LEVELS.PARTIAL
      }

      // Su Explorer < 11 diciamo che non è supportato
      // Su Explorer >= 11 diciamo che potrebbero esserci problemi
      else if (platform.is.ie) {
        // platform.is.version = 10
        this.supportLevel = platform.is.versionNumber < 11 ? SUPPORT_LEVELS.NONE : SUPPORT_LEVELS.PARTIAL
      }

      // Su opera dalla 35 in giu diciamo che potrebbero esserci problemi
      else if (platform.is.opera) {
         if (platform.is.versionNumber < 35) this.supportLevel = SUPPORT_LEVELS.PARTIAL
      }

      // Su Safari iOS < 10 diciamo che non è supportato
      // Su Safari iOS >= 10 e < 11 diciamo che potrebbero esserci problemi
      // Su Safari Mac < 10 diciamo che non è supportato
      // Su Safari Mac >= 10 e < 11 diciamo che potrebbero esserci problemi
      else if (platform.is.safari) {
        if (platform.is.ios) {
          if (platform.is.versionNumber < 11) this.supportLevel = SUPPORT_LEVELS.NONE
          // else if (platform.is.versionNumber < 11) this.supportLevel = SUPPORT_LEVELS.PARTIAL
        } else {
          if (platform.is.versionNumber < 10) this.supportLevel = SUPPORT_LEVELS.NONE
          else if (platform.is.versionNumber < 11) this.supportLevel = SUPPORT_LEVELS.PARTIAL
        }
      }

      // Per tutti gli altri browser, indistintamente dalla versione diciamo che potrebbero esserci problemi
      else {
        this.supportLevel = SUPPORT_LEVELS.PARTIAL
      }

      if (this.supportLevel === SUPPORT_LEVELS.PARTIAL) this.onBrowserPartiallySupported()

      if(platform.is.desktop){
        if(!platform.is.mac)
          this.SUGGESTED_BROWSERS = this.SUGGESTED_BROWSERS_DESKTOP
        else
           this.SUGGESTED_BROWSERS = this.SUGGESTED_BROWSERS_DESKTOP_MAC
      }
      else if(platform.is.android)
        this.SUGGESTED_BROWSERS = this.SUGGESTED_BROWSERS_ANDROID
      else if(platform.is.ios)
        this.SUGGESTED_BROWSERS = this.SUGGESTED_BROWSERS_IOS
    },
    methods: {
      onBrowserPartiallySupported() {
        this.$q.notify({
          type: 'warning',
          message: 'Se noti delle difficolta nella navigazione del sito, prova ad usare un browser più aggiornato',
          timeout: 5000,
          position: 'bottom-left'
        })
      },
      goToUrl(url) {
        location.assign(url)
      }
    },
  }
</script>


<style scoped lang="stylus">

  @require '~variables'

  .browsers-grid
    text-align center

  .browsers-grid-item
    display inline-block
    width 256px
    background-color white
    margin 8px
    padding 16px 8px
    text-align center

    & > *
      padding-top 8px
      padding-bottom 8px

    @media (min-width: $breakpoint-sm)

      width: 192px


</style>
