

/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// Se siamo su iOS in modalità standalone, cioè la PWA installata
// => rimuoviamo tag che creano problemi con il flusso di autenticazione
if ('standalone' in navigator) {
  // Rimuoviamo il manifest se siamo su iOS in modalità standalone (cioè PWA)
  // @see https://github.com/nolanlawson/pinafore/issues/45#issuecomment-400887012
  // let manifest = document.querySelector('link[rel=manifest]')
  // manifest.parentNode.removeChild(manifest)

  // Rimuoviamo i metatag necessari che ci permettono di mostrare la PWA su iOS con la status bar
  // @see https://stackoverflow.com/questions/50396141/ios-pwa-add-to-home-screen-disable-full-screen-mode
  // let appleStatusBar = document.querySelector('meta[name=apple-mobile-web-app-status-bar-style]')
  // appleStatusBar.parentNode.removeChild(appleStatusBar)
  //
  // let appleWebAppCapable = document.querySelector('meta[name=apple-mobile-web-app-capable]')
  // appleWebAppCapable.parentNode.removeChild(appleWebAppCapable)
  //
  // let appleWebAppTitle = document.querySelector('meta[name=apple-mobile-web-app-title]')
  // appleWebAppTitle.parentNode.removeChild(appleWebAppTitle)
}


export default ({app, router, Vue}) => {
}
