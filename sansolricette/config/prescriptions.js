/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

let config = {};

config.documentTypes = {
  PHARMACEUTICAL_PRESCRIPTION:'57833-6',
  PHARMACEUTICAL_PERFORMANCE:'29304-3',
  SPECIALIZED_PRESCRIPTION : '57832-8',
  SPECIALIZED_PERFORMANCE : '81223-0'
}

config.documentTypesLabels = {
  [config.documentTypes.PHARMACEUTICAL_PRESCRIPTION]:'Prescrizione farmaceutica',
  [config.documentTypes.PHARMACEUTICAL_PERFORMANCE]:'Prestazione farmaceutica',
  [config.documentTypes.SPECIALIZED_PRESCRIPTION] : 'Prescrizione specialistica',
  [config.documentTypes.SPECIALIZED_PERFORMANCE] : 'Prestazione specialistica'
}

config.pairList = [
   {categoria: 'FSE', tipologia: config.documentTypes.PHARMACEUTICAL_PRESCRIPTION},
  {categoria: 'FSE', tipologia: config.documentTypes.SPECIALIZED_PRESCRIPTION},
  {categoria: 'FSE', tipologia: config.documentTypes.PHARMACEUTICAL_PERFORMANCE},
  {categoria: 'FSE', tipologia: config.documentTypes.SPECIALIZED_PERFORMANCE}
]

export default config
