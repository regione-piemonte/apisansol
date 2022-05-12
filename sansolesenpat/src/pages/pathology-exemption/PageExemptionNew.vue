<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <csi-page-title class="q-mb-md" title="Nuova esenzione"></csi-page-title>

    <csi-stepper
      ref="stepper"
      contractable
      alternative-labels
      class="csi-stepper-pa-md"
      @step="onStepChange">

      <!-- STEP CERTIFICATI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step title="Certificati" :name="steps.certificateList" default>

        <q-alert color="info" v-if="certificateListUsable.length>0" class="csi-h3 q-mb-md">
          Puoi selezionare uno dei seguenti certificati per richiedere un esenzione per Malattia Rara o per Malattia
          Cronica. In alternativa puoi selezionare "Avanti" per richiedere manualmente un'esenzione.
          Per richiedere un esenzione per invalidità è necessario recarsi ad uno sportello
        </q-alert>

        <q-alert color="info" v-if="!isLoading && certificateListUsable.length===0" class="q-mb-md">
          <p>Non risultano a sistema certificati medici di specialisti da utilizzare per effettuare la richiesta. </p>
         <p>Puoi procedere con la richiesta caricando la documentazione in tuo possesso e poi dovrai eventualmente
          recarti allo sportello della tua ASL di competenza per fornire la documentazione originale</p>
        </q-alert>


        <div v-if="!isLoading" class="relative-position">

          <div class="row items-center gutter-sm">
            <div
              v-if="certificateListUsable.length>0"
              v-for="certificate in certificateListUsable"
              :key="certificate.id"
              class="col-12">
              <csi-pathology-certificate-list-item :certificate="certificate">
                <template slot="actions">
                  <csi-buttons class="q-pa-sm">
                    <csi-button
                      primary
                      label="Seleziona" @click="onCertificateSelected(certificate)"
                      :loading="isCreatingExemptionByCertificate && isCreatingExemptionByCertificate === certificate.id"
                      :disable="isCreatingExemptionByCertificate && isCreatingExemptionByCertificate !== certificate.id"
                    />
                  </csi-buttons>
                </template>
              </csi-pathology-certificate-list-item>
            </div>
          </div>

          <!-- loading -->


          <csi-buttons class="q-mt-lg">
            <csi-button
              primary
              label="Avanti"
              :disable="!!isCreatingExemptionByCertificate"
              @click="$refs.stepper.next()"
            />
          </csi-buttons>
        </div>
        <csi-inner-loading :visible="isLoadingCertificates" block/>
      </q-step>

      <!-- STEP SELEZIONE TIPOLOGIA -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step title="Tipologia" :name="steps.exemptionType">

        <div v-if="!isLoading">
          <h3 class="csi-h3 q-mb-md">
            Che tipo di esenzione vuoi richiedere?
          </h3>

          <q-card>
            <q-card-main>
              <div>
                <p>
                  Scegli il tipo di esenzione per cui richiedere l'esenzione.
                  Per il rilascio dell'esenzione per patologia deve essere allegato:
                </p>

                <ul>
                  <li>Certificato medico telematico;</li>
                  <li>Certificato medico digitale.</li>
                </ul>

                <p>
                  In caso di certificato cartaceo è necessario recarsi allo sportello l’ASL/ASR per fornire la copia
                  originale
                  dei certificati e richiedere l’esenzione.
                </p>
              </div>

              <q-field required class="q-my-lg">
                <q-select
                  v-model="exemptionTypeSelected"
                  :options="exemptionTypeOptions"
                  float-label="Tipo esenzione"
                />
              </q-field>

              <q-field v-if="exemptionTypeSelected===invalidita"
                       required
                       ref="fieldInv"
                       :error="$v.gStepExemptionType.disabilityTypeSelected.$error">


                <q-select
                  v-model="disabilityTypeSelected"
                  :options="disabilityTypeOptions"
                  float-label="Tipologia invalidità"
                  filter
                  autofocus-filter
                  filter-placeholder="Cerca tra le esenzioni"
                  clearable
                />

                <template slot="error-label">
                  <div v-if="!$v.gStepExemptionType.disabilityTypeSelected.required">
                    Campo obbligatorio
                  </div>
                </template>
              </q-field>


              <div class="q-mt-lg">
                <p>
                  È necessario recarsi allo sportello ASL per i seguenti tipi di esenzioni:
                </p>

                <ul>
                  <li>Legge 210</li>
                  <li>Detenuti</li>
                  <li>Naviganti</li>
                  <li>Extracomunitari</li>
                </ul>
              </div>
            </q-card-main>
          </q-card>


          <csi-buttons class="q-mt-lg">
            <csi-button primary label="Avanti" @click="onStepExemptionTypeNext()"/>
            <csi-button secondary label="Indietro" @click="$refs.stepper.previous()"/>
          </csi-buttons>
        </div>
        <csi-inner-loading :visible="isLoading" block/>
      </q-step>

      <!-- STEP SELEZIONE MALATTIA -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step title="Patologia" :name="steps.exemptionDisease">

        <h3 class="csi-h3">Seleziona la patologia</h3>

        <q-card class="q-mt-md">
          <q-card-main>

            <q-field
              required
              ref="fieldExemptionDisease"
              :error="$v.gStepExemptionDisease.exemptionDiseaseSelected.$error">
              <q-select
                v-model="exemptionDiseaseSelected"
                :options="exemptionDiseaseOptions"
                float-label="Diagnosi "
                filter
                autofocus-filter
                filter-placeholder="Cerca tra le patologie"
                clearable
              />


              <template slot="error-label">
                <div v-if="!$v.gStepExemptionDisease.exemptionDiseaseSelected.required">
                  Campo obbligatorio
                </div>

              </template>
            </q-field>

            <q-field
              required
              ref="fieldExemption"
              :error="$v.gStepExemptionDisease.exemptionsSelected.$error">


              <q-select
                v-model="exemptionsSelected"
                :options="exemptionsOptions"
                float-label="Esenzione"
                filter
                autofocus-filter
                filter-placeholder="Cerca tra le esenzioni"
                clearable
              />

              <template slot="error-label">
                <div v-if="!$v.gStepExemptionDisease.exemptionsSelected.required">
                  Campo obbligatorio
                </div>
              </template>
            </q-field>


          </q-card-main>
        </q-card>


        <csi-buttons class="q-mt-lg">
          <csi-button primary label="Avanti" @click="onStepExemptionDiseaseNext"/>
          <csi-button secondary label="Indietro" @click="$refs.stepper.previous()"/>
        </csi-buttons>
      </q-step>

      <!-- STEP UPLOAD DOCUMENTI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step ref="stepUpload" title="Documenti" :name="steps.upload" style="max-width: 100%">

        <h3 class="csi-h3">Di quale documento disponi per richiedere l’esenzione?</h3>

        <q-card class="q-mt-md">
          <q-card-main>
            <q-field>

              <q-select

                v-model="documentTypeSelected"
                :options="documentTypeOptions"
                float-label="Documento cartaceo o digitale"
                filter
                autofocus-filter
                filter-placeholder="Cartaceo o digitale"
              >
              </q-select>
            </q-field>
            <div v-if="documentTypeSelected==='DIGITALE'">
              <div class="row items-center gutter-sm">
                <div class="col-12">
                  <q-field>
                    <q-uploader
                      ref="uploader"
                      float-label="Documentazione da allegare"
                      url=""
                      extensions=".pdf"
                      clearable
                      hide-upload-button
                      hide-upload-progress
                      auto-expand
                      class="csi-uploader"
                      @add="onDocumentsAdded"
                      @remove:cancel="onDocumentRemoved"
                    />

                    <template slot="error-label">

                    </template>
                  </q-field>
                </div>
                <div class="col-12">
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
                </div>
                <div class="col-12 col-sm">
                  <q-field>
                    <q-datetime
                      type="date"
                      float-label="Data rilascio documentazione"
                      v-model="documentStartDate"
                      format="DD MMM YYYY"
                    />

                    <template slot="error-label">

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
                      clearable
                      :min="today"
                    />
                  </q-field>
                </div>
              </div>
              <div @click="openModal" class="q-pt-md q-body-1 text-italic text-blue cursor-pointer">Quali documenti
                posso allegare?
              </div>
            </div>
          </q-card-main>
        </q-card>


        <q-modal v-model="isModalOpen" :content-css="{maxWidth: '800px'}">
          <q-modal-layout class="bg-grey-2">

            <q-toolbar slot="header">
              <q-toolbar-title>
                Quali documenti posso allegare
              </q-toolbar-title>
              <q-btn flat round icon="close" v-close-overlay></q-btn>
            </q-toolbar>

            <div class="q-pa-md">
              <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <csi-policy>
                  <template slot="text">
                    <div>


                      Per il rilascio dell’attestato di esenzione, deve essere allegato uno dei seguenti documenti:

                      • certificazione rilasciata da specialisti di struttura sanitaria pubblica o di istituti ed enti
                      di cui all’art. 4, comma 2, del decreto legislativo n. 502/92 o da istituzioni sanitarie pubbliche
                      di paesi appartenenti all’Unione Europea;

                      • cartella clinica rilasciata dalle strutture sanitarie di cui al punto precedente;

                      • cartella clinica rilasciata dalle Case di Cura private accreditate, previa valutazione del
                      Medico del Distretto;

                      • verbale di invalidità contenente la diagnosi rilasciato dalla Commissione di Invalidità,
                      corredato da eventuale documentazione sanitaria;

                      • documentazione rilasciata dal centro della “Rete Interregionale per le Malattie Rare”

                    </div>
                  </template>
                </csi-policy>
              </transition>
            </div>
          </q-modal-layout>
        </q-modal>

        <csi-buttons class="q-mt-lg">
          <csi-button
            v-if="documentTypeSelected==='CARTACEO' || isDocumentAdded===true && documentStartDate && documentTypologySelected"
            primary
            label="Avanti" @click="onStepUploadNext"/>
          <csi-button secondary label="Indietro" @click="$refs.stepper.previous()"/>
        </csi-buttons>
      </q-step>

      <!-- STEP RIEPILOGO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step title="Riepilogo" :name="steps.summary">

        <h3 class="csi-h3">Riepilogo</h3>

        <!-- Riepilogo tipologia esenzione -->
        <q-card class="q-mt-md">

          <q-btn
            flat
            round
            dense
            icon="edit"
            class="float-right q-ma-xs"
            @click="$refs.stepper.goToStep(steps.exemptionType)"
          />

          <q-card-main>
            <div class="row gutter-sm">
              <div class="col-12">
                <div class="q-body-2">Tipo esenzione</div>
                <div class="q-body-1">
                  {{exemptionTypeSelectedModel ? exemptionTypeSelectedModel.descrizione : '-'}}
                </div>
              </div>
            </div>
          </q-card-main>
        </q-card>

        <!-- Riepilogo patologia -->
        <q-card class="q-mt-md">
          <q-btn
            flat
            round
            dense
            icon="edit"
            class="float-right q-ma-xs"
            @click="$refs.stepper.goToStep(steps.exemptionDisease)"
          />

          <q-card-main>
            <div class="row gutter-sm">
              <div class="col-12 col-sm-6">
                <div class="q-body-2">Patologia</div>
                <div class="q-body-1">
                  {{exemptionDiseaseSelectedModel ? exemptionDiseaseSelectedModel.descrizione : '-'}}

                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="q-body-2">Codice esenzione</div>
                <div class="q-body-1">
                  {{exemptionsSelectedModel ? exemptionsSelectedModel.codice : '-'}}
                </div>
              </div>

              <div
                v-if="exemptionDiseaseSelectedModel && exemptionDiseaseSelectedModel.prestazioni && exemptionDiseaseSelectedModel.prestazioni.length"
                class="col-12 col-sm-6">
                <div class="q-body-2">Prestazioni esenti</div>
                <q-list no-border dense class="no-padding">
                  <q-item
                    v-for="performance in exemptionDiseaseSelectedModel.prestazioni"
                    :key="performance.codice"
                    class="no-padding">
