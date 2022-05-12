<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-page padding>
    <div v-if="exemption">
      <csi-page-title :title="pageTitle" @back="onBack" />

      <q-alert type="info" class="q-mt-md">
        Per revocare l'esenzione inserisci l'eventuale motivo della revoca e premi "Conferma Revoca"
      </q-alert>

      <q-card class="q-mt-md">
        <q-card-title>Motivo della revoca</q-card-title>
        <q-card-main>
          <q-field>
            <q-input v-model="motivation" type="textarea" float-label="Motivazione" />
          </q-field>
        </q-card-main>
      </q-card>

      <!-- <csi-exemption-item
         :exemption="exemption"
         no-revoke-action
         detail
         class="q-mt-md">
       </csi-exemption-item>
       <div class="col-3 q-pa-md">
         <q-btn @click="onRevoke" color="negative">Conferma revoca</q-btn>
       </div>
       -->

      <csi-buttons class="q-pa-sm">
        <csi-button primary label="Conferma revoca" color="negative" :loading="isRevoking" @click="onRevoke" />
        <csi-button secondary label="Indietro" @click="onBack" />
      </csi-buttons>
    </div>
  </q-page>
</template>


<script>
    import {getExemption, revokeExemption} from "@services/api/income-exemption";
    import CsiExemptionItem from "components/income-exemption/CsiExemptionItem";
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import {notifyError} from "@services/api/utils";

    export default {
        name: "PageExemptionRevoke",
        components: {CsiExemptionItem, CsiPageTitle},
        data() {
            return {
                exemption: null,
                motivation: '',
                isRevoking: false,
            };
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            pageTitle() {
                if (!this.exemption || !this.exemption.codice_esenzione) return 'Revoca esenzione'
                return `Esenzione ${this.exemption.codice_esenzione.codice} - N.Protocollo ${this.exemption.protocollo}`
            }
        },
        async created() {
            let {id, exemption} = this.$route.params

            if (!exemption) {
                let response = await getExemption(this.user.cf, id);
                exemption = response.data
            }

            this.exemptionId = id
            this.exemption = exemption;
        },
        methods: {
            async onRevoke() {
                this.isRevoking = true

                try {

                    let payload = {motivazione_revoca: this.motivation}

                    // Attualmente questa modifica non possiamo propagarla in produzione
                    // per questo motivo la teniamo fino ad alpha
                    // if (!this.$config.global.isProduction){
                      if (this.exemption && this.exemption.codice_esenzione){
                        payload.codice_esenzione = this.exemption.codice_esenzione.codice
                      }
                    // }

                    let response = await revokeExemption(this.user.cf, this.exemptionId, payload, {_no5XXRedirect: true});
                    this.$q.notify({message: 'Esenzione revocata'});
                    this.$router.push(this.$routes.INCOME_EXEMPTION.EXEMPTION_LIST);
                } catch (e) {
                    notifyError(e, `Non è stato possibile revocare l'esenzione`)
                }

                this.isRevoking = false
            },
            onBack() {
                this.$router.go(-1)
            }
        }
    }
</script>
