/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/**
 * @description
 * Qui definiamo la struttura dello store Vuex.
 * Sostanzialmente sarà un aggregatore dei moduli Vuex dei singoli acceleratori.
 */
import Vue from 'vue';
import Vuex from 'vuex';

import global from './global';
import healthPayments from './health-payments';
import onlineReports from './online-reports';
import delegations from './delegations';
import prescriptions from './prescriptions';
import incomeExemption from './income-exemption';
import consents from './consents';
import pathologyExemption from './pathology-exemption';
import vaccinations from './vaccinations';
import changeDoctor from './change-doctor';
import covid from './covid';
// import preventionScreening from './prevention-screening';

Vue.use(Vuex);


const store = new Vuex.Store({
  modules: {
    global,
    healthPayments,
    onlineReports,
    delegations,
    prescriptions,
    incomeExemption,
    consents,
    pathologyExemption,
    vaccinations,
    changeDoctor,
    // preventionScreening
    covid
  }
});

export default store;
