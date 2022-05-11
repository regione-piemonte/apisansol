<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="appService">
      <lms-page-title no-back>Nuova richiesta di assistenza</lms-page-title>
      <template v-if="!notifyContacts && isUserLogged">
        <q-banner class="h-banner h-banner--warning q-mt-lg q-mb-md">
          <div class="text-body1">
            Per inviare una richiesta di assistenza è necessario completare il
            tuo profilo personale indicando un indirizzo email.
          </div>
        </q-banner>
        <lms-buttons>
          <lms-button :href="profileUrl" type="a">Accedi al profilo</lms-button>
        </lms-buttons>
      </template>
      <template v-else-if="requestFeedback && requestFeedback.success">
        <q-banner
          v-if="newRequest"
          class="q-pa-md h-banner h-banner--positive q-mt-lg"
        >
          La richiesta di assistenza
          <strong>{{ newRequest.richiesta_numero }}</strong>
          è stata inviata con successo.
          <div v-if="!isUserLogged">
            Controlla la tua e-mail.
          </div>
        </q-banner>
        <lms-buttons v-if="isUserLogged" class="q-mt-md">
          <lms-button outline @click="goToRequestsList">
            RICHIESTE APERTE
          </lms-button>
          <!--          <lms-button outline @click="goToNewRequest" v-else>-->
          <!--            NUOVA RICHIESTA-->
          <!--          </lms-button>-->
        </lms-buttons>
      </template>
      <template v-else>
        <template v-if="isSolCovid || isVaccinations">
          <q-banner class="h-banner h-banner--info q-my-lg">
            <p class="q-ma-xs text-body1">
              <strong>
                Vai su
                <a href="https://www.ilpiemontetivaccina.it" class="lms-link"
                  >www.ilpiemontetivaccina.it</a
                >
                per tutte le informazioni relative a preadesioni dei minori,
                prenotazione della prima dose, gestione degli appuntamenti
              </strong>
            </p>
          </q-banner>
        </template>

        <q-banner class="h-banner h-banner--warning q-my-lg">
          <p class="q-ma-xs text-body1">
            <strong
              >Attenzione! Il servizio offre solo supporto tecnico, perciò ti
              invitiamo a non comunicare informazioni personali di tipo
              sanitario</strong
            >
          </p>
        </q-banner>

        <q-card class="q-my-lg">
          <q-card-section>
            <div class="text-h4">Servizio</div>
            <div class="text-h3 row items-center q-gutter-sm">
              <div class="col-auto">
                <strong>{{ serviceName }}</strong>
              </div>
              <div class="col">
                <q-btn
                  :to="NEW_REQUEST_CHOOSE"
                  color="primary"
                  dense
                  flat
                  icon="edit"
                  round
                  type="a"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-form ref="formNew" greedy @submit="confirmDialog">
          <q-card class="q-my-lg">
            <q-card-section class="q-pb-sm">
              <div class="text-h4">I tuoi dati</div>
            </q-card-section>
            <q-card-section class="q-gutter-y-md column">
              <template v-if="!isUserLogged">
                <q-input
                  v-model="name"
                  :rules="[ruleRequired, ruleAlphaNumeric, ruleMaxLength]"
                  clearable
                  label="Nome"
                  no-error-icon
                  reactive-rules
                  required
                />

                <q-input
                  v-model="surname"
                  :rules="[ruleRequired, ruleAlphaNumeric, ruleMaxLength]"
                  clearable
                  label="Cognome"
                  no-error-icon
                  reactive-rules
                  required
                />

                <lms-input-tax-code v-model="cf" is-required temporary />
              </template>
              <q-input
                v-model="email"
                :readonly="hasEmail"
                :rules="[ruleRequired, ruleEmail]"
                clearable
                label="Email"
                lazy-rules
                no-error-icon
                required
              />
              <q-input
                v-model="phone"
                :required="isCeliacDesease"
                :rules="[ruleRequiredCeliac, ruleNumeric]"
                clearable
                label="Telefono"
                no-error-icon
                reactive-rules
              />
            </q-card-section>
          </q-card>
          <q-card class="q-my-lg">
            <q-card-section class="q-pb-sm">
              <div class="text-h4">Problema riscontrato</div>
            </q-card-section>
            <q-card-section class="q-gutter-y-md column">
              <!-- TIPOLOGIA-->
              <q-select
                v-model="requestType"
                :options="typeOptions"
                :rules="[ruleRequired]"
                clearable
                input-debounce="0"
                label="Tipologia della richiesta"
                lazy-rules="ondemand"
                no-error-icon
                option-label="descrizione"
                option-value="codice"
                required
              />

              <!-- CAMPI ROL-->
              <template v-if="isRol || isFse">
                <!--                <q-select-->
                <!--                  required-->
                <!--                  v-model="userAccessType"-->
                <!--                  clearable-->
                <!--                  input-debounce="0"-->
                <!--                  label="Tipologia di accesso"-->
                <!--                  :options="typeUserAccessGroup"-->
                <!--                  :rules="[ruleRequired]"-->
                <!--                  lazy-rules="ondemand"-->
                <!--                />-->

                <q-select
                  v-model="asl"
                  :options="suggestedAslList"
                  :required="isRol || requiredFseFields"
                  :rules="[ruleRequiredRol, ruleRequiredFseRol]"
                  bottom-slots
                  clearable
                  fill-input
                  hide-selected
                  input-debounce="0"
                  label="Azienda Sanitaria presso la quale hai effettuato la vista/esame"
                  no-error-icon
                  option-label="descrizione"
                  option-value="id"
                  reactive-rules
                  use-input
                  @filter="filterByAsl"
                  @filter-abort="abortFilterByAsl"
                />

                <q-input
                  v-model="examDate"
                  :required="isRol || requiredFseFields"
                  :rules="[ruleRequiredRol, ruleRequiredFseRol, ruleValidDate]"
                  bottom-slots
                  label="Data in cui hai effettuato la visita/esame"
                  mask="##/##/####"
                  no-error-icon
                  placeholder="gg/mm/aaaa"
                  reactive-rules
                >
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy
                        ref="examDateProxy"
                        v-model="showExamDateCalendar"
                      >
                        <q-date
                          v-model="examDate"
                          mask="DD/MM/YYYY"
                          minimal
                          @input="showExamDateCalendar = false"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <lms-input-team-code
                  v-model="teamCode"
                  :is-required="isRol || requiredFseFields"
                  class="q-pb-lg"
                />
              </template>
              <!-- CAMPI ESENRED-->
              <template v-if="isEsenred">
                <lms-input-tax-code
                  v-model="holderCf"
                  label="Codice fiscale del titolare"
                  temporary
                />

                <div class="col">
                  <div v-for="(cf, index) in beneficiaryCf" :key="index">
                    <lms-input-tax-code
                      v-model="cf.cf"
                      label="Codice fiscale del beneficiario"
                      temporary
                    />
                  </div>
                </div>

                <lms-buttons>
                  <lms-button outline @click="addBeneficiary"
                    >Aggiungi beneficiario</lms-button
                  >
                </lms-buttons>

                <q-input
                  v-model="exceptionCode"
                  bottom-slots
                  clearable
                  label="Codice esenzione"
                  no-error-icon
                  reactive-rules
                />
              </template>
              <!--  CAMPI PRESCRIPTIONS-->
              <template v-if="isPrescriptions">
                <q-input
                  v-model="nrPrescription"
                  clearable
                  label="Numero NRE (numero ricetta elettronica)"
                  no-error-icon
                  reactive-rules
                />

                <q-field
                  :rules="[ruleRequired]"
                  :value="typePrescription"
                  class="form-field__option-group"
                  label="Indicare il tipo di ricetta"
                  no-error-icon
                  reactive-rules
                  required
                  stack-label
                >
                  <template v-slot:control>
                    <q-option-group
                      v-model="typePrescription"
                      :options="typePrescriptionGroup"
                      color="primary"
                      dense
                      inline
                    />
                  </template>
                </q-field>

                <q-input
                  v-model="examDate"
                  :rules="[ruleValidDate]"
                  label="Data della ricetta"
                  mask="##/##/####"
                  no-error-icon
                  placeholder="gg/mm/aaaa"
                  reactive-rules
                >
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy
                        ref="prescriptionDateProxy"
                        v-model="showPrescriptionDateCalendar"
                      >
                        <q-date
                          v-model="examDate"
                          mask="DD/MM/YYYY"
                          minimal
                          @input="showPrescriptionDateCalendar = false"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </template>

              <!--  CAMPI PAGAMENTI-->
              <template v-if="isPayments">
                <lms-input-tax-code
                  v-model="ticketCf"
                  is-required
                  label="Codice fiscale del intestatario del ticket"
                  temporary
                />
                <q-select
                  v-model="asl"
                  :options="suggestedAslList"
                  :rules="[ruleRequired]"
                  bottom-slots
                  clearable
                  fill-input
                  hide-selected
                  input-debounce="0"
                  label="Azienda Sanitaria"
                  no-error-icon
                  option-label="descrizione"
                  option-value="id"
                  reactive-rules
                  required
                  use-input
                  @filter="filterByAsl"
                  @filter-abort="abortFilterByAsl"
                />
                <q-input
                  v-model="idPayment"
                  :maxlength="TICKET_LENGTH"
                  :rules="[ruleRequired, ruleLengthPayment]"
                  bottom-slots
                  clearable
                  counter
                  label="Identificativo Ticket/posizione debitoria"
                  no-error-icon
                  reactive-rules
                  required
                />
              </template>

              <!--CAMPI DELEGHE -->
              <!-- --------  -->
              <template v-if="isDelegations">
                <template v-if="ruleRequiredMinorTaxCode">
                  <div class="col">
                    <div v-for="(cf, index) in minorCf" :key="index">
                      <lms-input-tax-code
                        v-model="cf.cf"
                        :is-required="ruleRequiredMinorTaxCode && index === 0"
                        label="Codice fiscale del minore"
                        temporary
                      />
                    </div>
                  </div>

                  <lms-buttons>
                    <lms-button outline @click="addMinor"
                      >Aggiungi minore</lms-button
                    >
                  </lms-buttons>
                </template>

                <lms-input-tax-code
                  v-if="ruleRequiredParentTaxCode"
                  v-model="secondParentCf"
                  :is-required="ruleRequiredParentTaxCode"
                  label="Codice fiscale del secondo genitore"
                  temporary
                />

                <lms-input-tax-code
                  v-if="ruleRequiredAdultTaxCode"
                  v-model="adultCf"
                  :is-required="ruleRequiredAdultTaxCode"
                  label="Codice fiscale del secondo soggetto"
                  temporary
                />
              </template>
              <!--CAMPI ACCESSI -->
              <!-- --------  -->
              <q-select
                v-if="isAccess"
                v-model="accessType"
                :options="typeAccessGroup"
                :rules="[ruleRequired]"
                clearable
                label="Sistema di accesso"
                reactive-rules
                required
              />

              <!--CAMPI FFE-->
              <!-- --------  -->
              <template v-if="isFfe || isEscon">
                <q-select
                  v-model="ticketYear"
                  :options="suggestedYearList"
                  :rules="[ruleRequiredEscon]"
                  bottom-slots
                  clearable
                  fill-input
                  hide-dropdown-icon
                  hide-selected
                  input-debounce="0"
                  label="Anno di riferimento del ticket/spesa sanitaria"
                  mask="####"
                  reactive-rules
                  required
                  use-input
                  @filter="filterByYear"
                />
                <q-input
                  v-model="nrTicket"
                  bottom-slots
                  clearable
                  label="Numero di ticket/cedola"
                  no-error-icon
                  reactive-rules
                />
              </template>
              <!--CAMPI FFE-->
              <!-- --------  -->
              <template v-if="isEscon">
                <q-select
                  v-model="asl"
                  :options="suggestedAslList"
                  bottom-slots
                  clearable
                  fill-input
                  hide-selected
                  input-debounce="0"
                  label="Azienda Sanitaria riportata sul ticket"
                  no-error-icon
                  option-label="descrizione"
                  option-value="id"
                  reactive-rules
                  use-input
                  @filter="filterByAsl"
                  @filter-abort="abortFilterByAsl"
                />
              </template>
              <!--CAMPI COVID-->
              <!-- --------  -->
              <template v-if="isSolCovid">
                <q-select
                  v-model="asl"
                  :options="suggestedAslList"
                  :rules="[ruleRequired]"
                  bottom-slots
                  clearable
                  fill-input
                  hide-selected
                  input-debounce="0"
                  label="ASL di domicilio"
                  option-label="descrizione"
                  option-value="id"
                  reactive-rules
                  required
                  use-input
                  @filter="filterByAsl"
                  @filter-abort="abortFilterByAsl"
                />

                <template v-if="requiredSolcovidSwabTest">
                  <q-input
                    v-model="examDate"
                    :rules="[ruleRequired, ruleValidDate]"
                    label="Data tampone"
                    mask="##/##/####"
                    required
                    no-error-icon
                    placeholder="gg/mm/aaaa"
                    reactive-rules
                  >
                    <template v-slot:append>
                      <q-icon class="cursor-pointer" name="event">
                        <q-popup-proxy
                          ref="prescriptionDateProxy"
                          v-model="showSolcovidCalendar"
                        >
                          <q-date
                            v-model="examDate"
                            mask="DD/MM/YYYY"
                            minimal
                            @input="showSolcovidCalendar = false"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </template>

                <template v-if="requiredSolcovidIsolation">
                  <q-input
                    v-model="quarantineDate"
                    :rules="[ruleRequired, ruleValidDate]"
                    label="Data di inizio isolamento fiduciario"
                    mask="##/##/####"
                    required
                    no-error-icon
                    placeholder="gg/mm/aaaa"
                    reactive-rules
                  >
                    <template v-slot:append>
                      <q-icon class="cursor-pointer" name="event">
                        <q-popup-proxy
                          ref="prescriptionDateProxy"
                          v-model="showSolcovidCalendar"
                        >
                          <q-date
                            v-model="quarantineDate"
                            mask="DD/MM/YYYY"
                            minimal
                            @input="showSolcovidCalendar = false"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </template>
              </template>

              <!--CAMPI FARAB-->
              <!-- --------  -->
              <template v-if="isFarab">
                <q-input
                  v-model="pharmacyName"
                  label="Denominazione farmacia"
                  no-error-icon
                  reactive-rules
                  bottom-slots
                  clearable
                />



              </template>


              <q-input
                v-if="!isSolCovid && !isVaccinations"
                v-model="desc"
                :maxlength="requestMaxLength"
                :rules="[ruleRequired]"
                clearable
                counter
                float-label
                label="Descrizione del problema"
                lazy-rules
                no-error-icon
                required
                type="textarea"
              />

              <assistance-attachment-input
                v-model="attachment"
                :configuration="formConfiguration"
              ></assistance-attachment-input>

              <!-- POLICY PRIVACY -->
              <!-- --------  -->
              <q-field
                :rules="[
                  v => $rules.required(isPolicyAccepted) || 'Campo obbligatorio'
                ]"
                borderless
                class="q-mt-xl"
                color="black"
                dense
                lazy-rules
                no-error-icon
                reactive-rules
              >
                <q-checkbox
                  id="privacy-policy"
                  v-model="isPolicyAccepted"
                  dense
                  name="privacy-policy"
                  size="sm"
                >
                  Dichiaro di aver preso visione e di accettare quanto contenuto
                  nelle
                  <a
                    class="inline lms-link"
                    href="#"
                    @click.prevent.stop="showPolicyList"
                  >
                    informative dei servizi richiamati
                  </a>
                </q-checkbox>
              </q-field>
            </q-card-section>
          </q-card>
          <lms-buttons>
            <lms-button type="submit">Invia</lms-button>
          </lms-buttons>
        </q-form>
      </template>
    </template>

    <!--    MODAL POLICY PRIVACY -->
    <lms-privacy-policy-dialog v-model="isPolicyModalOpen" />
    <!--    CONFERMA INVIO -->
    <q-dialog v-model="isConfirmDialog">
      <q-card>
        <q-toolbar class="">
          <q-toolbar-title>Nuova richiesta di assistenza</q-toolbar-title>
          <q-btn v-close-popup dense flat icon="close" round />
        </q-toolbar>
        <template v-if="requestFeedback && requestFeedback.error">
          <q-card-section>
            <q-banner class="q-pa-md h-banner h-banner--warning">
              A causa di un problema interno non è stato possibile inviare la
              richiesta. <br />
              Puoi effettuare un nuovo tentativo. Se il problema persiste
              riprova più tardi.
            </q-banner>
          </q-card-section>
          <q-card-actions align="right">
            <lms-buttons padding>
              <lms-button @click="resetRequest">OK</lms-button>
            </lms-buttons>
          </q-card-actions>
        </template>
        <template v-else>
          <q-card-section class="">
            Confermi l'invio della nuova richiesta di assistenza?<br />
          </q-card-section>
          <q-card-actions align="right">
            <lms-buttons padding>
              <lms-button :loading="isLoading" @click="createNewRequest"
                >Conferma</lms-button
              >
              <lms-button v-close-popup outline>Annulla</lms-button>
            </lms-buttons>
          </q-card-actions>
        </template>
      </q-card>
    </q-dialog>
    <!--    CONFERMA MAIL-->
    <q-dialog v-model="isConfirmMailDialog">
      <q-card>
        <q-toolbar class="">
          <q-toolbar-title>Nuova richiesta di assistenza</q-toolbar-title>
          <q-btn v-close-popup dense flat icon="close" round />
        </q-toolbar>
        <q-card-section class="">
          Per confermare la richiesta ti verrà inviato un codice di verifica
          all'indirizzo <strong>{{ email }}</strong
          >.
          <q-slide-transition v-if="hasOtpCreationError">
            <q-banner class="h-banner h-banner--negative q-mt-md">
              <div class="text-body1">
                <p>
                  Si è verificato un errore durante la creazione del codice OTP,
                  riprova.
                </p>
              </div>
            </q-banner>
          </q-slide-transition>
        </q-card-section>
        <q-card-actions align="right">
          <lms-buttons padding>
            <lms-button :loading="isSendingOtp" @click="sendOtpEmail"
              >Conferma</lms-button
            >
            <lms-button v-close-popup outline>Annulla</lms-button>
          </lms-buttons>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <lms-otp-dialog
      v-model="isOpenCheckEmailDialog"
      :email="email"
      :otp-data="otpData"
      :otp-error="hasOtpCreationError"
      :request-feedback="requestFeedback"
      :tax-code="cf"
      @send-request="sendNewRequest"
      @reset-request="resetRequest"
      @generate-otp="sendOtpEmail"
    />
  </lms-page>
