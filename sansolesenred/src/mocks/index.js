/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import MockAdapter from 'axios-mock-adapter';



export default (axiosInstance) => {

  // @see https://github.com/ctimmerm/axios-mock-adapter#readme
  let config = {delayResponse: 800};
  let mock = new MockAdapter(axiosInstance, config);


  // Aggiungiamo i mock che vogliamo abilitare
  // -----------------------------------------



  // Mocks degli errori per testing
  mock.onGet(new RegExp('/dev/status/200')).reply(200)
  mock.onGet(new RegExp('/dev/status/201')).reply(201)
  mock.onGet(new RegExp('/dev/status/204')).reply(204)
  mock.onGet(new RegExp('/dev/status/400')).reply(400)
  mock.onGet(new RegExp('/dev/status/401')).reply(401)
  mock.onGet(new RegExp('/dev/status/403')).reply(403)
  mock.onGet(new RegExp('/dev/status/404')).reply(404)
  mock.onGet(new RegExp('/dev/status/500')).reply(500)
  mock.onGet(new RegExp('/dev/status/502')).reply(502)


  // Tutti gli endpoint che non hanno un mock vengono trattati come una normale chiamata AJAX.
  mock.onAny().passThrough();
}
