/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/**
 * @description
 * Questo file contiene la configurazione unica dell'applicazione.
 *
 * In questo modo abbiamo un SSOT (Single Source Of Truth)
 * che ci permette di capire subito com'è configurata l'app.
 * Inoltre ci permette di restare DRY (Don't Repeat Yourself).
 *
 * La configurazione contiene la proprietà `envs`
 * che fa da proxy verso le variabili d'ambiente impostate in fase di
 * building dell'applicativo.
 *
 * Questo ci permette di sapere esattamente su quale environment sta girando l'app.
 * Inoltre possiamo distinguere il comportamento semplicemente aggiungendo delle variabli d'ambiente.
 */
import config from '@configs';

export {config};
export default ({app, router, Vue}) => {
  Vue.prototype.$config = config;
}
