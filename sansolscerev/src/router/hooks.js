/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import store from '@store'
import {APP} from '@router/routes/global'
import {supportsES6} from '@services/global/utils'
import {Notify} from 'quasar'
import {login} from '@services/global/session'


export const canAccessRoute = (route) => {
  console.debug('[Router] Check if the user can access to route', {route})

  // se non si tratta di una route accessibile a tutti => controlliamo prima che l'utente sia loggato
  let isPublicRoute = route.meta && route.meta.isPublic
  let isUserLogged = store.getters['global/isUserLogged']
  let isUserMinor = store.getters['global/isUserMinor']

  // Al primo accesso Vue router potrebbe non aver ancora risolto l'url della HOME
  let isVueRouterResolvingUrl = route.fullPath === '/'
  console.debug('[Router] Info:', {isPublicRoute, isUserLogged, isVueRouterResolvingUrl, isUserMinor})

  // if (isUserMinor) return route.meta.isVisibleToMinor
  return isPublicRoute || isUserLogged || isVueRouterResolvingUrl
}


// questo hook controlla se la route di destinazione richiede il login
// se richiede il login e l'utente non è loggato => redirige al login
// altrimenti fa proseguire il flusso di navigazione normalmente
//
// @NOTE: questo metodo NON può essere chiamato prima della fine del caricamento iniziale
export const ensureLogin = (to, from, next) => {

  console.debug('[Router] Ensure login', {from, to})
  let canAccess = canAccessRoute(to)

  // Se l'utente non può accedere alla route => effettuiamo il redirect al login
  if (!canAccess) {

    // if (store.getters['global/isUserMinor']) {
    //   console.debug('[Router] The route is not visible to minor => redirect to home...')
    //   next(APP)
    //   return
    // }

    if (!store.getters['global/isUserLogged']) {
      console.debug('[Router] The route is not public and the user is not logged => redirect to login...')
      login()
      return
    }

    console.debug('[Router] The route is not public and the user is logged => redirect to home...')
    next(APP)
    return
  }

  // altrimenti andiamo semplicemente avanti
  console.debug('[Router] User can access to route')
  next()
}

