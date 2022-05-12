<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <template v-if="exemption && !isLoadingExemption">
      <q-page padding>


        <csi-stepper
          style="max-width: 100%"
          ref="stepper"
          contractable
          alternative-labels
          class="csi-stepper-pa-md"
          @step="onStepChange">

          <!-- STEP SELEZIONE TIPOLOGIA -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
<!--          <q-step title="Tipologia" :name="steps.exemptionType">-->

<!--            <div v-if="!isLoading">-->
<!--              <h3 class="csi-h3 q-mb-md">-->
<!--                Che tipo di esenzione vuoi richiedere?-->
<!--              </h3>-->

<!--              <q-card>-->
<!--                <q-card-main>-->
<!--                  <div>-->
<!--                    <p>-->
<!--                      Scegli il tipo di esenzione per cui richiedere l'esenzione.-->
<!--                      Per il rilascio dell'esenzione per patologia deve essere allegato:-->
<!--                    </p>-->

<!--                    <ul>-->
<!--                      <li>Certificato medico telematico;</li>-->
<!--                      <li>Certificato medico digitale.</li>-->
<!--                    </ul>-->

<!--                    <p>-->
<!--                      In caso di certificato cartaceo è necessario recarsi allo sportello l’ASL/ASR per fornire la copia-->
<!--                      originale-->
<!--                      dei certificati e richiedere l’esenzione.-->
<!--                    </p>-->
<!--                  </div>-->

<!--                  <q-field required class="q-my-lg">-->
<!--                    <q-select-->
<!--                      v-model="exemptionTypeSelected"-->
<!--                      :options="exemptionTypeOptions"-->
<!--                      float-label="Tipo esenzione"-->
<!--                    />-->
<!--                  </q-field>-->

<!--                  <q-field v-if="exemptionTypeSelected===invalidita"-->
<!--                           required-->
<!--                           ref="fieldInv"-->
<!--                           :error="$v.gStepExemptionType.disabilityTypeSelected.$error">-->


<!--                    <q-select-->
<!--                      v-model="disabilityTypeSelected"-->
<!--                      :options="disabilityTypeOptions"-->
<!--                      float-label="Tipologia invalidità"-->
<!--                      filter-->
<!--                      autofocus-filter-->
<!--                      filter-placeholder="Cerca tra le esenzioni"-->
<!--                      clearable-->
<!--                    />-->

<!--                    <template slot="error-label">-->
<!--                      <div v-if="!$v.gStepExemptionType.disabilityTypeSelected.required">-->
<!--                        Campo obbligatorio-->
<!--                      </div>-->
<!--                    </template>-->
<!--                  </q-field>-->


<!--                  <div class="q-mt-lg">-->
<!--                    <p>-->
<!--                      È necessario recarsi allo sportello ASL per i seguenti tipi di esenzioni:-->
<!--                    </p>-->

<!--                    <ul>-->
<!--                      <li>Legge 210</li>-->
<!--                      <li>Detenuti</li>-->
<!--                      <li>Naviganti</li>-->
<!--                      <li>Extracomunitari</li>-->
<!--                    </ul>-->
<!--                  </div>-->
<!--                </q-card-main>-->
<!--              </q-card>-->


<!--              <csi-buttons class="q-mt-lg">-->
<!--                <csi-button primary label="Avanti" @click="onStepExemptionTypeNext()"/>-->
<!--                <csi-button secondary label="Indietro" @click="$router.push($routes.PATHOLOGY_EXEMPTION.HOME)"/>-->
<!--              </csi-buttons>-->
<!--            </div>-->
<!--            <csi-inner-loading :visible="isLoading" block/>-->
<!--          </q-step>-->

          <!-- STEP SELEZIONE MALATTIA -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
<!--          <q-step title="Patologia" :name="steps.exemptionDisease">-->

<!--            <h3 class="csi-h3">Seleziona la patologia</h3>-->

<!--            <q-card class="q-mt-md">-->
<!--              <q-card-main>-->

