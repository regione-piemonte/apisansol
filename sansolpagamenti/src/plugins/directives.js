/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import Sticky from 'vue-sticky-directive'


/**
 * @description
 * In questo file registriamo globalmente i componenti usati frequentemente
 * es: <csi-button>
 */
export default ({ app, router, Vue }) => {

  Vue.use(Sticky)

}
