/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */


import anime from "animejs/lib/anime.es.js";

export default ({ app, router, store, Vue }) => {
  Vue.prototype.$anime = anime;
};