<!--                <q-field-->
<!--                  required-->
<!--                  ref="fieldExemptionDisease"-->
<!--                  :error="$v.gStepExemptionDisease.exemptionDiseaseSelected.$error">-->
<!--                  <q-select-->
<!--                    v-model="exemptionDiseaseSelected"-->
<!--                    :options="exemptionDiseaseOptions"-->
<!--                    float-label="Diagnosi "-->
<!--                    filter-->
<!--                    autofocus-filter-->
<!--                    filter-placeholder="Cerca tra le patologie"-->
<!--                    clearable-->
<!--                  />-->


<!--                  <template slot="error-label">-->
<!--                    <div v-if="!$v.gStepExemptionDisease.exemptionDiseaseSelected.required">-->
<!--                      Campo obbligatorio-->
<!--                    </div>-->

<!--                  </template>-->
<!--                </q-field>-->

<!--                <q-field-->
<!--                  required-->
<!--                  ref="fieldExemption"-->
<!--                  :error="$v.gStepExemptionDisease.exemptionsSelected.$error">-->


<!--                  <q-select-->
<!--                    v-model="exemptionsSelected"-->
<!--                    :options="exemptionsOptions"-->
<!--                    float-label="Esenzione"-->
<!--                    filter-->
<!--                    autofocus-filter-->
<!--                    filter-placeholder="Cerca tra le esenzioni"-->
<!--                    clearable-->
<!--                  />-->

<!--                  <template slot="error-label">-->
<!--                    <div v-if="!$v.gStepExemptionDisease.exemptionsSelected.required">-->
<!--                      Campo obbligatorio-->
<!--                    </div>-->
<!--                  </template>-->
<!--                </q-field>-->


<!--              </q-card-main>-->
<!--            </q-card>-->


<!--            <csi-buttons class="q-mt-lg">-->
<!--              <csi-button primary label="Avanti" @click="onStepExemptionDiseaseNext"/>-->
<!--              <csi-button secondary label="Indietro" @click="$refs.stepper.previous()"/>-->
<!--            </csi-buttons>-->
<!--          </q-step>-->

          <!-- STEP UPLOAD DOCUMENTI -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <q-step ref="stepUpload" title="Documenti" :name="steps.upload" style="max-width: 100%">

            <h3 class="csi-h3">Inserisci il documento per richiedere la rettifica all'esenzione</h3>


            <q-card class="q-mt-md">
              <q-card-main>
                <div v-if="documentTypeSelected==='DIGITALE'">
                  <q-field>
                    <q-select

                      v-model="documentTypologySelected"
                      :options="documentTypologyOptions"
                      float-label="Tipologia di documento da allegare"
                      filter
                      autofocus-filter
                      filter-placeholder="Cerca tra le tipologie di documento"
                    >
                    </q-select>
                  </q-field>
                  <div class="row items-center gutter-sm">
                    <div class="col-12">
                      <q-field required :error="$v.gStepUpload.document.$error">
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

                        <template slot="error-label">
                          <div v-if="!$v.gStepUpload.document.required">
                            Campo obbligatorio
                          </div>
                        </template>
                      </q-field>
                    </div>


                    <div class="col-12 col-sm">


                      <q-field required :error="$v.gStepUpload.documentStartDate.$error">

                        <q-datetime
                          type="date"
                          float-label="Data rilascio documentazione"
                          v-model="documentStartDate"
                          format="DD MMM YYYY"
                        />

                        <template slot="error-label">
                          <div v-if="!$v.gStepUpload.documentStartDate.required">
                            Campo obbligatorio
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div class="col-12 col-sm">
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
                </div>
              </q-card-main>
            </q-card>


            <csi-buttons class="q-mt-lg">
              <csi-button
                v-if=" isDocumentAdded===true && documentStartDate && documentTypologySelected"
                primary label="Avanti" @click="onStepUploadNext"/>
              <csi-button secondary label="Indietro" @click="goToHome"/>
            </csi-buttons>
          </q-step>

          <!-- STEP RIEPILOGO -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <q-step title="Riepilogo" :name="steps.summary"  style="max-width: 100%">

            <h3 class="csi-h3">Riepilogo</h3>

            <!-- Riepilogo tipologia esenzione -->
            <q-card class="q-mt-md">

