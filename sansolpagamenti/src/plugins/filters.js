/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import * as dateFilters from "@filters/date";
import * as casesFilters from "@filters/cases";
import * as numberFilters from "@filters/numbers";
import * as stringFilters from "@filters/strings";

/**
 * @description
 * In questo file andiamo ad aggiungere filtri custom al progetto
 */
export default ({ app, router, Vue }) => {

  // DATE
  Vue.filter('format', dateFilters.format);
  Vue.filter('formatRelative', dateFilters.formatRelative);


  // CASING
  Vue.filter('lowerCase', casesFilters.lowerCase);
  Vue.filter('toLower', casesFilters.toLower);
  Vue.filter('upperCase', casesFilters.upperCase);
  Vue.filter('toUpper', casesFilters.toUpper);
  Vue.filter('startCase', casesFilters.startCase);
  Vue.filter('capitalCase', casesFilters.capitalCase);
  Vue.filter('capitalize', casesFilters.capitalize);

  // NUMERI
  Vue.filter('toFixed', numberFilters.toFixed);

  // STRINGHE
  Vue.filter('mobilePhoneStripPrefix', stringFilters.mobilePhoneStripPrefix);
  Vue.filter('dayWeek', stringFilters.dayWeek);
  Vue.filter("emptyString", v => v || "-");
}
