<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>


  <q-card v-if="!isLoading" class="csi-pathology-certificate-list-item">
    <template>
      <csi-bar v-if="certificate.utilizzabile" bg-color="primary" text-color="white">
        Da usare
      </csi-bar>

      <csi-bar v-else="certificate.utilizzabile" bg-color="positive">
        Utilizzato
      </csi-bar>
    </template>

    <q-card-main class="no-padding">
      <csi-card-item>

        <template slot="header">
          <q-item v-if="exemption">
            <q-item-main class="q-body-1">
              <div>Esenzione</div>
              <div>
                <strong>
                  {{exemption.codice.codice}} {{exemption.codice.descrizione}}
                </strong>
              </div>
            </q-item-main>
          </q-item>
        </template>


        <template slot="primary">
          <csi-card-item-primary>
            <template slot="icon">
              <csi-icon-base class="csi-svg-icon--lg">
                <csi-pathology-type-icon :code="certificate.tipologia_esenzione.codice"/>
              </csi-icon-base>
            </template>

            <template slot="text">
              <div :class="{'text-bold text-primary': $q.screen.lt.sm}">
                Certificato per {{certificate.tipologia_esenzione.descrizione}}
              </div>
            </template>
          </csi-card-item-primary>
        </template>

        <template slot="secondary">
          <div class="q-pa-md row items-center gutter-xs">

            <div v-if="certificate.malattia.descrizione !=='-'" class="col-12">
              Diagnosi
              <strong>{{certificate.malattia.codice}} {{certificate.malattia.descrizione}}</strong>
            </div>

            <div v-else class="col-12">
              Diagnosi
              <strong>{{certificate.malattia.codice}} </strong>
            </div>


            <div class="col-12">
              Emesso il
              <strong>{{certificate.data_inserimento | format}}</strong>
            </div>

            <template v-if="isDetail">
              <div v-if="certificate.data_aggiornamento" class="col-12">
                Aggiornato il
                <strong>{{certificate.data_aggiornamento | format}}</strong>
              </div>

              <div v-else class="col-12">
                Aggiornato il
                <strong>{{certificate.data_inserimento | format}}</strong>
              </div>

              <div class="col-12">
                Emesso da
                <strong>{{certificate.inserito_da.cognome}} {{certificate.inserito_da.nome}}</strong>
              </div>
            </template>
          </div>
        </template>


        <template slot="actions">
          <slot name="actions">
            <template v-if="!isDetail">
              <csi-buttons class="q-pa-sm">
                <csi-button primary label="Gestisci" @click="onHandle"/>
              </csi-buttons>
            </template>

            <template v-else>
              <csi-buttons class="q-pa-sm">
                <csi-button
                  v-if="certificate.utilizzabile"
                  primary
                  label="Richiedi esenzione"
                  @click="onNewExemption"
                  :loading="isCreatingExemption"
                />
                <csi-button :loading="isDownloading" secondary label="Scarica certificato" @click.native="downloadCertificato"/>
                <csi-button v-if="certificate.utilizzabile===false" secondary label="Visualizza richiesta esenzione"
                            @click="onSeeExemption"/>
              </csi-buttons>
            </template>
          </slot>
        </template>

      </csi-card-item>
    </q-card-main>
  </q-card>


</template>


<script>
    import CsiCardItem from 'components/global/common/CsiCardItem'
    import CsiCardItemPrimary from 'components/global/common/CsiCardItemPrimary'
    import CsiIconBase from 'components/global/icons/CsiIconBase'
    import CsiIconDrugs from 'components/global/icons/CsiIconDrugs'
    import CsiIconCalendar from 'components/global/icons/CsiIconCalendar'
    import CsiBar from 'components/global/common/CsiBar'
    import {createExemption, getCertificatoPdf, getExemptionDetail} from '@services/api/pathology-exemption'
    import CsiPathologyTypeIcon from 'components/pathology-exemption/CsiPathologyTypeIcon'
    import {getExemption} from "@services/api/income-exemption";
    import {notifyError} from "@services/api/utils";

    export default {
        name: 'CsiPathologyCertificateListItem',
        components: {
            CsiPathologyTypeIcon,
            CsiBar, CsiIconCalendar, CsiIconDrugs, CsiIconBase, CsiCardItemPrimary, CsiCardItem
        },
        props: {
            certificate: {type: Object, required: true},
            isDetail: {type: Boolean, required: false, default: false},
            exemption: {type: Object, required: false}
        },
        data() {
            return {
                isCreatingExemption: false,
                isLoading: false,
                isDownloading: false,

            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
        },
        async created() {

        },
        methods: {
            onHandle(...args) {
                // Se c'è l'handler => lo invochiamo perchè il componente padre intende applicare la propria logica
                let eventName = 'click-handle'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug('default @click-handle')
                let name = this.$routes.PATHOLOGY_EXEMPTION.CERTIFICATE_DETAIL.name
                let params = {id: this.certificate.id, certificate: this.certificate, exemption: this.exemption}
                this.$router.push({name, params})
            },
            async onNewExemption(...args) {
                // Se c'è l'handler => lo invochiamo perchè il componente padre intende applicare la propria logica
                let eventName = 'click-new-exemption'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug(`default @${eventName}`)

                // create the exemption on the server
                let payload = {
                    certificato_id: this.certificate.id,
                    malattia: this.certificate.malattia,
                    tipologia: this.certificate.tipologia_esenzione,
                    data_rilascio: this.certificate.data_inserimento,
                    data_fine_validita: this.certificate.data_scadenza
                }
                this.isCreatingExemption = true
                let response = await createExemption(this.cf, payload)
                let exemption = response.data
                this.isCreatingExemption = false

                // then go to feedback routes
                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_NEW_SUCCESS.name
                let params = {id: exemption.id, exemption}
                this.$router.push({name, params})
            },

            async downloadCertificato() {
                this.isDownloading=true
                try {
                    let response = await getCertificatoPdf(this.cf, this.certificate.id)
                }catch(e){
                    notifyError(e, 'Non è stato possibile stampare il certificato')
                    this.isDownloading = false;
                }
                setTimeout(this.downloading, 3000)
            },
            downloading() {
                this.isDownloading = !this.isDownloading
            },


            onDownload(...args) {
                // Se c'è l'handler => lo invochiamo perchè il componente padre intende applicare la propria logica
                let eventName = 'click-download'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug(`default @${eventName}`)
            },
            onSeeExemption(...args) {
                // Se c'è l'handler => lo invochiamo perchè il componente padre intende applicare la propria logica
                let eventName = 'click-see-exemption'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug(`default @${eventName}`)
                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_DETAIL.name
                let params = {id: this.certificate.esenzione_id}
                this.$router.push({name, params})
            },
        },
    }
</script>


<style scoped lang="stylus"></style>
