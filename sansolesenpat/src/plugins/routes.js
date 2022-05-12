/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {ROUTES_BOOK} from "@router/routes";

/**
 * @description
 * In questo file centrializziamo la configurazione delle routes che abbiamo definitio.
 * Così facendo abbiamo un unico punto di accesso alle routes definite per i componenti|filtri|mixins Vue.
 */

export const routes = ROUTES_BOOK
export default ({app, router, Vue}) => {
  Vue.prototype.$routes = ROUTES_BOOK;
}

