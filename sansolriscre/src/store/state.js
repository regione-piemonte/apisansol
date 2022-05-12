/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export default function() {
  return {
    config: {},
    user: null,
    notifyContacts: null,
    fcmToken: null,
    enrollmentInfo: null,
    delegatorList: [],
    delegatorSelected: null,
    delegatorSelectedEnrollmentInfo: null,
    delegatorListError:false,
  };
}
