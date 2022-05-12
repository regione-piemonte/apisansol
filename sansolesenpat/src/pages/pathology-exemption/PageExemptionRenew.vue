<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Rinnovo esenzione"/>

    <template v-if="exemption && !isLoading">

      <q-alert v-if="certificatiPapabili.length===0" class="q-mt-md" color="info">
        <q-card-main>
          <div class="row items-center gutter-sm">
            <div class="col-12 text-bold">
              Non hai un certificato disponibile per il rinnovo dell'esenzione. Se desideri rinnovarla devi caricare un
              file
              valido in formato pdf
            </div>
          </div>
        </q-card-main>
      </q-alert>
      <!-- Riepilogo tipologia esenzione -->
      <q-card class="q-mt-md">
        <q-card-main>
          <div class="row gutter-sm">
            <div class="col-12">
              <div class="q-body-2">Tipo esenzione</div>
              <div class="q-body-1">
                {{exemption.tipologia.descrizione}}
              </div>
            </div>
          </div>
        </q-card-main>
      </q-card>

      <!-- Riepilogo patologia -->
      <q-card class="q-mt-md">
        <q-card-main>
          <div class="row gutter-sm">
            <div v-if="exemption.malattia.descrizione!=='-' " class="col-12 col-sm-6">
              <div class="q-body-2">Patologia</div>
              <div class="q-body-1">
                {{exemption.malattia.descrizione}}
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="q-body-2">Codice esenzione</div>
              <div class="q-body-1">
                {{exemption.codice.codice}}
              </div>
            </div>

            <div
              v-if="exemption.malattia && exemption.malattia.prestazioni && exemption.malattia.prestazioni.length"
              class="col-12 col-sm-6">
              <div class="q-body-2">Prestazioni esenti</div>
              <q-list no-border dense class="no-padding">
                <q-item
                  v-for="performance in exemption.malattia.prestazioni"
                  :key="performance.codice"
                  class="no-padding">
