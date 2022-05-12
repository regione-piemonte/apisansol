/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import * as config from "src/services/config";

export default ({ app, router, store, Vue }) => {
  Vue.prototype.$c = config;
};
