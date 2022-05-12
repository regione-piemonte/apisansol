<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
    <q-page padding>
      <csi-page-title @back="goBack" title="Informazioni supplementari" class="q-mb-md"></csi-page-title>
      <template v-if="!isLoadingDefaultValues">

        <!------- MOTIVO SOGGIORNO ITALIA (UTENTI STRANIERI) ------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-card class="bg-white q-my-lg" v-if="isForeigner">
          <q-card-title class="q-pt-lg q-pb-none" >
            <h1 class="csi-h1">Motivo del soggiorno in italia</h1>
          </q-card-title>
          <q-card-main ref="stayReasonForm">
            <q-item class="no-padding" >
              <q-item-main>
                <div class="row gutter-x-md ">
                  <q-field class="q-my-md col-12"
                           :error="$v.stayReason.$error"
                           required>
                    <q-select
                      v-model="stayReason"
                      :options="stayReasonOptions"
                      float-label="Motivo del soggiorno in Italia"
                    />

                    <template slot="error-label" >
                      <div v-if="!$v.stayReason.required">Campo obbligatorio</div>
                    </template>

                  </q-field>

                </div>
              </q-item-main>
            </q-item>

          </q-card-main>
        </q-card>

        <!------- MOTIVO DEROGA TERRITORIALE ------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-card class="bg-white q-my-lg" v-if="isDerogation">
          <q-card-title class="q-pt-lg q-pb-none" >
            <h1 class="csi-h1">Motivo della deroga</h1>
          </q-card-title>
          <q-card-main ref="derogationForm">
            <q-item class="no-padding" >
              <q-item-main>
                <div class="row gutter-x-md ">
                  <q-field class="q-my-md col-12"
                           :error="$v.derogationReason.$error"
                           required
                  >
                    <q-input
                      v-model="derogationReason"
                      type="text"
                      clearable=""
                      float-label="Motivazione della deroga">
                    </q-input>
                    <template slot="error-label" >
                      <div v-if="!$v.derogationReason.required">Campo obbligatorio</div>
                    </template>

                  </q-field>
                </div>
              </q-item-main>
            </q-item>

          </q-card-main>
        </q-card>

        <!------- BANNER MOTIVO SOGGIORNO NON IN LISTA------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <div  class="q-pb-lg " v-if="isStayReasonBanner">

          <q-alert type="warning" class="csi-modal-alert" >
            <div class="q-body-1 q-px-md">
              <p>
                Nei motivi elencati si sono considerati esclusivamente i casi in cui è richiesta l’iscrizione obbligatoria
                per i cittadini stranieri residenti in Italia,
                in base a quanto indicato nella Deliberazione della Giunta Regionale 2 luglio 2012, n. 24-4081 –
                “Indicazioni per la corretta applicazione della normativa per l'assistenza sanitaria alla popolazione
                straniera da parte delle Regioni e Province Autonome italiane - Recepimento Regione Piemonte".
              </p>
             <p> Se hai scelto il motivo '<strong>altro</strong>' occorre contattare l'ASL di riferimento per effettuare la richiesta di scelta medico.</p>

            </div>
          </q-alert>
        </div>
        <!------- MOTIVO DEL DOMICILIO ------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <q-card class="bg-white q-my-lg" v-if="showDomicileReason">
          <q-card-title class="q-pt-lg q-pb-none" >
            <h1 class="csi-h1">Motivo del domicilio</h1>
          </q-card-title>
          <q-card-main ref="domicileReasonForm">
            <q-item class="no-padding" >
              <q-item-main>
                <div class="row gutter-x-md ">
                  <q-field class="q-my-md col-12"
                           :error="$v.domicileReason.$error"
                           required>
                    <q-select
                      v-model="domicileReason"
                      :options="domicileReasonOptions"
                      float-label="Motivo del domicilio"
                    />

                    <template slot="error-label" >
                      <div v-if="!$v.domicileReason.required">Campo obbligatorio</div>
                    </template>
                  </q-field>

                </div>
              </q-item-main>
            </q-item>

          </q-card-main>
        </q-card>

        <!------- MOTIVAZIONE LAVORO------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="isWorkMotivation">
          <q-card class="bg-white q-my-lg">
            <q-card-main ref="workMotivationForm">
              <q-item class="no-padding">
                <q-item-main>
                  <div class="row">
                    <q-field class="q-my-md col-xs-12">
                      <div class="flex items-center justify-start">
                        <span class="q-pr-md q-my-sm">Tipo di lavoro</span>
                        <q-option-group
                          class="q-pa-none q-my-sm"
                          inline
                          @input="onInputEmployment"
                          type="radio"
                          color="primary"
                          v-model="employmentType"
                          :options="employmentTypeOptions"
                        />
                      </div>
                    </q-field>
                  </div>

                </q-item-main>
              </q-item>
              <!--- LAvoro autonomo--->
              <q-item class="no-padding" v-if="isSelfEmployment && jobTypeSelected">
                <q-item-main>
                    <div class="row gutter-x-md" >
                      <q-field class="q-my-md col-xs-12 col-md-6"
                               :error="$v.profession.$error"
                               required
                      >
                        <q-input
                          v-model="profession"
                          type="text"
                          clearable=""
                          float-label="Professione">
                        </q-input>
                        <template slot="error-label" >
                          <div v-if="!$v.profession.required">Campo obbligatorio</div>
                        </template>

                      </q-field>
                      <q-field class="q-my-md col-xs-12 col-md-6"
                               :error="$v.pIva.$error"
                               required>
                        <q-input
                          v-model="pIva"
                          type="text"
                          clearable=""
                          float-label="Partita IVA">
                        </q-input>
                        <template slot="error-label" >
                          <div v-if="!$v.pIva.required">Campo obbligatorio</div>
                        </template>
                      </q-field>
                    </div>
                    <div class="row gutter-x-md" >
                      <q-field class="q-my-md col-xs-12 "
                               :error="$v.nrRegistry.$error"
                               required
                      >
                        <q-input
                          v-model="nrRegistry"
                          type="number"
                          clearable=""
                          :float-label="$q.screen.gt.sm ? 'N. iscrizione all\'Ordine professionale / Collegio / Camera di Commercio' : 'N. iscrizione all\'Ordine professionale'">
                        </q-input>
                        <template slot="error-label" >
                          <div v-if="!$v.nrRegistry.required">Campo obbligatorio</div>
                        </template>

                      </q-field>

                    </div>
                </q-item-main>
              </q-item>
              <!-- lavoro subordinato--->
              <q-item class="no-padding" v-if="!isSelfEmployment && jobTypeSelected">
                <q-item-main>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.company.$error"
                             required
                    >
                      <q-input
                        v-model="company"
                        type="text"
                       clearable=""
                        float-label="Ditta o datore di lavoro">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.company.required">Campo obbligatorio</div>
                      </template>

                    </q-field>
                    <q-field
                      class="q-my-md col-xs-12 col-md-6"
                      :error="$v.telCompany.$error"
                      required
                    >
                      <q-input
                        v-model="telCompany"
                        type="text"
                        clearable=""
                        float-label="N. telefono datore di lavoro">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.telCompany.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.province.$error"
                             required
                    >
                      <q-input
                        v-model="province"
                        type="text"
                        clearable=""
                        float-label="Provincia">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.province.required">Campo obbligatorio</div>
                      </template>

                    </q-field>
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.city.$error"
                             required>
                      <q-input
                        v-model="city"
                        type="text"
                        clearable=""
                        float-label="Comune">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.city.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12 col-md-8"
                             :error="$v.address.$error"
                             required
                    >
                      <q-input
                        v-model="address"
                        type="text"
                        clearable=""
                        float-label="Indirizzo">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.address.required">Campo obbligatorio</div>
                      </template>

                    </q-field>
                    <q-field class="q-my-md col-xs-12 col-md-4"
                             :error="$v.streetNumber.$error"
                             required>
                      <q-input
                        v-model="streetNumber"
                        type="text"
                        clearable=""
                        float-label="N. civico">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.streetNumber.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>

                  <div class="row gutter-x-md">
                    <q-field class="q-my-md col-xs-12">
                      <div class="flex items-center justify-start">
                        <span class="q-pr-md q-my-sm">Validità contratto</span>
                        <q-option-group
                          class="q-pa-none q-my-sm"
                          inline
                          type="radio"
                          color="primary"
                          v-model="contractType"
                          :options="contractTypeOptions"
                        />
                      </div>
                    </q-field>
                  </div>


                  <div class="row gutter-x-md" v-if="contractType === 'SCADENZA'">
                    <q-field class="q-my-md col-xs-12"
                             :error="$v.contractValidity.$error"
                             required
                    >
                      <q-datetime
                        type="date"
                        float-label="Contratto valido fino al"
                        placeholder="Indicare la data scadenza o tempo indeterminato"
                        v-model="contractValidity"
                        format="DD MMM YYYY"
                        :min="today"
                        clearable=""
                        @input="onInputValidity"
                      />
                      <template slot="helper">
                        <div>{{minDateContractMsg}}</div>
                      </template>

                      <template slot="error-label" >
                        <div v-if="!$v.contractValidity.required">Campo obbligatorio</div>
                        <div v-if="!$v.contractValidity.minDate">{{minDateContractMsg}}</div>
                      </template>

                    </q-field>

                  </div>
                </q-item-main>
              </q-item>

            </q-card-main>
          </q-card>
        </template>

        <!------- MOTIVAZIONE STUDIO------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="isStudiesMotivation">
          <q-card class="bg-white q-my-lg">
            <q-card-main ref="studiesMotivationForm">
              <q-item class="no-padding">
                <q-item-main>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12"
                             :error="$v.school.$error"
                             required
                    >
                      <q-input
                        v-model="school"
                        type="text"
                        clearable=""
                        float-label="Nome istituto / scuola / università">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.school.required">Campo obbligatorio</div>
                      </template>

                    </q-field>
                  </div>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.province.$error"
                             required
                    >
                      <q-input
                        v-model="province"
                        type="text"
                        clearable=""
                        float-label="Provincia">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.province.required">Campo obbligatorio</div>
                      </template>

                    </q-field>
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.city.$error"
                             required>
                      <q-input
                        v-model="city"
                        type="text"
                        clearable=""
                        float-label="Comune">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.city.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12 col-md-8"
                             :error="$v.address.$error"
                             required
                    >
                      <q-input
                        v-model="address"
                        type="text"
                        clearable=""
                        float-label="Indirizzo">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.address.required">Campo obbligatorio</div>
                      </template>

                    </q-field>
                    <q-field class="q-my-md col-xs-12 col-md-4"
                             :error="$v.streetNumber.$error"
                             required>
                      <q-input
                        v-model="streetNumber"
                        type="text"
                        clearable=""
                        float-label="N. civico">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.streetNumber.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12"
                             :error="$v.enrollmentValidity.$error"
                             required
                    >
                      <q-datetime
                        type="date"
                        float-label="Iscrizione fino al"
                        v-model="enrollmentValidity"
                        format="DD MMM YYYY"
                        :min="today"
                        clearable=""
                        @input="onInputValidity"
                      />
                      <template slot="helper">
                        <div>{{minDateEnrollmentMsg}}</div>
                      </template>
                      <template slot="error-label" >
                        <div v-if="!$v.enrollmentValidity.required">Campo obbligatorio</div>
                        <div v-if="!$v.enrollmentValidity.minDate">{{minDateEnrollmentMsg}}</div>
                      </template>

                    </q-field>

                  </div>
                </q-item-main>
              </q-item>

            </q-card-main>
          </q-card>
        </template>
        <!------- MOTIVAZIONE CURA------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="isCareMotivation">
          <q-alert type="info" class="q-my-lg" >
           Per portare a termine la tua richiesta, dovrai allegare, anche in un secondo momento, la documentazione
            clinica <strong>firmata digitalmente</strong> che giustifica il tuo domicilio.
          </q-alert>
        </template>

        <!------- MOTIVAZIONE RICONGIUNGIMENTO FAMILIARE------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="isFamilyMotivation">
          <!--            MESSAGGIO PER RICONGIUNGIMENTO FAMILIARE-->
          <div  class="q-pb-lg" v-if="isProduction">
            <q-alert type="info" class="csi-modal-alert" >
              <div class="q-body-1 q-px-md">
                <p>
                  Si ricorda che l'iscrizione dei cittadini non residenti per ricongiungimento familiare è possibile solo nei casi di:
                </p>
                <ul>
                  <li>
                    ricongiungimento del nucleo familiare con un familiare lavoratore già domiciliato e non residente
                  </li>
                  <li>
                    familiare che necessita di assistenza sanitaria
                  </li>
                </ul>
              </div>
            </q-alert>
          </div>

          <q-card class="bg-white q-my-lg">
            <q-card-title class="q-pt-lg q-pb-none" >
              <h1 class="csi-h1">Dati del familiare</h1>
            </q-card-title>
            <q-card-main ref="familyMotivationForm">
              <q-item class="no-padding">
                <q-item-main>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.firstname.$error"
                             required
                    >
                      <q-input
                        v-model="firstname"
                        type="text"
                        clearable=""
                        float-label="Nome">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.firstname.required">Campo obbligatorio</div>
                      </template>

                    </q-field>
                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.lastname.$error"
                             required>
                      <q-input
                        v-model="lastname"
                        type="text"
                        clearable=""
                        float-label="Cognome">
                      </q-input>
                      <template slot="error-label" >
                        <div v-if="!$v.lastname.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>
                  <div class="row gutter-x-md" >
                    <div class="q-my-md col-xs-12 col-md-6">
                      <!-- CODICE FISCALE -->
                      <csi-input-tax-code
                        required
                        v-model="taxCode"
                        :error="$v.taxCode.$error"
                        clearable="">

                        <div slot="error-label">
                          <slot name="tax-code-error-label">
                            <div v-if="!$v.taxCode.required">Campo obbligatorio</div>
                            <div v-if="!$v.taxCode.numeric">Deve essere composto solo da numeri</div>
                            <div v-if="!$v.taxCode.alphaNum">Deve essere composto solo da lettere e numeri</div>
                            <div v-if="!$v.taxCode.taxCodeLength">Deve avere esattamente {{taxCodeTemporaryLength}} o {{taxCodeLength}}
                              caratteri
                            </div>
                            <div v-if="!$v.taxCode.sameUser">Deve essere diverso dal tuo codice fiscale
                            </div>
                            <div v-else>
                              <div v-if="!$v.taxCode.taxCodeCin">
                                Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura
                              </div>
                            </div>
                          </slot>
                        </div>

                      </csi-input-tax-code>

                    </div>

                    <q-field class="q-my-md col-xs-12 col-md-6"
                             :error="$v.relationship.$error"
                             required>
                      <q-select
                        v-model="relationship"
                        :options="relationshipOptions"
                        float-label="Rapporto di parentela"
                      />
                      <template slot="error-label" >
                        <div v-if="!$v.relationship.required">Campo obbligatorio</div>
                      </template>
                    </q-field>
                  </div>
                </q-item-main>
              </q-item>

            </q-card-main>
          </q-card>

        </template>

        <!------- DURATA ASSISTENZA SANITARIA------------>
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="showDomicileReason && domicileReason!== null && domicileReason!=='' ">
          <q-card class="bg-white q-my-lg">
            <q-card-main ref="assistanceValidityForm">
              <q-item class="no-padding">
                <q-item-main>
                  <div class="row gutter-x-md" >
                    <q-field class="q-my-md col-xs-12"
                             :error="$v.assistanceValidity.$error"
                             required
                    >
                      <q-datetime
                        type="date"
                        float-label="Durata dell'assistenza sanitaria richiesta fino al"
                        v-model="assistanceValidity"
                        format="DD MMM YYYY"
                        :min="minAssistance"
                        clearable=""
                      />
                      <template slot="error-label" >
                        <div v-if="!$v.assistanceValidity.required">Campo obbligatorio</div>
                        <div v-if="!$v.assistanceValidity. maxDate">La durata dell'assistenza non può essere superiore a 1 anno</div>

                      </template>

                    </q-field>

                  </div>
                </q-item-main>
              </q-item>

            </q-card-main>
          </q-card>
        </template>

        <!--ACTIONS--->
        <div class="row q-mt-lg justify-end items-center">
          <csi-buttons class="col-12 col-md-auto q-pa-sm">
            <csi-button
              primary
              type="submit"
              label="Prosegui"
              :loading="isLoading"
              @click="addAdditionalInfo()" />
