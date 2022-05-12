/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance} from "@plugins/axios";
import {config} from "@plugins/config";
import {getUri, openUrl} from "@services/global/utils";
import store from "@store/index";


const BASE_PATH = config.global.basePaths.prescriptions;



let isHidden = false

export function hidden() {
  isHidden = true
}


export const getPrescriptionStatuss = (config = {}) => {
  const URL = `${BASE_PATH}/stati-ricette`;
  return axiosInstance.get(URL, config);
}


export const getPrescriptionTypes = (config = {}) => {
  const URL = `${BASE_PATH}/tipologie-ricette`;
  return axiosInstance.get(URL, config);
}

//gestione cache

const generateCacheId = (cf, config) => {

  let type = config.params.filter.tipologia.eq
  let regional = config.params.filter.regionale.eq
  let parts = [cf, type, regional]

  if (config.params.filter.data_compilazione) {
    let start = config.params.filter.data_compilazione.gte.toString().split('T')[0]


    let to = config.params.filter.data_compilazione.lte.toString().split('T')[0]
    parts = [...parts, start, to]

  }


  let id = parts.join('__')
  return id
}

export const memoizePrescriptions = fn => {
  let cache = new Map()

  const cached = function (cf, config) {
    let id = generateCacheId(cf, config)
    console.log('[Prescriptions][Cache]', {cf, id})

    if (isHidden === true) {
      isHidden = false
      cache.clear();

      return cache.set(id, fn.call(this, cf, config)) && cache.get(id)
    }

    if(cache.has(id)) {
      console.log('[Prescriptions][Cache] Getting from cache', {cf, id, response: cache.get(id)})
    } else {
      console.log('[Prescriptions][Cache] asking to server', {cf, id, response: cache.get(id)})
    }

    return cache.has(id) ? cache.get(id) : cache.set(id, fn.call(this, cf, config)) && cache.get(id)
  }


  cached.cache = cache


  return cached
}
//fine gestione cache


export const getPrescriptions = memoizePrescriptions(
  (cf, config = {}) => {
    const URL = `${BASE_PATH}/cittadini/${cf}/ricette`
    return axiosInstance.get(URL, config)
  }
)


export const getPrescriptionsVisits = (cf, piedmont, config = {}) => {
  let today = new Date().toISOString().slice(0, 10)
  let monthAgo = new Date()
  monthAgo.setDate(monthAgo.getDate() - 30)
  monthAgo = monthAgo.toISOString().split('T')[0]

  let defaultFilter = {
    tipologia: {eq: 'P'},
    regionale: {eq: piedmont},
    data_compilazione: {gte: monthAgo, lte: today}
  }


  if (!config.params) config.params = {}
  if (!config.params.filter) config.filter = {}
  config.params.filter = {...defaultFilter, ...config.params.filter}

  return getPrescriptions(cf, config)
}


export const getPrescriptionsDrugs = (cf, piedmont, config = {}) => {
  let today = new Date().toISOString().slice(0, 10)
  let monthAgo = new Date()
  //monthAgo.setMonth(monthAgo.getMonth() - 1);
  //monthAgo.toISOString().substring(0, 10)
  monthAgo.setDate(monthAgo.getDate() - 30)
  monthAgo = monthAgo.toISOString().split('T')[0]


  let defaultFilter = {
    tipologia: {eq: 'F'},
    regionale: {eq: piedmont},
    //data_compilazione: {gte: monthAgo, lte: today},
  }

  if (!config.params) config.params = {}
  if (!config.params.filter) config.filter = {}
  config.params.filter = {...defaultFilter, ...config.params.filter}

  return getPrescriptions(cf, config)
}


export const getPrescription = (cf, id, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/ricette/${id}`;
  return axiosInstance.get(URL, config);
}


export const updatePrescriptionHiddenStatus = (cf, id, payload, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/ricette/${id}/nascosta`;
  hidden();
  return axiosInstance.put(URL, payload, config);
}


export const getPrescriptionPdf = (cf, id, config = {}) => {
  let axios = axiosInstance
  let url = `${BASE_PATH}/cittadini/${cf}/ricette/${id}/pdf`
  let uri = `${axios.defaults.baseURL}${url}`


  let cfg = {url: uri, ...config}

  uri = getUri(cfg)

  openUrl(uri)

  return uri

}

export const getPrescriptionPdfAjax = (cf, id, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/ricette/${id}/pdf`;
  return axiosInstance.get(URL, config);
}

