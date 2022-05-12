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
  import {equalsIgnoreCase} from "../../../services/global/utils";
  import addDays from 'date-fns/add_days';
  import subDays from 'date-fns/sub_days';

  export default {
    name: 'CsiAppGuardMaintenance2',
    components: {},
    props: {},
    data() {
      return {}
    },
    computed: {
      appList() {
        return  this.$store.getters['global/getAppList']
      },
        isAlpha(){
            return this.$config.global.isAlpha
        }
    },
    created() {

      const isInMaintenance = (route) => {

        let appCode = route && route.meta && route.meta.appServiceCode;

        // Se per qualche motivo la route non ha il codice del servizio
        // => assumiamo che non sia in manutenzione
        if (!appCode) return false;
        console.log('appCode', appCode)

          //Se sono in alpha posso entrare comunque
          console.log(this.isAlpha)
          if(this.isAlpha) return false;

          if(this.appList && this.appList.length>0){
            let workingApp=this.appList.find(app => equalsIgnoreCase(app.portale_codice,appCode) )
            if(!workingApp)  return false;

            let now = new Date()
            let startDate = workingApp.manutenzione_data_inizio
            let endDate = workingApp.manutenzione_data_fine

            //Se sentrambe le date non sono popolate  non c'è manutenzione
            if(!startDate && !endDate) return false;

            startDate = startDate || subDays(now, 1)
            endDate = endDate || addDays(now, 1)


            return this.isAfterCompare(now, startDate) && this.isBeforeCompare(now, endDate)

          }else
            return false

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
