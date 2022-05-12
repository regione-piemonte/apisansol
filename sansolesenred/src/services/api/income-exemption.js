/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {axiosInstance, axiosPublicInstance} from '@plugins/axios'
import {config} from '@plugins/config'
import {getUri, openUrl} from '@services/global/utils'
import {composeId, decomposeId} from '@services/income-exemption/business-logic'

const BASE_PATH = config.global.basePaths.incomeExemption

export const getConfiguration = async (config = {}) => {
  const URL = `${BASE_PATH}/configurazione`
  return axiosInstance.get(URL, config)
}

export const getDisclaimer = async (config = {}) => {
  const URL = `${BASE_PATH}/disclaimer`
  return axiosInstance.get(URL, config)
}

export const getFamilyRelationships = async (config = {}) => {
  const URL = `${BASE_PATH}/rapporti-familiari`
  return axiosInstance.get(URL, config)
}

export const getExemptionStatuss = async (config = {}) => {
  const URL = `${BASE_PATH}/stati-esenzione`
  return axiosInstance.get(URL, config)
}

export const getExemptionCodes = async (config = {}) => {
  const URL = `${BASE_PATH}/codici-esenzione`
  return axiosInstance.get(URL, config)
}

export const getInfo = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/info`
  return axiosInstance.get(URL, config)
}

export const getBeneficiaries = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/beneficiari`
  return axiosInstance.get(URL, config)
}

export const getHolders = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/titolari`
  return axiosInstance.get(URL, config)
}

export const getExemptions = async (cf, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni`

  // @FIXME: hack temporaneo per il servizio che va in errore se non viene passato il filtro
  let params = config.params || {}
  params.filter = params.filter || {}

  let response = await axiosInstance.get(URL, config)

  // Modifichiamo al volo i dati per comporre l'id
  // In questo modo il resto dell'applicazione non deve preoccuparsi di gestire le varie casistiche
  if (response && response.data) {
    response.data.forEach(e => e.id = composeId(e))
  }

  return response
}

export const getExemption = async (cf, id, config = {}) => {
  let {originalId, beneficiaryCf} = decomposeId(id)
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${originalId}`

  config.headers = config.headers || {}
  config.headers = {...config.headers, 'Accept': 'application/json'}

  config.params = config.params || {}
  config.params.cf_beneficiario = config.params.cf_beneficiario || beneficiaryCf

  let response = await axiosInstance.get(URL, config)

  // Modifichiamo al volo i dati per comporre l'id
  // In questo modo il resto dell'applicazione non deve preoccuparsi di gestire le varie casistiche
  if (response && response.data) {
    response.data.id = composeId(response.data)
  }

  return response
}

export const downloadExemption = async (cf, id, config = {}) => {

  let axios = axiosInstance
  let {originalId, beneficiaryCf} = decomposeId(id)

  let url = `${BASE_PATH}/cittadini/${cf}/esenzioni/${originalId}/pdf`
  let uri = `${axios.defaults.baseURL}${url}`

  config.params = config.params || {}
  config.params.cf_beneficiario = config.params.cf_beneficiario || beneficiaryCf

  let cfg = {url: uri, ...config}
  cfg.params = {...axios.defaults.params, ...cfg.params}
  uri = getUri(cfg)

  openUrl(uri)
  return uri


}

export const createExemption = async (cf, data, config = {}) => {
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni`

  let response = await axiosInstance.post(URL, data, config)

  // Modifichiamo al volo i dati per comporre l'id
  // In questo modo il resto dell'applicazione non deve preoccuparsi di gestire le varie casistiche
  if (response && response.data && response.data.id) {
    response.data.id = composeId(response.data)
  }

  return response
}

export const revokeExemption = async (cf, id, data, httpConfig = {}) => {
  let {originalId, beneficiaryCf} = decomposeId(id)
  const URL = `${BASE_PATH}/cittadini/${cf}/esenzioni/${originalId}/revoca`


    data = data || {}
    data.cf_beneficiario = data.cf_beneficiario || beneficiaryCf


  let response = await axiosInstance.put(URL, data, httpConfig)

  // Modifichiamo al volo i dati per comporre l'id
  // In questo modo il resto dell'applicazione non deve preoccuparsi di gestire le varie casistiche
  if (response && response.data && response.data.id) {
    response.data.id = composeId(response.data)
  }

  return response
}