<!--              <q-btn-->
<!--                flat-->
<!--                round-->
<!--                dense-->
<!--                icon="edit"-->
<!--                class="float-right q-ma-xs"-->
<!--                @click="$refs.stepper.goToStep(steps.exemptionType)"-->
<!--              />-->

              <q-card-main>
                <div class="row gutter-sm">
                  <div class="col-12">
                    <div class="q-body-2">Tipo esenzione</div>
                    <div class="q-body-1">
                      {{exemption ? exemption.tipologia.descrizione : '-'}}
                    </div>
                  </div>
                </div>
              </q-card-main>
            </q-card>

            <!-- Riepilogo patologia -->
            <q-card class="q-mt-md">
<!--              <q-btn-->
<!--                flat-->
<!--                round-->
<!--                dense-->
<!--                icon="edit"-->
<!--                class="float-right q-ma-xs"-->
<!--                @click="$refs.stepper.goToStep(steps.exemptionDisease)"-->
<!--              />-->

              <q-card-main>
                <div class="row gutter-sm">
                  <div class="col-12 col-sm-6">
                    <div class="q-body-2">Patologia</div>
                    <div class="q-body-1">
                      {{exemption ? exemption.malattia.descrizione : '-'}}
                    </div>
                  </div>

                  <div class="col-12 col-sm-6">
                    <div class="q-body-2">Codice esenzione</div>
                    <div class="q-body-1">
                      {{exemption ? exemption.codice.codice : '-'}}
                    </div>
                  </div>

                  <div
                    v-if="exemptionDiseaseSelected && exemptionDiseaseSelected.prestazioni && exemptionDiseaseSelected.prestazioni.length"
                    class="col-12 col-sm-6">
                    <div class="q-body-2">Prestazioni esenti</div>
                    <q-list no-border dense class="no-padding">
                      <q-item
                        v-for="performance in exemptionDiseaseSelected.prestazioni"
                        :key="performance.codice"
                        class="no-padding">
<!--                        <q-item-side class="q-body-1">{{performance.codice}}</q-item-side>-->
                        <q-item-main class="q-body-1">{{performance.descrizione}}</q-item-main>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-card-main>
            </q-card>

            <!-- Riepilogo documentazione -->
            <q-card class="q-mt-md">
<!--              <q-btn-->
<!--                flat-->
<!--                round-->
<!--                dense-->
<!--                icon="edit"-->
<!--                class="float-right q-ma-xs"-->
<!--                @click="$refs.stepper.goToStep(steps.upload)"-->
<!--              />-->

              <q-card-main>
                <div class="row gutter-sm">
                  <div class="col-12">
                    <div class="q-body-2">Documentazione allegata</div>
                    <div v-if="this.documentTypeSelected==='DIGITALE'" class="q-body-1">{{document ? document.name :
                      '-'}}
                    </div>
                  </div>

                  <div v-if="documentTypeSelected==='DIGITALE'" class="col-12 col-sm-6">
                    <div class="q-body-2">Data rilascio documentazione</div>
                    <div class="q-body-1">{{documentStartDate | format}}</div>
                  </div>

                  <div v-if="documentEndDate" class="col-12 col-sm-6">
                    <div class="q-body-2">Data fine validità documentazione</div>
                    <div class="q-body-1">{{documentEndDate | format}}</div>
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
            <q-card class="q-mt-md" v-if="exemptionTypeSelected===$config.pathologyExemption.typology.Malattie_rare">
              <!--disclaimer -->
              <div class="q-pa-md">
                <div class="csi-h5 q-mb-md">
                  Informazioni sul trattamento dei dati personali per Malattie Rare
                </div>

                <template>
                  <csi-policy class="q-pt-md">
                    <template slot="text">
                      <div v-html="disclaimerMalattieRare"></div>

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
                      <div v-html="disclaimer"></div>

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
              <csi-button primary label="Conferma" :loading="isCreatingExemption" @click="onSave"/>
              <csi-button secondary label="Indietro" @click="indietro"/>
            </csi-buttons>
          </q-step>
        </csi-stepper>
      </q-page>
    </template>

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoadingExemption"/>
  </q-page>
</template>


