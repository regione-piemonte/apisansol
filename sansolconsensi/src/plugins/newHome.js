/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from "plugins/config";

export default ({app, router, Vue}) => {

  console.log('[newHomeHandler]', JSON.stringify(window.location, null, 4));
  let isHome = ['', '#', '#/'].includes(window.location.hash);
  let isDev = config.global.isDevelopment
  let isCert = config.global.envs.ENVIRONMENT.includes('-cert');

  console.log('[newHomeHandler]', {isHome, isDev, isCert});

  Vue.prototype.$isRedirecting = false;

  if (isHome && !isDev && !isCert) {
  // if (isHome) {
    Vue.prototype.$isRedirecting = true;
    let url = `${window.location.origin}${window.location.pathname}home/`;
    console.log('[newHomeHandler] Redirigo verso la nuova home:', url);
    location.assign(url);
  } else {
    console.log('[newHomeHandler] Resto su questa webapp')
  }
}