</template>

<script>
import LmsButton from "src/components/core/LmsButton.vue";
import LmsButtons from "src/components/core/LmsButtons.vue";

import {
  getAsrList,
  getAsrPayments,
  getCategoriesList,
  getExemptionCodes,
  getNotifyContacts,
  postRequests,
  postRequestsAuth,
  sendOtp
} from "../services/api";
import {
  apiErrorNotify,
  equalsIgnoreCase,
  isEmpty,
  orderBy,
  toBase64
} from "../services/utils";
import {
  NEW_REQUEST_CHOOSE,
  REQUEST_DETAIL,
  REQUESTS_OPENED,
  NEW_REQUEST_SPECIFIC,
  ASSISTANCE_TREE_ANSWERS
} from "src/router/routes";
import { date } from "quasar";
import LmsInputTaxCode from "components/core/LmsInputTaxCode";
import LmsPrivacyPolicyDialog from "components/LmsPrivacyPolicyDialog";
import {
  APP_SERVICES_MAP,
  TICKET_LENGTH,
  TYPE_USER,
  TYPE_DELEGATIONS,
  TYPE_PRESCRIPTIONS,
  TYPE_ACCESS_OPTIONS,
  ADDITIONAL_INFO_LABEL,
  ASSISTANCE_TREE_PATH_TAG,
  CSI_GROUP,
  IS_DEV,
  IS_TEST
} from "src/services/config";
import LmsInputTeamCode from "components/core/LmsInputTeamCode";
import { SERVICES_TYPES } from "src/services/tipologie";
import { profileNewContacts } from "src/services/urls";
import AssistanceAttachmentInput from "components/AssistanceAttachmentInput";
import AssistanceOtpCard from "components/AssistanceOtpCard";
import LmsOtpDialog from "components/LmsOtpDialog";

