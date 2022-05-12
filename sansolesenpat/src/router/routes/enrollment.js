
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const FLOW = {
  path: 'arruolamento',
  name: 'enrollmentFlow',
  component: () => import('pages/enrollment/PageEnrollmentFlow'),
  meta: {
    prettyName: 'Arruolamento',
    analyticsIgnore: true
  }
};