<!--            <span class="loader-container col-md-auto col-12">   <csi-inner-loading :visible="isLoading" block /></span>-->
          </csi-buttons>
        </div>


     </template>
        <!--      LOADER-->
      <csi-inner-loading :visible="isLoadingDefaultValues" />

    </q-page>
</template>

<script>

  import CsiCardItem from "components/global/common/CsiCardItem";
  import {deepClone, isEmpty, orderBy, scrollToElement, unionBy} from "@services/global/utils";
  import {capitalize, toUpper} from "@filters/cases";
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import required from "vuelidate/lib/validators/required";
  import {
    attachmentControl,
    combinationControl,
    getDomicileMotivation,
    getStayMotivation
  } from "@services/api/change-doctor";
  import {
    citizenshipInfo,
    maximumCoverageControl
  } from "@services/change-doctor/business-logic";
  import addMonths from 'date-fns/add_months';
  import isAfter from "date-fns/is_after";
  import isEqual from 'date-fns/is_equal';
  import startOfToday from 'date-fns/start_of_today'
  import CsiInputTaxCode from 'components/global/forms/CsiInputTaxCode';
  import {taxCodeCin, taxCodeLength, taxCodeTemporaryLength} from "@validators/taxCode";
  import {alphaNum, numeric} from "vuelidate/lib/validators";
  import {LENGTH, TEMPORARY_LENGTH} from "@services/global/tax-code";
  import {format} from "@filters/date";
  import store from "@store/index";