<!--                  <q-item-side class="q-body-1">{{performance.codice}}</q-item-side>-->
                  <q-item-main class="q-body-1">{{performance.descrizione}}</q-item-main>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-main>
      </q-card>

      <!--con certificato -->

      <q-card v-if="certificatiPapabili.length > 0" class="q-mt-md">
        <q-card-main>

          <div class="row items-center gutter-sm">
            <div class="q-body-2">
              Puoi richiedere il rinnovo dell'esenzione tramite uno dei certificati disponibili
            </div>
            <div v-for="certificate in certificatiPapabili" :key="certificate.id" class="col-12">
              <csi-pathology-certificate-list-item :certificate="certificate">
                <template slot="actions">
                  <csi-buttons class="q-pa-sm">
                    <csi-button
                      primary
                      label="Seleziona certificato" @click="onCertificateSelected(certificate)"

                    />
                  </csi-buttons>
                </template>
              </csi-pathology-certificate-list-item>
            </div>
          </div>


          <div>

          </div>
        </q-card-main>
      </q-card>
      <q-alert class="q-mt-md" type="info" v-if="certificateSelected">

          <div class="row items-center gutter-sm">
            <div class="q-body-2">
              Hai selezionato il certificato {{certificato_id}} per {{selectedCertificate.malattia.descrizione}}
            </div>
          </div>

      </q-alert>


      <!-- tipo documenti -->


      <q-card v-if="documentTypeSelected==='DIGITALE' && !certificateSelected" class="q-mt-md">
        <q-card-main>
          <div class="col-auto ">
            <q-field>
              <q-select

                v-model="documentTypologySelected"
                :options="documentTypologyOptions"
                float-label="Tipologia di documento da allegare"
                filter
                autofocus-filter
                filter-placeholder="Cerca tra i tipi di documento"
              >
              </q-select>
            </q-field>
          </div>
        </q-card-main>
      </q-card>


      <!-- Riepilogo documentazione -->
      <q-card v-if="documentTypeSelected==='DIGITALE' && !certificateSelected" class="q-mt-md" ref="upload">
        <q-card-main>
          <h5 class="csi-h5 q-mb-md">Documenti</h5>

          <div class="row items-center gutter-sm">
            <div class="col-12">

              <div v-if="documentTypeSelected!=='CARTACEO' &&documentTypeSelected!=='DIGITALE'">
                Seleziona documento cartaceo o digitale
              </div>
              <q-field v-if="documentTypeSelected==='DIGITALE'">
                <q-uploader
                  ref="uploader"
                  float-label="Documentazione da allegare"
                  url=""
                  extensions=".pdf"
                  hide-upload-button
                  hide-upload-progress
                  clearable
                  auto-expand
                  class="csi-uploader"
                  @add="onDocumentsAdded"
                  @remove:cancel="onDocumentRemoved"
                />

              </q-field>
            </div>

            <div v-if="documentTypeSelected==='DIGITALE'" class="col-12 col-sm">
              <q-field>
                <q-datetime
                  type="date"
                  float-label="Data rilascio documentazione"
                  v-model="documentStartDate"
                  format="DD MMM YYYY"
                />


              </q-field>
            </div>

            <div v-if="documentTypeSelected==='DIGITALE'" class="col-12 col-sm">
              <q-field>
                <q-datetime
                  type="date"
                  float-label="Data scadenza"
                  v-model="documentEndDate"
                  format="DD MMM YYYY"
                  :min="today"
                  clearable
                />
              </q-field>
            </div>
          </div>
        </q-card-main>
      </q-card>

      <!-- Note -->
      <q-card class="q-mt-md">
        <q-card-main>
          <h5 class="csi-h5 q-mb-md">Comunicazioni con l'operatore ASL</h5>

          <q-field>
            <q-input
              v-model="notes"
              type="textarea"
              float-label="Note"
              :max-height="200"
              rows="4"
            />
          </q-field>
        </q-card-main>
      </q-card>


      <q-card class="q-mt-md" v-if="exemption.tipologia.codice===$config.pathologyExemption.typology.Malattie_rare">
        <!--disclaimer -->
        <div class="q-pa-md">
          <div class="csi-h5 q-mb-md">
            Informazioni sul trattamento dei dati personali per Malattie Rare
          </div>

          <template>
            <csi-policy class="q-pt-md">
              <template slot="text">
                <!-- <div v-html="disclaimer_malattie_rare"></div> -->
                <div>Malattie Rare: Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt
                  ut labore et
                  dolore
                  magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit
                  laboriosam,
                  nisi ut aliquid ex ea commodi consequatur
                </div>
              </template>
            </csi-policy>
          </template>
        </div>

        <div class="q-pa-md">
          <q-toggle v-model="iscritto"
                    label="dichiaro di essere iscritto al registro interregionale delle malattie rare"></q-toggle>
        </div>
      </q-card>
      <q-card class="q-mt-md">

        <div class="  q-pa-md">
          <div class="csi-h5 q-mb-md">
            Informazioni sul trattamento dei dati personali ai sensi del GDPR 2016/679
          </div>
          <template>
            <csi-policy class="q-pt-md">
              <template slot="text">
                <!-- <div v-html="disclaimer"></div> -->
                <div>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et
                  dolore
                  magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit
                  laboriosam,
                  nisi ut aliquid ex ea commodi consequatur
                </div>
              </template>
            </csi-policy>
          </template>

          <div class="q-ma-md">
            <q-toggle v-model="acconsento"
                      label="Il presente documento è inviato telematicamente dal sottoscritto ai sensi dell'art. 38 del
                         Decreto del Presidente della Repubblica 445/00 e dell'art. 65 del D. Lgs. 82/2005 e s.m.i.,
                          conscio che le dichiarazioni inviate o compilate per via telematica sono equivalenti alle istanze
                           e alle dichiarazioni sottoscritte con firma autografa apposta in presenza del dipendente addetto
                            al procedimento."></q-toggle>
          </div>

        </div>

      </q-card>


      <csi-buttons class="q-mt-lg">
        <csi-button primary
                    label="Conferma" :loading="isRenewing" @click="onRenew"/>
      </csi-buttons>


    </template>


    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>


