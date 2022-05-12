
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export const ERROR_BOOTSTRAP = {
  path: '/errori/bootstrap',
  name: 'errorBootstrap',
  component: () => import('pages/global/errors/ErrorBootstrap'),
  meta: {
    isPublic: true,
    analyticsIgnore: true
  }
}

export const ERROR_500 = {
  path: '/errori/500',
  name: 'error500',
  component: () => import('pages/global/errors/Error500'),
  meta: {
    isPublic: true,
    analyticsIgnore: true
  }
}

export const ERROR_404 = {
  path: '*',
  alias: 'errori/404',
  name: 'error404',
  component: () => import('pages/global/errors/Error404'),
  meta: {
    isPublic: true,
    analyticsIgnore: true
  }
}

export const MAINTENANCE = {
  path: '/errori/maintenance',
  alias: 'maintenance',
  name: 'maintenance',
  component: () => import('pages/global/errors/Maintenance'),
  meta: {
    isPublic: true,
    analyticsIgnore: true
  }
}
