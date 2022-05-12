/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import globalConfig from "@configs/global";
import incomeExemptionConfig from "@configs/income-exemption";
import onlineReportsConfig from "@configs/online-reports";
import delegationsConfig from "@configs/delegations";
import enrollmentConfig from "@configs/enrollment";
import healthPaymentsConfig from "@configs/health-payments";
import consentsConfig from "@configs/consents";
import vaccinationsConfig from "@configs/vaccinations";
import pathologyExemptionConfig from "@configs/pathology-exemption";
import changeDoctorConfig from "@configs/change-doctor";
import covidConfig from "@configs/covid";
import prescriptions from "@configs/prescriptions";

export default {
  global: globalConfig,
  incomeExemption: incomeExemptionConfig,
  onlineReports: onlineReportsConfig,
  delegations: delegationsConfig,
  enrollment: enrollmentConfig,
  healthPayments: healthPaymentsConfig,
  consents: consentsConfig,
  vaccinations: vaccinationsConfig,
  pathologyExemption: pathologyExemptionConfig,
  changeDoctor: changeDoctorConfig,
  covid: covidConfig,
  prescriptions: prescriptions
};
