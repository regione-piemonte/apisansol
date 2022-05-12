/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {format} from "@filters/date";
import startOfDay from "date-fns/start_of_day";

export default {
  activeDelegation: null,
  userInfo : null,
  activeUserEnrollmentInfo:null,
  userDoctor: null,
  monitoredDoctors : null,
  doctorTypes:null,
  isAskedAddress:false,
  // fromAnonimousPage:false,
  requestInformation : {},
  renewTemporaryAssistance:false,
  attachmentsOptions: {},
  attachmentsTypeList:[],
  isFamilyReunificationInfo : false,
  toBackoffice:false,
  disclaimer: null,
  newAllowedDateChanges : null,
  isMaxLimitChangeOrRevoke :false,
  isAssistanceRenewal:false,
  residence:null,
  domicile:null
}
