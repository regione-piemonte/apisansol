/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config'
import subDays from 'date-fns/sub_days'
import isWithinRange from 'date-fns/is_within_range'
import {format} from '@services/global/utils'

export const getId = exemption => {
  if (exemption.id) return exemption.id
  let date = format(exemption.data_inizio_validita, 'DDMMYYYY')
  return `${exemption.protocollo}-${exemption.codice_esenzione.codice}-${date}`
}

export const composeId = exemption => {
  let id = getId(exemption)
  let beneficiaryCf = exemption.creato_per.codice_fiscale
  return `${id}---${beneficiaryCf}`
}

export const decomposeId = (id = '') => {
  let [originalId, beneficiaryCf] = id.split('---')
  return {originalId, beneficiaryCf}
}

export const getStatusLabel = status => {
  return config.incomeExemption.status2Label[status]
}

export const isRevocable = exemption => {
  return config.incomeExemption.revocableStatuss.includes(exemption.stato.codice)
}


export const isExpiring = exemption => {
  let now = new Date()
  let upperLimit = exemption.data_scadenza
  let lowerLimit = subDays(upperLimit, config.incomeExemption.expiringDays)
  return isWithinRange(now, lowerLimit, upperLimit)
}