<script>
    import {
        getCertificateList,
        getExemptionDetail,
        getTipologiaDocumenti,
        renewExemption
    } from "@services/api/pathology-exemption";
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import {required} from "vuelidate/lib/validators";
    import {toBase64} from "@services/global/files";
    import {scrollToElement} from "@services/global/utils";
    import CsiPathologyCertificateListItem from "components/pathology-exemption/CsiPathologyCertificateListItem";
    import CsiPolicy from "components/global/common/CsiPolicy";
    import {createExemption} from "@services/api/pathology-exemption";

    export default {
        name: 'PageExemptionRenew',
        components: {CsiPageTitle, CsiPolicy, CsiPathologyCertificateListItem},
        props: {},
        data() {
            return {
                isDocumentAdded: false,
                documentTypeSelected: 'DIGITALE',
                documentTypologySelected: [],
                certificatiValidiSelected: [],
                acceptTerms: false,
                iscritto: false,
                acconsento: false,
                isLoading: false,
                isRenewing: false,
                exemptionId: null,
                exemption: null,
                document: null,
                documentStartDate: new Date().toISOString(),
                documentEndDate: null,
                notes: '',
                certificati: [],
                certificatiPapabili: [],
                today: null,
                certificateSelected: false,
                payload: null,
                certificato_id: null,
                data_rilascio: null,
                data_fine_validita: null,
                selectedCertificate: null,

                documentTypeOptions:
                    [{
                        value: 'CARTACEO',
                        label: 'Cartaceo'
                    },
                        {
                            value: 'DIGITALE',
                            label: 'Digitale'
                        }]
            }
        },
        computed: {
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
            documentTypologyOptions() {
                return this.documentTypes.map(t => ({label: t.descrizione, value: t.codice}))
            },

            documentTypologyModel() {
                return this.documentTypes.find(t => (t.codice === this.documentTypologySelected))
            },
        },
        validations() {
            return {
                document: {required},
                documentStartDate: {required},
            }
        },
        async created() {
            this.isLoading = true
            this.today=new Date()
            let {id, exemption} = this.$route.params

            if (!exemption) {

                let response = await getExemptionDetail(this.cf, id)
                exemption = response.data

            }


            this.exemptionId = id
            let type = exemption.tipologia.codice
            let response = await getTipologiaDocumenti(type)
            this.documentTypes = response.data
            let responseCert = await getCertificateList(this.cf)
            this.certificati = responseCert.data

            for (let i = 0; i < this.certificati.length; i++) {

                if (this.certificati[i].utilizzabile && this.certificati[i].malattia.codice === exemption.malattia.codice) {
                    this.certificatiPapabili.push(this.certificati[i])
                }

            }

            this.exemption = exemption
            this.isLoading = false
        },
        methods: {
            async onDocumentsAdded(files) {
                this.isDocumentAdded = true
                let file = files[0]
                console.debug({addFile: file})

                try {
                    let base64 = await toBase64(file)
                    file.__base64 = base64.replace("data:application/pdf;base64,", "")
                    this.document = file

                } catch (e) {
                    console.error('Si è verificato un errore nella lettura del file caricato')
                    console.error(e)
                }
            },
            onDocumentRemoved(file) {
                this.isDocumentAdded = false
                console.debug({removeFile: file})
                this.document = null
            },

            async onCertificateSelected(certificate) {
                this.certificateSelected=true
                this.selectedCertificate=certificate
                console.log(this.selectedCertificate)
                certificate.malattia.giorni_validita = 1

                    this.certificato_id= certificate.id
                    this.data_rilascio= certificate.data_inserimento
                    this.data_fine_validita= certificate.data_scadenza
                    //note: this.notes







                // certificate.malattia.giorni_validita = 1
                // this.acceptTerms = this.iscritto && this.acconsento
                //
                // if (this.exemption.tipologia.codice !== this.$config.pathologyExemption.typology.Malattie_rare) {
                //     this.acceptTerms = this.acconsento
                //
                // }
                // if (this.acceptTerms === false) {
                //     this.$q.notify('Dichiara di aver letto e di accettare le condizioni di trattamento dati');
                //
                //     return
                // }
                //
                // let payload = {
                //     certificato_id: certificate.id,
                //     data_rilascio: certificate.data_inserimento,
                //     data_fine_validita: certificate.data_scadenza,
                //     note: this.notes
                //
                // }
                //
                //
                // let response = await renewExemption(this.cf, this.exemptionId, payload)
                //
                // let newExemption = response.data
                //
                // let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_RENEW_SUCCESS.name
                // let params = {id: this.exemptionId, exemption: newExemption}
                // this.$router.push({name, params})
            },

            async onRenew() {

                this.acceptTerms = this.iscritto && this.acconsento

                if (this.exemption.tipologia.codice !== this.$config.pathologyExemption.typology.Malattie_rare) {
                    this.acceptTerms = this.acconsento

                }
                if (this.acceptTerms === false) {
                    this.$q.notify('Dichiara di aver letto e di accettare le condizioni di trattamento dati');

                    return
                }
                let payload = null
                if(this.certificateSelected) {
                    payload = {
                        certificato_id: this.certificato_id,
                        data_rilascio: this.data_rilascio,
                        data_fine_validita: this.data_fine_validita,
                        note: this.notes
                    }

                }else {

                    if (this.documentTypeSelected !== 'CARTACEO' && this.documentTypeSelected !== 'DIGITALE') {
                        this.$q.notify('Scegli se caricare un documento digitale');
                        return
                    }
                    if (this.documentTypeSelected === 'DIGITALE' && this.isDocumentAdded === false) {
                        this.$q.notify('Carica un documento valido');
                        return
                    }
                    if (this.documentTypeSelected === 'DIGITALE' && !this.documentTypologyModel) {
                        this.$q.notify('Seleziona un tipo di documento');
                        return
                    }

                    if (this.documentTypeSelected !== 'CARTACEO') {
                        payload = {
                            file_base64: this.document.__base64,
                            data_rilascio: this.documentStartDate,
                            data_fine_validita: this.documentEndDate,
                            note: this.notes,
                            tipologia_documento: this.documentTypologyModel
                            //zip: true

                        }
                    } else {
                        payload = {
                            note: this.notes
                            //zip: false
                        }
                    }
                }

                console.log(payload)

                    this.isRenewing = true
                    let response = await renewExemption(this.cf, this.exemptionId, payload)
                    let newExemption = response.data
                    this.isRenewing = false

                    let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_RENEW_SUCCESS.name
                    let params = {id: this.exemptionId, exemption: newExemption}
                    this.$router.push({name, params})

            },
        },
    }
</script>


<style scoped lang="stylus"></style>
