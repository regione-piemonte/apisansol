/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config';
import { SessionStorage } from 'quasar'
import router from "@router";
import {LOGOUT} from "@router/routes/global";


export const login = (landingUrl = window.location.hash) => {

  if (config.global.isDevelopment) {
    // openURL(landingUrl);
    // location.href = landingUrl;
    // location.assign(landingUrl);
  } else {
    let apiBaseUrl = config.global.envs.API_BASE_URL;
    let publicPath = config.global.envs.PUBLIC_PATH;
    // es: la-mia-salute/#/referti-online
    let publicUrl = `${publicPath}/${landingUrl}`
    let encodedPublicUrl = encodeURIComponent(publicUrl)

    let loginRedirectUrl = `${apiBaseUrl}/bff/login?landingUrl=${encodedPublicUrl}`;

    console.debug('[Login] landing url:', landingUrl)
    console.debug('[Login] public url:', publicUrl)
    console.debug('[Login] redirect to:', loginRedirectUrl)

    try{
      // @NOTE: se il BFF è su un dominio diverso rispetto al Front-end => questa istruzione fallirà
      location.assign(loginRedirectUrl)
    } catch (e) {
      window.open(loginRedirectUrl, '_self')
    }
  }

};



export const logout = () => {

  // La pagina di multi logout non funziona più per via delle nuove policy di sicurezza dei browser
  // router.push(LOGOUT);


  // Al logout il session storage viene ripulito
  SessionStorage.clear();

  if (config.global.isDevelopment) {
    // openURL(landingUrl);
    // location.href = landingUrl;
    // location.assign(landingUrl);
  } else {
    // let apiBaseUrl = config.global.envs.API_BASE_URL;
    // let loginRedirectUrl = `${apiBaseUrl}/bff/logout`;
    // console.debug('[Logout] redirect to:', {loginRedirectUrl});
    // window.open(loginRedirectUrl, '_self');

    window.open('/la-mia-salute/logout.html', '_self');
  }
};