<script>
    import {
        createExemption,
        getExemptionDetail,
        getExemptionTypeDiseases,
        getExemptionTypes,
        getExemptions,
        getTipologiaDocumenti,
        editExemption, getDisabilityType, getDisclaimerDati, getDisclaimerMalattieRare


    } from "@services/api/pathology-exemption";
    import {scrollToElement} from "@services/global/utils";
    import {toBase64} from "@services/global/files";
    import {required} from "vuelidate/lib/validators";
    import CsiPolicy from "components/global/common/CsiPolicy";

    export default {
        name: 'PageExemptionCorrection',
        components: {CsiPolicy},
        props: {},
        data() {
            return {
                invalidita: this.$config.pathologyExemption.typology.Invalidita,
                isDocumentAdded: false,
                isLoading: false,
                isLoadingExemption: false,
                isCreatingExemption: false,
                exemptionId: null,
                exemption: null,
                steps: {
                    // certificateList: 'CERTIFICATE_LIST',
                    // exemptionType: 'EXEMPTION_TYPE',
                    // exemptionDisease: 'EXEMPTION_DISEASE',
                    // upload: 'UPLOAD',
                    summary: 'SUMMARY',
                },
                exemptionTypes: [],
                exemptionsSelected: null,
                exemptionTypeSelected: null,
                disabilityTypeSelected: null,
                disabilityTypes: [],
                exemptions: [],
                exemptionDiseases: [],
                exemptionDiseaseSelected: null,
                documentTypes: [],
                documentTypologySelected: null,
                document: null,
                documentStartDate: new Date().toISOString(),
                documentEndDate: null,
                notes: '',
                disclaimer: null,
                disclaimerMalattieRare: null,
                iscritto: false,
                acconsento: false,
                acceptTerms: false,
                documentTypeSelected: 'DIGITALE',
                today: null,
                documentTypeOptions:
                    [{
                        value: 'CARTACEO',
                        label: 'Cartaceo'
                    },
                        {
                            value: 'DIGITALE',
                            label: 'Digitale'
                        }],


                isModalOpen: false,
                isRequired: null,
                isDocumentTypeSelectedDigitale: false,
                isLoadingCertificates: false,
                isCreatingExemptionByCertificate: false,
                certificateList: [],
                newExemption: null,
                responseType: [],
                responseDisease: [],
                exemptionsToFind: [],
                diseasesToFind: [],
                diseasesToFindForExeptions: null,
                exemptionDiseasesToAdd: [],
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
                exemptionDiseaseSelected: {required},
                disabilityTypeSelected: {required},
                exemptionsSelected: {required},
                document: {required},
                documentStartDate: {required},
                // Gruppi di validazione in base agli steps
                gStepExemptionDisease: ['exemptionDiseaseSelected', 'exemptionsSelected'],
                gStepExemptionType: ['disabilityTypeSelected'],
                gStepUpload: ['document', 'documentStartDate',],
            }
        },
        async created() {
            this.today= new Date()
            let {id, exemption} = this.$route.params
            this.exemptionId = id

            if (!exemption) {
                this.isLoadingExemption = true
                let response = await getExemptionDetail(this.cf, id)
                exemption = response.data
                this.isLoadingExemption = false
            }
            this.exemption = exemption
            console.log( this.exemption)
            //per evitare di fare ogni step

            this.exemptionTypeSelected = this.exemption.tipologia
            if(this.exemption.tipologia_invalidita){
                this.disabilityTypeSelected=this.exemption.tipologia_invalidita
            }

            this.exemptionsSelected = this.exemption.codice

            this.exemptionDiseaseSelected = this.exemption.malattia
            let response = await getTipologiaDocumenti(this.exemptionTypeSelected.codice)
            this.documentTypes = response.data

            let disclaimer = await getDisclaimerDati()
            this.disclaimer = disclaimer.data

            let responseMalattieRare = await getDisclaimerMalattieRare()
            this.disclaimerMalattieRare = responseMalattieRare.data




        },
        methods: {
            indietro() {
                this.isDocumentAdded = false
                this.document=null
                this.$refs.stepper.previous()
            },
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

            onStepUploadNext() {


                this.$refs.stepper.next()
            },
            onStepChange(stepName) {
                console.debug({stepName})
                if (stepName === this.steps.exemptionType) return this.onStepExemptionType()
                else if (stepName === this.steps.exemptionDisease) return this.onStepExemptionDisease()
                else if (stepName === this.steps.upload) return this.onStepUpload()
            },
            async onStepExemptionType() {
                this.isLoading = true
                this.disabilityTypeSelected = null


                if(this.exemption.tipologia_invalidita){
                    this.disabilityTypeSelected=this.exemption.tipologia_invalidita.codice
                }


                let responseTypeDisability = await getDisabilityType()
                this.disabilityTypes = responseTypeDisability.data

                let response = await getExemptionTypes(this.cf)
                this.exemptionTypes = response.data
                //this.exemptionTypeSelected = this.exemptionTypes[0].codice

                this.exemptionTypeSelected = this.exemption.tipologia.codice

                this.isLoading = false
            },
            async onStepExemptionDisease() {
                this.isLoading = true


                //this.exemptionsSelected = null
                this.exemptionsSelected = this.exemption.codice.codice



                //this.exemptionDiseaseSelected = null
                this.exemptionDiseaseSelected = this.exemption.malattia.codice


                let response = await getExemptionTypeDiseases(this.cf, this.exemptionTypeSelected)
                let responseExemptions = await getExemptions(this.cf, this.exemptionTypeSelected)

                this.exemptionDiseases = response.data
                this.exemptions = responseExemptions.data


                if (this.exemptionTypeSelected === this.invalidita) {
                    this.exemptions = this.exemptions.filter(s => s.tipologia_aura === this.disabilityTypeSelected)

                    let exemptionDiseasesToAdd = []
                    for (let i = 0; i < this.exemptions.length; i++) {
                        if (this.exemptionDiseases.filter(t => t.codice_esenzione === this.exemptions[i].codice)) {

                            Array.prototype.push.apply(exemptionDiseasesToAdd, this.exemptionDiseases.filter(t => t.codice_esenzione === this.exemptions[i].codice));
                        }
                    }
                    this.exemptionDiseases = exemptionDiseasesToAdd
                }
                this.isLoading = false
            },
            async onStepUpload() {
                this.isDocumentAdded = false
            },
            async onSave() {

                this.acceptTerms = this.iscritto && this.acconsento
                //if (this.exemptionTypeSelectedModel.codice !== this.$config.pathologyExemption.typology.Malattie_rare)
                if (this.exemptionTypeSelected !== this.$config.pathologyExemption.typology.Malattie_rare)
                    this.acceptTerms = this.acconsento
                if (this.acceptTerms === false) {
                    this.$q.notify('Dichiara di aver letto e di accettare le condizioni di trattamento dati');
                    return
                }

                let payload = null;
                if (this.documentTypeSelected === 'DIGITALE') {

                    //if (this.exemptionTypeSelectedModel.codice === this.invalidita) {
                    if (this.exemptionTypeSelected.codice === this.invalidita) {
                        payload = {
                            file_base64: this.document.__base64,
                            data_rilascio: this.documentStartDate,
                            //tipologia: this.exemptionTypeSelectedModel,
                            tipologia: this.exemptionTypeSelected,
                            malattia: this.exemptionDiseaseSelected,
                            tipologia_documento: this.documentTypologyModel,
                            note: this.notes,
                            tipologia_invalidita: this.disabilityTypeSelected
                        }
                    } else {
                        payload = {
                            file_base64: this.document.__base64,
                            data_rilascio: this.documentStartDate,
                            tipologia: this.exemptionTypeSelected,
                            malattia: this.exemptionDiseaseSelected,
                            tipologia_documento: this.documentTypologyModel,
                            note: this.notes,
                        }
                    }
                }

                if (this.documentEndDate) payload.data_fine_validita = this.documentEndDate


                this.isCreatingExemption = true


                console.log(payload)

                try {
                    let response = await editExemption(this.cf, this.exemptionId, payload)
                    this.goToFeedback(response.data)
                }catch(e){
                    this.$q.notify('Non è stato possibile correggere l esenzione. Solo il file allegato può variare');
                }
                this.isCreatingExemption = false

            },
            goToFeedback(exemption) {
                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_CORRECTION_SUCCESS.name
                let params = {id: exemption.id, exemption}
                this.$router.push({name, params})
            },
            goToHome() {
                this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.HOME)
            }
        },
    }
</script>


<style scoped lang="stylus"></style>
