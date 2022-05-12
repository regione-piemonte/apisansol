/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import {ROUTES_BOOK} from './routes'

Vue.use(VueRouter);

const DO_NOT_SCROLL_ON_REPLACE = [
  ROUTES_BOOK.HEALTH_PAYMENTS.ANONYMOUS_HEALTH_PAYMENTS.name,
];


const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: (to, from, savedPosition) => {

    // console.log('scrollBehavior:', {to, from, savedPosition});

    let isSameRoute = to.name === from.name;
    if (isSameRoute && DO_NOT_SCROLL_ON_REPLACE.includes(to.name)) {
      // console.log('scrollBehavior: do not scroll to top');
      return
    }

    // console.log('scrollBehavior: scroll to top');
    return {y: 0}
  },
  routes
});


export default Router
