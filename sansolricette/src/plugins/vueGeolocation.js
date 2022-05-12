/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import VueGeolocation from 'vue-browser-geolocation';

export default ({app, router, Vue}) => {
  Vue.use(VueGeolocation);
}