<!--                    <q-item-side class="q-body-1">{{performance.codice}}</q-item-side>-->
                    <q-item-main class="q-body-1">{{performance.descrizione}}</q-item-main>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-main>
        </q-card>

        <!-- Riepilogo documentazione -->

        <q-card class="q-mt-md">
          <q-btn
            flat
            round
            dense
            class="float-right q-ma-xs"

          />

          <q-card-main>
            <div class="row gutter-sm">
              <div class="col-12">
                <div class="q-body-2">Documentazione allegata</div>
                <div v-if="this.documentTypeSelected==='CARTACEO'" class="q-body-1">Documentazione cartacea da
                  consegnare all'ASL di appartenenza
                </div>
                <div v-if="this.documentTypeSelected==='DIGITALE'" class="q-body-1">{{document ? document.name : '-'}}
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


<script>
    import {
        getDisclaimerMalattieRare,
        getDisclaimerDati,
        createExemption,
        getCertificateList,
        getExemptionTypeDiseases,
        getExemptionTypes, getTipologiaDocumenti, getDisabilityType, getExemptionDetail
    } from '@services/api/pathology-exemption'
    import CsiPolicy from 'components/global/common/CsiPolicy'
    import CsiPathologyCertificateListItem from 'components/pathology-exemption/CsiPathologyCertificateListItem'
    import {required} from 'vuelidate/lib/validators'
    import {scrollToElement} from '@services/global/utils'
    import {toBase64} from '@services/global/files'
    import CsiPageTitle from 'components/global/common/CsiPageTitle'
    import {getExemptions} from "@services/api/pathology-exemption";

    export default {
        name: 'PageExemptionNew',
        components: {CsiPageTitle, CsiPathologyCertificateListItem, CsiPolicy},
        props: {},
        data() {
            return {
                invalidita: this.$config.pathologyExemption.typology.Invalidita,
                iscritto: false,
                acconsento: false,
                isModalOpen: false,
                isRequired: null,
                isDocumentTypeSelectedDigitale: false,
                documentTypeSelected: 'CARTACEO',
                documentTypes: [],
                isLoading: false,
                isLoadingCertificates: false,
                isCreatingExemption: false,
                isCreatingExemptionByCertificate: false,
                disclaimer: null,
                disclaimerMalattieRare: null,
                steps: {
                    certificateList: 'CERTIFICATE_LIST',
                    exemptionType: 'EXEMPTION_TYPE',
                    exemptionDisease: 'EXEMPTION_DISEASE',
                    upload: 'UPLOAD',
                    summary: 'SUMMARY',
                },
                certificateList: [],
                exemptionTypes: [],
                exemptionTypeSelected: null,
                documentTypologySelected: null,
                exemptionDiseases: [],
                exemptionDiseaseSelected: null,
                disabilityTypeSelected: null,
                exemptionsSelected: null,
                document: null,
                documentStartDate: new Date().toISOString(),
                documentEndDate: null,
                notes: '',
                newExemption: null,
                isDocumentAdded: false,
                acceptTerms: false,
                responseType: [],
                responseDisease: [],
                exemptions: [],
                disabilityTypes: [],
                exemptionsToFind: [],
                diseasesToFind: [],
                diseasesToFindForExeptions: null,
                exemptionDiseasesToAdd: [],
                today: null,
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
        validations() {

            return {
                exemptionDiseaseSelected: {required},
                disabilityTypeSelected: {required},
                exemptionsSelected: {required},
                document: {required},
                documentStartDate: {required},
                // Gruppi di validazione in base agli steps
                gStepExemptionDisease: ['exemptionDiseaseSelected', 'exemptionsSelected'],
                gStepExemptionType: ['disabilityTypeSelected']


            }

        },
        computed: {
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
            certificateListUsable() {
                if (this.certificateList) {
                    return this.certificateList.filter(c => c.utilizzabile)
                }
                return []
            },
            exemptionTypeOptions() {
                return this.exemptionTypes.map(t => ({label: t.descrizione, value: t.codice}))
            },
            documentTypologyOptions() {
                return this.documentTypes.map(t => ({label: t.descrizione, value: t.codice}))
            },
            documentTypologyModel() {
                return this.documentTypes.find(t => (t.codice === this.documentTypologySelected))
            },

            exemptionTypeSelectedModel() {

                return this.exemptionTypes.find(t => t.codice === this.exemptionTypeSelected)
            },
            exemptionsOptions() {


                if (this.exemptionDiseaseSelected) {
                    this.diseasesToFindForExeptions = this.exemptionDiseases.find(s => s.codice === this.exemptionDiseaseSelected)

                    this.exemptionsToFind = this.exemptions.filter(s => s.codice === this.diseasesToFindForExeptions.codice_esenzione)

                    return this.exemptionsToFind.map(d => ({label: d.descrizione + ' ' + '(' +d.codice+')', value: d.codice}))
                }
                return this.exemptions.map(d => ({label: d.descrizione + ' ' + '('+ d.codice+')', value: d.codice}))

            },

            disabilityTypeOptions() {
                return this.disabilityTypes.map(d => ({label: d.descrizione, value: d.codice}))
            },

            exemptionDiseaseSelectedModel() {
                return this.exemptionDiseases.find(f => f.codice === this.exemptionDiseaseSelected)
            },

            disabilityTypeSelectedModel() {

                return this.disabilityTypes.find(f => f.codice === this.disabilityTypeSelected)
            },

            exemptionsSelectedModel() {

                return this.exemptions.find(d => d.codice === this.exemptionsSelected)
            },
            exemptionDiseaseOptions() {

                if (this.exemptionsSelected) {
                    this.diseasesToFind = this.exemptionDiseases.filter(t => t.codice_esenzione === this.exemptionsSelected)
                    return this.diseasesToFind.map(d => ({label: d.descrizione + ' ' + '('+d.codice+')', value: d.codice}))
                }
                for (let i = 0; i < this.exemptionDiseases.length; i++) {
                    if (this.exemptionDiseases[i].descrizione === '-')
                        this.exemptionDiseases[i].descrizione = ""
                }
                return this.exemptionDiseases.map(e => ({label: e.descrizione + ' ' + '('+ e.codice+')', value: e.codice}))
            },
        },
        async created() {
            this.isLoading = true
            this.today=new Date()
            this.isLoadingCertificates = true
            try {
                let response = await getCertificateList(this.cf)
                this.certificateList = response.data

                let disclaimer = await getDisclaimerDati()
                this.disclaimer = disclaimer.data

                let responseMalattieRare = await getDisclaimerMalattieRare()
                this.disclaimerMalattieRare = responseMalattieRare.data
            } catch (e) {
                console.error(e)
            }
            this.isLoadingCertificates = false
            this.isLoading = false

        },
        methods: {
            openModal() {
                this.isModalOpen = true

            },

            async onDocumentsAdded(files) {
                this.isDocumentAdded = true
                let file = files[0]


                console.debug({addFile: file})


                try {
                    let base64 = await toBase64(file)
                    console.log(base64)
                    file.__base64 = base64.replace("data:application/pdf;base64,", "")
                    console.log(file)
                    this.document = file

                } catch (e) {
                    console.error('Si è verificato un errore nella lettura del file caricato')
                    console.error(e)
                }

            },
            indietro() {
                this.isDocumentAdded = false
                this.$refs.stepper.previous()
            },
            onDocumentRemoved(file) {
                this.isDocumentAdded = false
                console.debug({removeFile: file})
                this.document = null
            },
            async onStepExemptionDiseaseNext() {

                let response = await getTipologiaDocumenti(this.exemptionTypeSelected)
                this.documentTypes = response.data
                this.$v.gStepExemptionDisease.$touch()
                if (this.$v.gStepExemptionDisease.$error) {
                    scrollToElement(this.$refs.fieldExemptionDisease.$el)
                    return
                }

                this.$refs.stepper.next()
            },
            onStepExemptionTypeNext() {
                this.$v.gStepExemptionType.$touch()
                if (this.$v.gStepExemptionType.$error && this.exemptionTypeSelected === this.invalidita) {
                    return
                }
                this.$refs.stepper.next()
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
                let responseTypeDisability = await getDisabilityType()
                this.disabilityTypes = responseTypeDisability.data

                let response = await getExemptionTypes(this.cf)
                this.exemptionTypes = response.data
                this.exemptionTypeSelected = this.exemptionTypes[0].codice
                this.isLoading = false
            },
            async onStepExemptionDisease() {
                this.isLoading = true
                this.exemptionsSelected = null
                this.exemptionDiseaseSelected = null


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
            async onCertificateSelected(certificate) {
                certificate.malattia.giorni_validita = 1
                if (certificate.tipologia_esenzione.codice === this.invalidita) {
                    let esenzionePromise = await getExemptionDetail(this.cf, certificate.esenzione_id)
                    let esenzione = esenzionePromise.data


                    let payload = {
                        certificato_id: certificate.id,
                        malattia: certificate.malattia,
                        tipologia: certificate.tipologia_esenzione,
                        data_rilascio: certificate.data_inserimento,
                        data_fine_validita: certificate.data_scadenza,
                        tipologia_invalidita: esenzione.tipologia_invalidita
                    }

                    this.isCreatingExemptionByCertificate = certificate.id
                    let response = await createExemption(this.cf, payload)

                    this.newExemption = response.data
                    this.isCreatingExemptionByCertificate = false
                    this.goToFeedback(response.data)
                } else {
                    let payload = {
                        certificato_id: certificate.id,
                        malattia: certificate.malattia,
                        tipologia: certificate.tipologia_esenzione,
                        data_rilascio: certificate.data_inserimento,
                        data_fine_validita: certificate.data_scadenza
                    }

                    this.isCreatingExemptionByCertificate = certificate.id


                    let response = await createExemption(this.cf, payload)

                    this.newExemption = response.data
                    this.isCreatingExemptionByCertificate = false
                    this.goToFeedback(response.data)
                }

            },
            async onSave() {


                this.acceptTerms = this.iscritto && this.acconsento
                if (this.exemptionTypeSelectedModel.codice !== this.$config.pathologyExemption.typology.Malattie_rare) {
                    this.acceptTerms = this.acconsento

                }
                if (this.acceptTerms === false) {
                    this.$q.notify('Dichiara di aver letto e di accettare le condizioni di trattamento dati')
                    return
                }

                let payload
                this.exemptionDiseaseSelectedModel.giorni_validita = 1
                if (this.documentTypeSelected === 'CARTACEO') {
                    if (this.exemptionTypeSelectedModel.codice === this.invalidita) {

                        payload = {
                            tipologia: this.exemptionTypeSelectedModel,
                            malattia: this.exemptionDiseaseSelectedModel,
                            note: this.notes,
                            tipologia_invalidita: this.disabilityTypeSelectedModel

                        }
                    } else {
                        payload = {
                            tipologia: this.exemptionTypeSelectedModel,
                            malattia: this.exemptionDiseaseSelectedModel,
                            note: this.notes,

                        }
                    }

                } else {

                    if (this.exemptionTypeSelectedModel.codice === this.invalidita) {
                        payload = {
                            file_base64: this.document.__base64,
                            data_rilascio: this.documentStartDate,
                            tipologia: this.exemptionTypeSelectedModel,
                            malattia: this.exemptionDiseaseSelectedModel,
                            note: this.notes,
                            data_fine_validita: this.documentEndDate,
                            tipologia_documento: this.documentTypologyModel,
                            tipologia_invalidita: this.disabilityTypeSelectedModel
                        }
                    } else {
                        payload = {
                            file_base64: this.document.__base64,
                            data_rilascio: this.documentStartDate,
                            tipologia: this.exemptionTypeSelectedModel,
                            malattia: this.exemptionDiseaseSelectedModel,
                            note: this.notes,
                            data_fine_validita: this.documentEndDate,
                            tipologia_documento: this.documentTypologyModel,
                        }
                    }
                }

                delete payload.malattia.codice_esenzione
                if (this.notes.trim().length) payload.note = this.notes
                this.isCreatingExemption = true
                try {
                    let response = await createExemption(this.cf, payload, {_no5XXRedirect: true})

                    this.newExemption = response.data
                    this.goToFeedback(response.data)
                } catch (e) {
                    let message = "Non è stato possibile creare l'esenzione"

                    if (e.response.data.status === 409) {
                        message = "Esenzione già presente"
                    }

                    this.$q.notify({
                        color: 'negative',
                        message: message
                    })
                }
                this.isCreatingExemption = false
            },
            async goToFeedback(exemption) {

                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_NEW_SUCCESS.name
                if (exemption.tipologia.codice === this.$config.pathologyExemption.typology.Malattie_rare) {
                    let response = await getDisclaimerMalattieRare()
                    this.disclaimerMalattieRare = response.data
                }
                let params = {id: exemption.id, exemption: exemption}

                this.$router.push({name, params})
            }
        },
    }
</script>


<style scoped lang="stylus"></style>
