<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-service-app-page" :class="appPageClasses">
    <portal :to="portalTo">
      <div>
        <slot name="before-toolbar"></slot>

        <q-toolbar color="secondary">
          <slot name="toolbar-content">
            <q-toolbar-title @click.native="$emit('title-click')" class="cursor-pointer">
              {{toolbarTitle}}
            </q-toolbar-title>

            <slot name="toolbar-title-after"/>
            <portal-target v-if="portalTargetName" :name="portalTargetName">
              <!--
              This component can be located anwhere in your App.
              The slot content of the above portal component will be rendered here.
              -->
            </portal-target>
          </slot>
          <div v-if="$q.screen.gt.sm" class="q-px-xs"></div>
          <csi-active-delegation-button
            v-if="delegationMode"
            :delegators="delegators"
            :has-ajax-error="hasAjaxError"
            @click="setActiveDelegator"
          />
        </q-toolbar>

        <csi-active-delegation-toolbar
          v-if="delegationMode && activeDelegation"
          :full-name="delegationFullName"
          @unset="unsetActiveDelegation"
        />

        <slot name="after-toolbar"></slot>
      </div>
    </portal>


    <slot/>
  </div>
</template>


<script>
  import CsiActiveDelegationToolbar from "components/global/common/CsiActiveDelegationToolbar";
  import CsiActiveDelegationButton from "components/global/common/CsiActiveDelegationButton";
  import {getDelegators, getServiceDelegators} from "@services/api/delegations";
  import {isDelegationValid} from "@services/delegations/business-logic";
  import {equalsIgnoreCase} from "@services/global/utils";

  export default {
    name: 'ServiceAppPage',
    components: {CsiActiveDelegationButton, CsiActiveDelegationToolbar},
    props: {
      serviceCode: {type: String, required: false, default: null},
      toolbarTitle: {type: String, default: ''},
      portalTargetName: {type: String, default: undefined},
      delegationMode: {type: Boolean, default: false},
      fseDocDelegators: {type: Boolean, required: false, default: false},
      activeDelegation: {type: Object, default: null},
      portalTo: {type: String, required: false, default: 'layout-app-toolbar-after'}
    },
    data() {
      return {
        delegators: [],
        hasAjaxError: false,
      }
    },
    computed: {
      appPageClasses() {
        return {
          'delegation-mode': this.delegationMode && this.activeDelegation
        }
      },
      delegationFullName() {
        if (!this.activeDelegation) return '';
        return `${this.activeDelegation.nome_delega} ${this.activeDelegation.cognome_delega}`;
      },
      isUserLogged() {
        return this.$store.getters['global/isUserLogged']
      },
    },
    methods: {
      setActiveDelegator(delegator) {
        this.$emit('set-delegation', delegator);
      },
      unsetActiveDelegation() {
        this.$emit('unset-delegation');
      }
    },
    async created() {
      // if (this.delegationMode && this.serviceCode) {
      if (this.isUserLogged && this.serviceCode) {
        let user = this.$store.getters['global/user']

        // Se non riusciamo ad ottenere i deleganti per qualche motivo => non facciamo il redirect alla schermata
        // del robottino ma semplicemente facciamo finta che non ci siano deleganti
        try {
          // let response = await getServiceDelegators(user.cf, this.serviceCode, {_no5XXRedirect: true});
          let response = await getDelegators(user.cf, {_no5XXRedirect: true});

          this.delegators = response.data.filter(delegator => {
            return delegator.deleghe.some(delegation => {
              let isServiceDelegator = equalsIgnoreCase(delegation.codice_servizio, this.serviceCode);
              if (this.fseDocDelegators) isServiceDelegator = isServiceDelegator || equalsIgnoreCase(delegation.codice_servizio, 'FSEDOC');
              let isValid = isDelegationValid(delegation.stato_delega);
              return isServiceDelegator && isValid;

              // return equalsIgnoreCase(delegation.codice_servizio, this.serviceCode) && isDelegationValid(delegation.stato_delega)
            })
          })

        } catch (e) {
          console.error(e);
          this.hasAjaxError = true
        }
        console.log(this.delegators)

      }
    }
  }
</script>


<style scoped lang="stylus">
</style>
