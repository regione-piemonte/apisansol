<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-app-guard-maintenance">
    <slot />
  </div>
</template>


<script>
  import isBefore from 'date-fns/is_before';
  import isAfter from 'date-fns/is_after';

  export default {
    name: 'CsiAppGuardMaintenance',
    components: {},
    props: {},
    data() {
      return {}
    },
    computed: {
      appConfig() {
        return this.$store.getters['global/appConfig']
      },
        isAlpha(){
            return this.$config.global.isAlpha
        }
    },
    created() {
        console.log(this.isAlpha)
      const isInMaintenance = (route) => {

        let appCode = route && route.meta && route.meta.appServiceCode;

        // Se per qualche motivo la route non ha il codice del servizio
        // => assumiamo che non sia in manutenzione
        if (!appCode) return false;
        console.log('appCode', appCode)

          //Se sono in alpha posso entrare comunque
          console.log(this.isAlpha)
          if(this.isAlpha) return false;

        let maintenanceConfig = this.appConfig && this.appConfig.in_manutenzione;

        // Se per qualche motivo non abbiamo la configurazione di manutenzione
        // => assumiamo che la route non faccia parte di un servizio in manutenzione
        //=>Se non c'è data di inizio, non c'è manutenzione.
        if (!maintenanceConfig || !maintenanceConfig[appCode] || maintenanceConfig[appCode].data_inizio === null) return false;
        // Controlliamo data di inizio e data fine manutenzione
        const now = new Date();

        if(this.isAfterCompare(now, new Date(maintenanceConfig[appCode].data_inizio))){
          if (maintenanceConfig[appCode].data_fine !== null &&
            this.isBeforeCompare(now, new Date(maintenanceConfig[appCode].data_fine)) ||
            maintenanceConfig[appCode].data_fine === null)  return true
        }

        return false;


        // if (!maintenanceConfig) return false
        // return maintenanceConfig[appCode]
      }

      const checkMaintenance = (to, from, next) => {

        console.debug('[Router] checkMaintenance', {from, to})

        if (isInMaintenance(to)) {
          console.debug('[Router] Service in maintenance', {to})
          console.debug('[Router] Redirect to maintenance page')
          next(this.$routes.ERRORS.MAINTENANCE)
          return
        }

        // altrimenti andiamo semplicemente avanti
        console.debug('[Router] Service not in maintenance', {to})
        next();
      }


      this.$router.beforeEach(checkMaintenance)

      this.$router.onReady(() => {
        // Impostiamo la route corrente perchè c'è un bug in Vue Router
        // @see https://github.com/vuejs/vue-router/issues/2385
        let resolved = this.$router.resolve(window.location, this.$router.history.current)
        // let resolved = this.$router.resolve(window.location)
        let route = resolved.route

        if (isInMaintenance(route)) {
          console.debug('[FirstAccess] Service in maintenance', {route})
          console.debug('[FirstAccess] Redirect to maintenance page')
          this.$router.push(this.$routes.ERRORS.MAINTENANCE)
        }
      })
    },
    methods: {

     isAfterCompare(data, dataToCompare){
       return   isAfter(data,dataToCompare)
     },

      isBeforeCompare(data, dataToCompare){
        return   isBefore(data,dataToCompare)
      }

    },
  }
</script>


<style scoped lang="stylus"></style>