const EMPLOYMENT_TYPE_OPTIONS = [
  { label: 'Autonomo', value: 'AUTONOMO' },
  { label: 'Subordinato', value: 'SUBORDINATO' }
];

const CONTRACT_EXPIRATION_OPTIONS = [
    { label: 'A scadenza', value: 'SCADENZA' },
    { label: 'Indeterminato', value: 'INDETERMINATO' }
  ];

  export default {
    name: 'PageAdditionalInformation',
    components:{CsiCardItem, CsiPageTitle, CsiInputTaxCode},
    data() {
      return {
        stayReason: '',
        isStayReasonBanner:false,
        stayReasonList: [],
        domicileReason:'',
        domicileReasonList:[],
        employmentType:null,
        employmentTypeOptions: EMPLOYMENT_TYPE_OPTIONS,
        jobTypeSelected :false,
        isSelfEmployment:false,
        profession: '',
        pIva:'',
        nrRegistry:'',
        company:'',
        telCompany:'',
        province:'',
        city:'',
        address:'',
        streetNumber:'',
        contractType: '',
        contractTypeOptions: CONTRACT_EXPIRATION_OPTIONS,
        contractValidity: '',
        school:'',
        enrollmentValidity:'',
        relationshipOptions: [],
        firstname:'',
        lastname:'',
        taxCode:'',
        relationship:'',
        assistanceValidity:'',
        minDateValidityError:false,
        isLoading : false,
        isLoadingDefaultValues:false,
        doctorInfo:null,
        doctorAnotherRegion:null,
        today: new Date(),
        minAssistance: '',
        endAssistance:'',
        minDateEnrollmentMsg:'',
        minDateContractMsg:'',
        defaultEndAssistance: '',
        newQueryParams : null,
        isOnlyStranger :false,
        derogationReason:'',
        isOnlyDerogation:false,

        additionalInfo: {
          motivazione_soggiorno: null,
          motivazione_domicilio: null,
          assitenza_temporanea_data_fine_validita: null,
          note:null,
          lavoro_tipologia:  null,
          lavoro_professione:  null,
          lavoro_partita_iva:  null,
          lavoro_numero_iscrizione:null,
          lavoro_azienda:  null,
          lavoro_azienda_telefono:  null,
          lavoro_azienda_provincia: null,
          lavoro_azienda_comune:  null,
          lavoro_azienda_indirizzo: null,
          lavoro_azienda_civico:  null,
          lavoro_data_fine_validita_contratto: null,
          studio_nome_istituto: null,
          studio_istituto_provincia:  null,
          studio_istituto_comune:  null,
          studio_istituto_indirizzo:null,
          studio_istituto_civico:  null,
          studio_data_termine_iscrizione:  null,
          ricongiungimento_nome:  null,
          ricongiungimento_cognome:  null,
          ricongiungimento_codice_fiscale: null,
          ricongiungimento_parentela: null,
          // motivazione_domanda:null
        },

      }
    },
    validations(){
      return{
        stayReason:{
          required: v => !this.isForeigner || !!v
        },
        domicileReason:{
          required: v => !this.showDomicileReason || !!v
        },
        employmentType:{
          required: v => !this.isWorkMotivation || !!v
        },
        profession:{
          required: v => !this.isWorkMotivation || (this.isWorkMotivation &&  !this.isSelfEmployment) || !!v
        },
        pIva:{
          required: v => !this.isWorkMotivation || (this.isWorkMotivation &&  !this.isSelfEmployment) || !!v
        },
        nrRegistry:{
          required: v => !this.isWorkMotivation || (this.isWorkMotivation &&  !this.isSelfEmployment) || !!v
        },
        company:{
          required: v => !this.isWorkMotivation || (this.isWorkMotivation &&  this.isSelfEmployment) || !!v
        },
        telCompany:{
          required: v => !this.isWorkMotivation || (this.isWorkMotivation &&  this.isSelfEmployment) || !!v
        },
        province:{
          required: v => (!this.isWorkMotivation && !this.isStudiesMotivation) ||  (this.isWorkMotivation && this.isSelfEmployment) || !!v
        },
        city:{
          required: v => (!this.isWorkMotivation && !this.isStudiesMotivation) ||  (this.isWorkMotivation && this.isSelfEmployment) || !!v
        },
        address:{
          required: v => (!this.isWorkMotivation && !this.isStudiesMotivation) ||  (this.isWorkMotivation && this.isSelfEmployment) || !!v
        },
        streetNumber:{
          required: v => (!this.isWorkMotivation && !this.isStudiesMotivation) ||  (this.isWorkMotivation && this.isSelfEmployment) || !!v
        },
        contractValidity:{
          required: v => !this.isWorkMotivation || (this.isWorkMotivation && this.isSelfEmployment ) || this.contractType==='INDETERMINATO' || !!v,
          minDate: v => !this.minDateValidityError
        },
        enrollmentValidity:{
          required: v => !this.isStudiesMotivation || !!v,
          minDate: v => !this.minDateValidityError
        },
        school:{
          required: v => !this.isStudiesMotivation || !!v
        },
        firstname:{
          required: v => !this.isFamilyMotivation || !!v
        },
        lastname:{
          required: v => !this.isFamilyMotivation || !!v
        },
        taxCode: {
          required: v => !this.isFamilyMotivation || !!v,
          // Deve fallire solo se la lunghezza è quella di un CF provvisorio e tutti i caratteri non sono numerici
          numeric: (taxCode = '') => !this.isFamilyMotivation || !taxCodeTemporaryLength(taxCode) || numeric(taxCode),
          // Deve fallire solo se la lunghezza è quella di un CF normale ed i caratteri non sono alfanumerici
          alphaNum: (taxCode = '') => !this.isFamilyMotivation || !taxCodeLength(taxCode) || alphaNum(taxCode),
          taxCodeLength: (taxCode = '') => !this.isFamilyMotivation || taxCodeLength(taxCode) || taxCodeTemporaryLength(taxCode),
          // Deve fallire solo se la lunghezza è quella di un CF normale ed i CIN non corretto
          taxCodeCin: (taxCode = '') => !this.isFamilyMotivation || !taxCodeLength(taxCode) || taxCodeCin(taxCode),
          sameUser: (taxCode = '') => !this.isFamilyMotivation || !this.taxCodeUser(taxCode),
        },
        relationship:{
          required: v => !this.isFamilyMotivation || !!v
        },
        assistanceValidity:{
          required: v => !this.showDomicileReason ||  !!v,
          maxDate: v => !isAfter(v, this.endAssistance)
        },
        derogationReason:{
          required: v => !this.isDerogation ||  !!v,
        }
      }

    },

    computed: {
      userInfo(){
        return this.$store.getters['changeDoctor/getUserInfo']
      },
      cf(){
        return this.$store.getters['changeDoctor/getTaxCode']
      },
      isProduction(){
        return this.$config.global.isProduction
      },
      areDefaultValues() {
        if(this.isForeigner){
          if(this.isOnlyStranger)
            return !isEmpty(this.stayReasonOptions);
          else
            return !isEmpty(this.stayReasonOptions) && !isEmpty(this.domicileReasonOptions)
        }else{
         return  !isEmpty(this.domicileReasonOptions)
        }

      },

      citizenshipInfo(){
        return citizenshipInfo()
      },

      isTemporaryAssistance(){
        return this.$store.getters['changeDoctor/isRenewTemporaryAssistance'];
      },
      taxCodeLength() {
        return LENGTH
      },
      taxCodeTemporaryLength() {
        return TEMPORARY_LENGTH
      },
      stayReasonOptions(){
        let orderedList =[];

        if(this.stayReasonList) {
          let optionsData = deepClone(this.stayReasonList) ;
         optionsData =  optionsData.filter( option => option.cittadini_comunitari === this.citizenshipInfo.isEUCitizen);
          orderedList = optionsData.map(o => {
            let label = capitalize(o.descrizione);
            return {label, value: o.id}
          });

          orderedList = orderBy(orderedList, ['label']);
          orderedList.push({label:'Altro', value: 'altro'})
        }

        return orderedList

      },
      domicileReasonOptions(){
        let orderedList =[];
        if( this.domicileReasonList){
          let optionsData = deepClone(this.domicileReasonList);
          orderedList = optionsData.map(o => {
            let label = capitalize(o.descrizione);
            return {label, value: o.id}
          });
          orderedList = orderedList.filter(o => o.value !== this.$config.changeDoctor.DomicileReasons.RICONGIUNGIMENTO_DEROGA)
          orderedList = orderBy(orderedList, ['label']);
        }
        return orderedList;
      },
      isCareMotivation(){
        return this.domicileReason === this.$config.changeDoctor.DomicileReasons.CURA
     },
      isWorkMotivation(){
        return this.domicileReason === this.$config.changeDoctor.DomicileReasons.LAVORO
      },
      isFamilyMotivation(){
        return this.domicileReason === this.$config.changeDoctor.DomicileReasons.RICONGIUNGIMENTO ||
            this.domicileReason === this.$config.changeDoctor.DomicileReasons.SALUTE
      },
      isStudiesMotivation(){
        return this.domicileReason === this.$config.changeDoctor.DomicileReasons.STUDIO
      },
      choosenDoctor(){
        return this.$store.getters['changeDoctor/getChoosenDoctor'];
      },
      combinationControl(){
        return this.$store.getters['changeDoctor/getCombinationControl'];
      },
      isForeigner(){
        return this.citizenshipInfo && this.citizenshipInfo.isForeigner
      },
      isDerogation(){
        return this.combinationControl && this.combinationControl.deroga_territoriale && !this.isProduction
      },
      showDomicileReason(){
        return !this.isOnlyStranger && !this.isOnlyDerogation
      }
    },
    watch:{
      stayReason:{
        handler(val, oldVal){
          this.isStayReasonBanner = val=== 'altro'
        }
      }
    },
    async created(){
      if(!this.combinationControl || !this.userInfo){
        this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);
      }
      this.isLoadingDefaultValues = true
      this.doctorInfo = this.$route.params;
      this.relationshipOptions = this.$config.changeDoctor.relationshipOptions;
     // this.defaultEndAssistance = addMonths(new Date(), 12);
      this.minAssistance =  addMonths(startOfToday(), 3);
      this.endAssistance =  addMonths(startOfToday(), 12);
      this.minDateContractMsg =  `Non è possibile chiedere assistenza medica per un periodo inferiore a tre mesi. \n
      Per questo motivo se il tuo contratto di lavoro scade prima del ${format(this.minAssistance, 'DD/MM/YYYY') } non puoi procedere con la richiesta.`;
      this.minDateEnrollmentMsg =  `Non è possibile chiedere assistenza medica per un periodo inferiore a tre mesi. \n
      Per questo motivo se l'iscrizione alla tua scuola, istituto o università scade prima del ${format(this.minAssistance, 'DD/MM/YYYY') } non puoi procedere con la richiesta.`;
     // this.endAssistance = this.defaultEndAssistance;
      this.getQueryParams();
      await this.getDefaultDataForm()
      this.isLoadingDefaultValues=false
    },
    methods: {
      getQueryParams() {
        let query = this.$route.query;
        if (!isEmpty(query)) {
          // this.isOnlyStranger = query.isOnlyStranger;
          this.isOnlyStranger = query.onlyf;
          this.isOnlyDerogation = query.onlydt;
          this.stayReason = query.motivazione_soggiorno ? query.motivazione_soggiorno : null;
          this.domicileReason = query.motivazione_domicilio ? query.motivazione_domicilio : null;
          this.assistanceValidity = query.assitenza_temporanea_data_fine_validita ? new Date(query.assitenza_temporanea_data_fine_validita) : null;

          if(this.isWorkMotivation){
            this.employmentType = query.lavoro_tipologia ? query.lavoro_tipologia : null;
            this.isSelfEmployment = (query.lavoro_tipologia === 'AUTONOMO');
            this.jobTypeSelected = (query.lavoro_tipologia ? true : false);
            this.profession = query.lavoro_professione ? query.lavoro_professione : '';
            this.pIva = query.lavoro_partita_iva ? query.lavoro_partita_iva : '';
            this.nrRegistry = query.lavoro_numero_iscrizione ? query.lavoro_numero_iscrizione : '';
            this.company = query.lavoro_azienda ? query.lavoro_azienda : '';
            this.province = query.lavoro_azienda_provincia ? query.lavoro_azienda_provincia : '';
            this.city = query.lavoro_azienda_comune ? query.lavoro_azienda_comune : '';
            this.address = query.lavoro_azienda_indirizzo ? query.lavoro_azienda_indirizzo : '';
            this.streetNumber = query.lavoro_azienda_civico ? query.lavoro_azienda_civico : '';
            this.contractValidity = query.lavoro_data_fine_validita_contratto ? query.lavoro_data_fine_validita_contratto : '';
          }
          if(this.isStudiesMotivation){
            this.school = query.studio_nome_istituto ? query.studio_nome_istituto : '';
            this.province = query.studio_istituto_provincia ? query.studio_istituto_provincia : '';
            this.city = query.studio_istituto_indirizzo ? query.studio_istituto_indirizzo : '';
            this.address = query.studio_istituto_indirizzo ? query.studio_istituto_indirizzo : '';
            this.streetNumber = query.studio_istituto_civico ? query.studio_istituto_civico : '';
            this.enrollmentValidity = query.studio_data_termine_iscrizione ? query.studio_data_termine_iscrizione : null;
          }
          if(this.isFamilyMotivation){
            this.firstname = query.ricongiungimento_nome ? query.ricongiungimento_nome : '';
            this.lastname = query.ricongiungimento_cognome ? query.ricongiungimento_cognome : '';
            this.taxCode = query.ricongiungimento_codice_fiscale ? query.ricongiungimento_codice_fiscale : '';
            this.relationship = query.ricongiungimento_parentela ? query.ricongiungimento_parentela : '';
          }
        }
      },
      async getDefaultDataForm() {
        // if(this.isDoctorOnlyFamilyReunion)  this.domicileReason  = this.$config.changeDoctor.DomicileReasons.RICONGIUNGIMENTO;
        if (this.isForeigner) {
          let stayPromise = getStayMotivation();
          let stayResponse = await stayPromise;
          this.stayReasonList = stayResponse.data;
        }
        if (this.showDomicileReason) {
          let domicilePromise = getDomicileMotivation();
          let domicileResponse = await domicilePromise;
          this.domicileReasonList = domicileResponse.data;
        }


        if (this.enrollmentValidity) {
          this.onInputValidity(this.enrollmentValidity)
        }
        if (this.contractValidity) {
          this.onInputValidity(this.contractValidity)
        }

      },
      taxCodeUser(taxCode){
        return taxCode === this.cf
      },
      onInputEmployment(value) {
        this.jobTypeSelected = true;
        if (value === 'AUTONOMO') this.isSelfEmployment = true;
        else this.isSelfEmployment = false
      },
      onInputValidity(value) {
        this.minDateValidityError =false;
        if(value){
          if(isAfter(value, this.minAssistance) || isEqual(value, this.minAssistance)  ){
            this.minDateValidityError =false;
            console.log('data dopo 3 mesi : ok')
          }
          else{
            console.log('data precedente ai 3 mesi : NO!');
            this.minDateValidityError =true
          }
        }
      },

      goBack() {
        this.$store.dispatch('changeDoctor/resetAdditionalInfo');
        this.$router.go(-1)
      },
      addAdditionalInfo() {
        if (this.stayReasonList && this.stayReason === 'altro') {
          this.isStayReasonBanner = true;
          return
        }

        this.$v.$touch();
        if (!this.isDerogationReasonFormValid()) return;
        if (!this.isStayReasonFormValid()) return;
        if (!this.isDomicileReasonFormValid()) return;
        if (this.isWorkMotivation) if (!this.isWorkMotivationFormValid()) return;
        if (this.isStudiesMotivation) if (!this.isStudiesMotivationFormFormValid()) return;
        if (this.isFamilyMotivation) if (!this.isFamilyMotivationFormValid()) return;
        if (!this.isAssistanceValidityFormValid()) return;

        if (this.stayReasonList && this.stayReasonList.length > 0) {
          this.additionalInfo.motivazione_soggiorno = this.stayReasonList.find(item => item.id === this.stayReason);
        }
        if (this.showDomicileReason && this.domicileReasonList && this.domicileReasonList.length > 0) {
          this.additionalInfo.motivazione_domicilio = this.domicileReasonList.find(item => item.id === this.domicileReason);
        }
        this.additionalInfo.assitenza_temporanea_data_fine_validita = this.assistanceValidity ? format(this.assistanceValidity, 'YYYY-MM-DD') : null;

        let contractValidity = this.contractType === 'SCADENZA' ? format(this.contractValidity, 'YYYY-MM-DD') : null;


        if (this.isWorkMotivation) {
          this.additionalInfo.lavoro_tipologia = this.employmentType;

          if (this.isSelfEmployment) {
            this.additionalInfo.lavoro_professione = this.profession;
            this.additionalInfo.lavoro_partita_iva = this.pIva;
            this.additionalInfo.lavoro_numero_iscrizione = this.nrRegistry
          } else {
            this.additionalInfo.lavoro_azienda = this.company;
            this.additionalInfo.lavoro_azienda_telefono = this.telCompany;
            this.additionalInfo.lavoro_azienda_provincia = this.province;
            this.additionalInfo.lavoro_azienda_comune = this.city;
            this.additionalInfo.lavoro_azienda_indirizzo = this.address;
            this.additionalInfo.lavoro_azienda_civico = this.streetNumber;
            this.additionalInfo.lavoro_data_fine_validita_contratto = contractValidity
          }
        }

        if (this.isStudiesMotivation) {
          this.additionalInfo.studio_nome_istituto = this.school;
          this.additionalInfo.studio_istituto_provincia = this.province;
          this.additionalInfo.studio_istituto_comune = this.city;
          this.additionalInfo.studio_istituto_indirizzo = this.address;
          this.additionalInfo.studio_istituto_civico = this.streetNumber;
          this.additionalInfo.studio_data_termine_iscrizione = this.enrollmentValidity ? format(this.enrollmentValidity, 'YYYY-MM-DD') : null
        }

        if (this.isFamilyMotivation) {
          this.additionalInfo.ricongiungimento_nome = this.firstname;
          this.additionalInfo.ricongiungimento_cognome = this.lastname;
          this.additionalInfo.ricongiungimento_codice_fiscale = this.taxCode;
          this.additionalInfo.ricongiungimento_parentela = this.relationship;
          this.$store.dispatch('changeDoctor/setIsFamilyReunionInfo', {info: true});
        }

        if(!this.isProduction){
          this.additionalInfo.motivazione_domanda= this.isDerogation ? this.derogationReason : '';
        }



        this.$store.dispatch('changeDoctor/setAdditionalInformation', {info: this.additionalInfo});
        this.$store.dispatch('changeDoctor/setIsCareMotivation', {value: this.isCareMotivation});
        this.$store.dispatch('changeDoctor/setIsToBackoffice', {value: true});

        if (this.isForeigner) {
          this.getForeignerAttachments()
        } else {
          let newQuery = this.setQueryParams();
          this.$router.replace({path: this.$router.history.current.fullPath, query: newQuery});
          maximumCoverageControl(this.combinationControl, this.choosenDoctor)
        }


      },
      setQueryParams(){
        let newQuery = deepClone(this.additionalInfo);
        newQuery.motivazione_soggiorno = this.stayReason;
        newQuery.motivazione_domicilio = this.domicileReason;

        return newQuery
      },
      async getForeignerAttachments() {

        let params = {
          cittadinanza: this.citizenshipInfo ? this.citizenshipInfo.nation : '',
          motivazione_soggiorno: this.additionalInfo.motivazione_soggiorno,
          asl_iscrizione: this.combinationControl.asl_iscrizione,
          asl_domicilio: this.combinationControl.asl_domicilio,
          asl_residenza: this.combinationControl.asl_residenza
        };

        let attachmentsControlResponse = await attachmentControl(this.cf, params, {_no5XXRedirect: true});
        let attachments = attachmentsControlResponse.data;
        if (attachments && attachments.allegati.length > 0) {
          this.$store.dispatch('changeDoctor/setForeignerAttachments', {attachments: attachments});
          this.$store.dispatch('changeDoctor/setIsForeignerDocuments', {value: true});
        }
        let newQuery = this.setQueryParams();
        this.$router.replace({path: this.$router.history.current.fullPath, query: newQuery});
        maximumCoverageControl(this.combinationControl, this.choosenDoctor)
      },
      isDerogationReasonFormValid(){
        this.$v.derogationReason.$touch();
        let hasError = this.$v.derogationReason.$error;
        if (hasError) scrollToElement(this.$refs.derogationForm.$el);
        return !hasError;
      },

      isStayReasonFormValid() {
        this.$v.stayReason.$touch();
        let hasError = this.$v.stayReason.$error;
        if (hasError) scrollToElement(this.$refs.stayReasonForm.$el);
        return !hasError;
      },
      isDomicileReasonFormValid() {

        let hasError = this.$v.domicileReason.$error;
        if (hasError) scrollToElement(this.$refs.domicileReasonForm.$el);
        return !hasError;
      },
      isAddressFormValid() {
        return this.$v.province.$error || this.$v.city.$error || this.$v.address.$error || this.$v.streetNumber.$error

      },
      isWorkMotivationFormValid() {
        let error = false;
        if (this.isSelfEmployment) {
          error = this.$v.profession.$error || this.$v.pIva.$error || this.$v.nrRegistry.$error
        } else {
          error = this.$v.company.$error || this.$v.contractValidity.$error || this.isAddressFormValid() ||this.$v.telCompany.$error
        }
        let employmentError = this.$v.employmentType.$error;
        let hasError = employmentError || error;
        if (hasError) scrollToElement(this.$refs.workMotivationForm.$el);
        return !hasError;
      },
      isStudiesMotivationFormFormValid() {
        let hasError = this.$v.enrollmentValidity.$error || this.$v.school.$error || this.isAddressFormValid();
        if (hasError) scrollToElement(this.$refs.studiesMotivationForm.$el);
        return !hasError;
      },
      isFamilyMotivationFormValid() {
        let hasError = this.$v.firstname.$error || this.$v.lastname.$error ||this.$v.taxCode.$error || this.$v.relationship.$error;
        if (hasError) scrollToElement(this.$refs.familyMotivationForm.$el);
        return !hasError;
      },
      isAssistanceValidityFormValid() {
        let hasError = this.$v.assistanceValidity.$error;
        if (hasError) scrollToElement(this.$refs.assistanceValidityForm.$el);
        return !hasError;
      },

    }
  }

</script>
<style scoped lang="stylus">
  .change-doctor-home-title
    margin-top: 48px;

  .loader-container
    max-height : 30px
    display : flex
    align-items : center
    justify-content : center

</style>