export default {
  components: {
    LmsOtpDialog,
    AssistanceAttachmentInput,
    LmsInputTeamCode,
    LmsPrivacyPolicyDialog,
    LmsInputTaxCode,
    LmsButton,
    LmsButtons
  },
  name: "PageForm",
  data() {
    return {
      NEW_REQUEST_CHOOSE,
      TICKET_LENGTH,
      APP_SERVICES_MAP,
      text: "",
      name: "",
      surname: "",
      cf: "",
      email: "",
      phone: "",
      requestType: "",
      attachment: null,
      appServiceCode: null,
      appService: null,
      isConfirmDialog: false,
      isConfirmMailDialog: false,
      isLoading: false,
      newRequest: null,
      asl: null,
      onSearchingAsl: false,
      // aslList: [],
      suggestedAslList: [],
      examDate: null,
      quarantineDate: null,
      showExamDateCalendar: false,
      showSolcovidCalendar: false,
      showPrescriptionDateCalendar: false,
      exceptionCode: "",
      exceptionCodesList: [],
      nrPrescription: "",
      typePrescription: null,
      typePrescriptionGroup: TYPE_PRESCRIPTIONS,
      typeDelegationGroup: TYPE_DELEGATIONS,
      typeAccessGroup: TYPE_ACCESS_OPTIONS,
      idPayment: null,
      isPolicyAccepted: false,
      isPolicyModalOpen: false,
      serviceRequestTypes: [],
      paymentReceipt: "",
      teamCode: "",
      delegationType: "",
      userAccessType: "",
      minorCf: [{ cf: "" }],
      adultCf: "",
      secondParentCf: "",
      ticketCf: "",
      accessType: "",
      hasFileErrors: false,
      desc: "",
      assetId: null,
      isSendingOtp: false,
      verifyError: false,
      hasOtpCreationError: false,
      otpData: null,
      confirmCode: "",
      isOtpExpired: false,
      isVerifyingOtp: false,
      requestErr: false,
      isOpenCheckEmailDialog: false,
      requestFeedback: null,
      ticketYear: "",
      nrTicket: "",
      yearsOptions: [],
      suggestedYearList: [],
      assistanceTree: null,
      assistanceTreeLabel: null,
      holderCf: [],
      beneficiaryCf: [{ cf: "" }],
      pharmacyName:"",
      isolationDate:""
    };
  },
  watch: {
    taxCode: {
      immediate: true,
      handler(val, oldVal) {
        if (val) {
          this.getUserInfo();
        }
      }
    }
  },
  computed: {
    isTest() {
      return process.env.APP_IS_DEV || process.env.APP_IS_TEST;
    },
    isUserLogged() {
      return this.$store.getters["isUserLogged"];
    },
    userInfoData() {
      return this.$store.getters["getActiveUserName"];
    },
    userTeamCode() {
      let userInfo = this.$store.getters["getUserInfo"];
      return userInfo?.info_san?.codice_tessera_team;
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    aslList() {
      let asrList = this.$store.getters["getAsrList"];
      if (IS_DEV || IS_TEST) {
        let filteredList = asrList.filter(asl =>
          asl.visibile_applicazioni?.includes(this.appService?.codice)
        );
        return filteredList ?? [];
      } else {
        return asrList;
      }
    },
    userFirstname() {
      return this.userInfoData?.nome;
    },
    userSurname() {
      return this.userInfoData?.cognome;
    },
    appList() {
      return this.$store.getters["getAssistanceAppList"];
    },
    notifyContacts() {
      return this.$store.getters["getNotifyContacts"];
    },

    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    ruleNumeric() {
      return v => !isNaN(v) || "Inserisci un valore numerico";
    },
    ruleAlphaNumeric() {
      return v => isNaN(v) || "Inserisci un valore alfanumerico";
    },
    ruleMaxLength() {
      return v => v?.length <= 30 || "Può contenere al massimo 30 caratteri";
    },
    ruleEmail() {
      return v => {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(v) || "Inserisci una mail valida";
      };
    },
    isRol() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.ROL);
    },
    isFse() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.FSE);
    },
    isEsenred() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.ESENRED);
    },
    isPrescriptions() {
      return equalsIgnoreCase(
        this.appServiceCode,
        APP_SERVICES_MAP.PRESCRIPTIONS
      );
    },
    isPayments() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.PTW);
    },
    isDelegations() {
      return equalsIgnoreCase(
        this.appServiceCode,
        APP_SERVICES_MAP.DELEGATIONS
      );
    },
    isCeliacDesease() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.CELIAC);
    },
    isAccess() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.ACCESS);
    },
    isFfe() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.FFE);
    },
    isSolCovid() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.COVID);
    },
    isVaccinations() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.SIRVA);
    },
    isEscon() {
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.ESCON);
    },
    isFarab(){
      return equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.FARAB);
    },
    ruleRequiredRol() {
      return v => !!v || !this.isRol || "Campo obbligatorio";
    },

    requiredFseFields() {
      const requiredTypes = [7, 8, 9];
      return requiredTypes.includes(this.requestType?.codice);
    },
    requiredSolcovidSwabTest() {
      const requiredTypes = [3, 5, 10, 12];
      return requiredTypes.includes(this.requestType?.codice);
    },
    requiredSolcovidIsolation() {
      const requiredTypes = [14, 18];
      return requiredTypes.includes(this.requestType?.codice);
    },
    ruleRequiredFseRol() {
      return v =>
        !!v || !this.isFse || !this.requiredFseFields || "Campo obbligatorio";
    },
    ruleRequiredCeliac() {
      return v => !!v || !this.isCeliacDesease || "Campo obbligatorio";
    },
    ruleRequiredEscon() {
      return v => !!v || !this.isFfe || !this.isEscon || "Campo obbligatorio";
    },

    ruleRequiredMinorTaxCode() {
      const requiredTypes = [2, 3];
      return (
        this.isDelegations && requiredTypes.includes(this.requestType?.codice)
      );
    },
    ruleRequiredAdultTaxCode() {
      const requiredTypes = [4];
      return (
        this.isDelegations && requiredTypes.includes(this.requestType?.codice)
      );
    },
    ruleRequiredParentTaxCode() {
      const requiredTypes = [3];
      return (
        this.isDelegations && requiredTypes.includes(this.requestType?.codice)
      );
    },
    suggestedAlsOptions() {
      let list = this.suggestedAslList.map(asr => ({
        label: asr.descrizione,
        value: asr.id
      }));
      return orderBy(list, ["label"]);
    },
    exceptionCodesOptions() {
      let list = this.exceptionCodesList.map(code => ({
        label: code.descrizione,
        value: code.codice
      }));
      return orderBy(list, ["label"]);
    },
    ruleLengthPayment() {
      return v =>
        !v ||
        v?.length === TICKET_LENGTH ||
        !this.isPayments ||
        "Deve avere esattamente 27 caratteri";
    },
    ruleValidDate() {
      return v =>
        !v ||
        /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(
          v
        ) ||
        "Inserire una data valida";
    },
    typeOptions() {
      let list = [];
      if (this.serviceRequestTypes) {
        let requestType = this.serviceRequestTypes.find(obj =>
          equalsIgnoreCase(obj.servizio_codice, this.appServiceCode)
        );
        if (requestType) list = requestType.categorie;
      }
      return list;
    },

    requestMaxLength() {
      return this.formConfiguration?.testo_numero_massimo_caratteri ?? "";
    },
    fileExtensions() {
      let documentsFormat =
        this.formConfiguration?.documento_formati_supportati ?? [];
      if (!isEmpty(documentsFormat)) {
        documentsFormat = documentsFormat.map(docFormat => "." + docFormat);
      }
      return documentsFormat.join(", ");
    },
    maxFileSize() {
      let maxSize = this.formConfiguration?.documento_dimensione_massima;
      let sizeKb = maxSize / 1024;
      return {
        value: maxSize,
        label: sizeKb + " KB"
      };
    },
    ruleValidFileSize() {
      let msg = `La dimensione massima dell'allegato è di ${this.maxFileSize?.label}`;
      return v => !v || v?.size <= this.maxFileSize?.value || msg;
    },

    serviceName() {
      let name = this.appService?.descrizione;
      if (equalsIgnoreCase(this.appServiceCode, APP_SERVICES_MAP.ACCESS))
        name = "Accesso ai servizi";
      return name;
    },
    formConfiguration() {
      return this.$store.getters["getAssistanceConfiguration"];
    },
    hasEmail() {
      return !isEmpty(this.notifyContacts?.email);
    },
    profileUrl() {
      return profileNewContacts(this.appServiceCode);
    },
    assistanceTreeUrl() {
      if (this.assistanceTree) {
        let route = {
          name: ASSISTANCE_TREE_ANSWERS.name,
          params: this.appService?.portale_codice,
          query: this.assistanceTree
        };
        let routeLink = this.$router.resolve(route);
        return (
          window.location.origin +
          "/la-mia-salute/assistenza/" +
          routeLink?.href
        );
      } else {
        return "";
      }
    }
  },
  created() {
    this.appServiceCode = this.$route.params?.serviceid;
    let { op, op_label, pa_list } = this.$route.query;
    this.assistanceTreeLabel = op_label ?? null;
    if (op && pa_list)
      this.assistanceTree = {
        root: op,
        pa: pa_list
      };

    this.appService = this.appList.find(a =>
      equalsIgnoreCase(a.portale_codice, this.appServiceCode)
    );
    this.assetId = this.appService?.assistenza_codice;
    if (!this.appServiceCode || !this.appService)
      this.$router.replace(NEW_REQUEST_CHOOSE);

    let year = new Date().getFullYear();
    for (let k = 1970; k < year + 1; k++) {
      this.yearsOptions.push(k.toString());
    }
    this.yearsOptions.reverse();

    this.getTipologiesList();

    if (IS_DEV || IS_TEST) {
      if (isEmpty(this.aslList)) this.getAsrList();
      this.suggestedAslList = this.aslList;
    } else {
      if (this.isPayments) this.getAslPaymentsList();
      else this.getAslList();
    }
  },
  methods: {
    isEmpty,
    getUserInfo() {
      this.name = this.userFirstname ?? "";
      this.surname = this.userSurname ?? "";
      this.cf = this.taxCode ?? "";
      this.email = this.notifyContacts?.email ?? "";
      this.phone = this.notifyContacts?.phone ?? "";
      this.teamCode = this.userTeamCode ?? "";
    },
    async getAsrList() {
      try {
        let { data: asrList } = await getAsrList();
        this.$store.dispatch("setAsrList", { asrList });
        this.suggestedAslList = this.aslList;
      } catch (e) {}
    },
    async getAslList() {
      try {
        let { data: asrList } = await getAsrList();
        this.$store.dispatch("setAsrList", { asrList });
        this.suggestedAslList = this.aslList;
      } catch (e) {}
    },
    async getAslPaymentsList() {
      try {
        let { data: asrList } = await getAsrPayments();
        this.$store.dispatch("setAsrList", { asrList });
        this.suggestedAslList = this.aslList;
      } catch (e) {}
    },
    async getExceptionCodesList() {
      try {
        let codesResponse = await getExemptionCodes();
        this.exceptionCodesList = codesResponse.data;
      } catch (e) {}
    },
    async getTipologiesList() {
      this.serviceRequestTypes = SERVICES_TYPES;
    },
    async sendNewRequest(value) {
      this.isLoading = true;
      this.requestFeedback = {
        success: false,
        error: false
      };
      let serviceExtraInfo = this.getMsgInfo();
      let messageInfo = serviceExtraInfo
        ? `${this.desc} \r\n ${ADDITIONAL_INFO_LABEL} ${serviceExtraInfo}`
        : this.desc;

      try {
        let options = {
          asset_id: this.assetId,
          cittadino: {
            nome: this.name ?? this.userFirstname,
            cognome: this.surname ?? this.userSurname,
            codice_fiscale: this.cf ?? this.taxCode
          },
          tipologia: this.requestType.descrizione,
          email: this.email,
          telefono: this.phone,
          messaggio: {
            testo: messageInfo,
            allegato: null
          }
        };

        // AGGIUNTO GRUPPO ID
        if (this.isTest) {
          options.gruppo_id = this.asl ? this.asl.gruppo_id : CSI_GROUP.id;
        }

        if (this.attachment) {
          let base64 = await toBase64(this.attachment);
          let filename = this.attachment.name;

          options.messaggio.allegato = {
            nome_file: filename,
            base64: base64
          };
        }
        console.log(options);
        // Distinguiamo l'endpoint in base allo stato di login del'utente
        let endpoint = this.isUserLogged ? postRequestsAuth : postRequests;
        let response = await endpoint(options);
        this.newRequest = response.data;
        this.requestFeedback.success = true;
        this.isConfirmDialog = false;
        this.isOpenCheckEmailDialog = false;
      } catch (e) {
        // let message = "Non è stato possibile inviare la richiesta";
        // apiErrorNotify({e, message});
        this.requestFeedback.error = true;
      } finally {
        this.isLoading = false;
        this.otpData = null;
      }
    },

    async createNewRequest() {
      let isValid = this.$refs.formNew.validate();
      if (!isValid) {
        return;
      }
      this.sendNewRequest();
    },
    getCfList(arr) {
      let cfList = [];
      arr?.forEach(item => {
        if (!isEmpty(item.cf)) cfList.push(item.cf);
      });

      return cfList.length > 0 ? cfList.join(",") : "";
    },
    getMsgInfo() {
      let msg = "";
      if (this.isRol || this.isFse) {
        let aslMsg = this.asl
          ? `\r\nAzienda sanitaria: ${this.asl?.descrizione} - ${this.asl?.id}`
          : "";
        let examDateMsg = this.examDate
          ? `\r\nData visita/esame: ${this.examDate}`
          : "";
        let teamCodeMsg = this.teamCode
          ? `\r\nTessera sanitaria: ${this.teamCode}`
          : "";
        msg = `${aslMsg} ${examDateMsg} ${teamCodeMsg}`;
      }

      if (this.isEsenred) {
        let holdercf = this.holderCf
          ? `\r\nCodice fiscale del titolare: ${this.holderCf}`
          : "";
        //Controllo codici fiscali dei beneficiari
        let beneficiaryCfList = this.getCfList(this.beneficiaryCf);

        let beneficiaryCf = beneficiaryCfList
          ? `\r\nCodice fiscale del beneficiario: ${beneficiaryCfList}`
          : "";
        let exceptionCode = this.exceptionCode
          ? `\r\nCodice esenzione: ${this.exceptionCode}`
          : "";

        msg = `${holdercf} ${beneficiaryCf} ${exceptionCode}`;
      }
      if (this.isPrescriptions) {
        let nrPrescriptionMsg = this.nrPrescription
          ? `\r\nNumero NRE: ${this.nrPrescription}`
          : "";
        let typePrescriptionMsg = this.typePrescription
          ? `\r\nTipo di ricetta: ${this.typePrescription}`
          : "";
        let examDateMsg = this.examDate
          ? `\r\nData Ricetta: ${this.examDate}`
          : "";
        msg = `${nrPrescriptionMsg} ${typePrescriptionMsg} ${examDateMsg}`;
      }
      if (this.isPayments) {
        let aslMsg = this.asl
          ? `\r\nAzienda sanitaria: ${this.asl?.descrizione} - ${this.asl?.id}`
          : "";
        let cfMsg = `\r\nCodice fiscale intestatario del ticket: ${this.ticketCf}`;
        let idTicket = `\r\nIdentificativo Ticket/posizione debitoria: ${this.idPayment}`;
        msg = `${aslMsg} ${cfMsg} ${idTicket}`;
      }
      if (this.isDelegations) {
        //Controllo codici fiscali dei minori
        let minorCfList = this.getCfList(this.minorCf);

        let minorCf = minorCfList
          ? `\r\nCodice fiscale dei minori: ${minorCfList}`
          : "";
        let adultCf = this.adultCf
          ? `\r\nCodice fiscale del secondo soggetto: ${this.adultCf}`
          : "";

        msg = `${minorCf} ${adultCf}`;
      }
      if (this.isAccess && this.accessType) {
        msg = `\r\nSistema di accesso: ${this.accessType?.value}`;
      }
      if (this.isFfe) {
        let ticketYearMsg = this.ticketYear
          ? `\r\nAnno di riferimento ticket: ${this.ticketYear}`
          : "";
        let ticketNrMsg = this.nrTicket
          ? `\r\nNumero di ticket/cedola: ${this.nrTicket}`
          : "";
        msg = `${ticketYearMsg} ${ticketNrMsg}`;
      }
      if (this.isEscon) {
        let ticketYearMsg = this.ticketYear
          ? `\r\nAnno di riferimento ticket: ${this.ticketYear}`
          : "";
        let ticketNrMsg = this.nrTicket
          ? `\r\nNumero di ticket/cedola: ${this.nrTicket}`
          : "";
        let aslMsg = this.asl
          ? `\r\nAzienda sanitaria: ${this.asl?.descrizione} - ${this.asl?.id}`
          : "";
        msg = `${ticketYearMsg} ${ticketNrMsg} ${aslMsg}`;
      }

      if (this.isSolCovid) {
        let asl = this.asl
          ? `\r\nASL di domicilio: ${this.asl?.descrizione} - ${this.asl?.id}`
          : "";
        let swabTestDate = this.examDate
          ? `\r\nData tampone: ${this.examDate}`
          : "";
        let quarantineDate = this.quarantineDate
          ? `\r\nData di inizio quarantena/isolamento fiduciario: ${this.quarantineDate}`
          : "";
        msg = `${asl} ${swabTestDate} ${quarantineDate}`;
      }

      if(this.isFarab){
        let pharmacyName = this.pharmacyName
          ? `\r\nDenominazione farmacia: ${this.pharmacyName} `
          : "";
        msg = `${pharmacyName}`;
      }

      let assistanceTreeInfo = this.assistanceTree
        ? ` \r\n ${ASSISTANCE_TREE_PATH_TAG} ${this.assistanceTreeUrl}`
        : "";

      return msg + assistanceTreeInfo;
    },
    confirmDialog() {
      this.$refs.formNew.validate().then(success => {
        if (success) {
          if (this.isUserLogged) this.openConfirmRequestDialog();
          else this.openConfirmMailDialog();
        }
      });
    },
    openConfirmRequestDialog() {
      this.isConfirmDialog = true;
    },
    openConfirmMailDialog() {
      this.isConfirmMailDialog = true;
    },
    goToDetails() {
      this.$router.push({
        name: REQUEST_DETAIL.name,
        params: { requestid: this.newRequest.id }
      });
    },
    goToRequestsList() {
      this.$router.replace(REQUESTS_OPENED);
    },
    goToNewRequest() {
      this.newRequest = null;
      this.requestFeedback = null;
    },
    abortFilterByAsl() {},
    async filterByAsl(val, update, abort) {
      this.suggestedAslList = this.aslList;
      update(() => {
        const needle = val.toLowerCase();
        this.suggestedAslList = this.aslList.filter(
          v => v.descrizione.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async filterByYear(val, update, abort) {
      this.suggestedYearList = this.yearsOptions;
      update(() => {
        this.suggestedYearList = this.yearsOptions.filter(
          v => v.indexOf(val) > -1
        );
      });
    },
    rejectedFiles(rejectedEntries) {
      this.hasFileErrors = true;
    },
    onfocusFiles(evt) {
      this.hasFileErrors = false;
    },
    showPolicyList() {
      this.isPolicyModalOpen = true;
    },

    async sendOtpEmail() {
      this.otpData = null;
      this.verifyError = false;
      let data = { cf: this.cf, canale: "email", contatto: this.email };
      this.isSendingOtp = true;
      try {
        this.hasOtpCreationError = false;
        let response = await sendOtp(data);
        this.otpData = response.data;
        if (this.otpData) this.isOpenCheckEmailDialog = true;

        this.isConfirmMailDialog = false;
      } catch (e) {
        this.hasOtpCreationError = true;
      } finally {
        this.isSendingOtp = false;
      }
    },
    resetRequest() {
      console.log("reset");
      this.otpData = null;
      this.requestFeedback = null;
      this.isOpenCheckEmailDialog = false;
      this.isConfirmDialog = false;
    },
    addMinor() {
      this.minorCf.push({ cf: "" });
    },
    addBeneficiary() {
      this.beneficiaryCf.push({ cf: "" });
    }
  }
};
</script>
<style lang="sass">
.form-field__option-group
  .q-field__control-container
    padding-top: 32px !important

  .q-field__control
    &:before
      border-bottom: none !important

    &:after
      height: 0
</style>
