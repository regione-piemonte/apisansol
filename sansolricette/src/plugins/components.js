/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import CsiButton from "components/global/design/CsiButton";
import CsiButtons from "components/global/design/CsiButtons";
import CsiStepper from "components/global/common/CsiStepper";
import CsiInnerLoading from "components/global/common/CsiInnerLoading";

/**
 * @description
 * In questo file registriamo globalmente i componenti usati frequentemente
 * es: <csi-button>
 */
export default ({ app, router, Vue }) => {

  Vue.component(CsiButton.name, CsiButton)
  Vue.component(CsiButtons.name, CsiButtons)
  Vue.component(CsiStepper.name, CsiStepper)
  Vue.component(CsiInnerLoading.name, CsiInnerLoading)
}
