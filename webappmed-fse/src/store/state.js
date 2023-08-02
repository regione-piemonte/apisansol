/**
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2023
 */

export default function() {
  return {
    user: null,
    activeRole:null,
    activePlacement: null,
    userInfo:null,
    enabledPatients:[],
    selectedSystem:null,
    activePatient:null,
    patientDoctor:null,
    systemList:[],
    documentTypeList:[],
    documentCategoriesList:[],
    patientSanitaryNotebook:null,
    documentTypeFilter:null
  };
}
