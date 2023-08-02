/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */

import { store } from "src/store";

export const urlPua = () => {
  let url = "url";
  if (process.env.APP_IS_PROD) url = "url";
  return url;
};
