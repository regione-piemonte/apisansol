<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>Nuova dichiarazione congiunta</lms-page-title>
    <template v-if="!isLoading">
      <lms-stepper
        ref="stepper"
        class="bg-transparent"
        flat
        v-model="currentStep"
        alternative-labels
        :contracted="$q.screen.lt.md"
        @step="onStep"
      >
        <!-- Step 1 -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-step
          title="Tipologia"
          :name="STEPS.TYPE"
          :disable="isTypeStepDisabled"
          prefix="1"
          :done="currentStep > STEPS.TYPE"
        >
          <!--           SELEZIONE MONO/MULTI GENITORE -->
          <!--           Per il momento commentiamo questa funzionalità -->
          <!--           A breve dovrebbero riabilitare il flusso MONOGENITORE -->
          <template v-if="isTest">
            <q-card class="q-mb-lg">
              <q-card-section>
                Vuoi attribuire una delega anche ad un altro genitore?
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="gutter-x-md">
                  <q-radio
                    v-model="declarationTypeSelected"
                    :val="DECLARATION_TYPES_CODES.PARENTS_MULTI"
                    label="Sì"
                  />
                  <q-radio
                    v-model="declarationTypeSelected"
                    :val="DECLARATION_TYPES_CODES.PARENTS_MONO"
                    label="No"
                  />
                </div>
              </q-card-section>
            </q-card>
          </template>

          <template
            v-if="
              declarationTypeSelected === DECLARATION_TYPES_CODES.PARENTS_MONO
            "
          >
            <lms-buttons class="q-mt-lg q-mb-md ">
              <lms-button label="Continua" @click="onStepDeclarationTypeNext" />
            </lms-buttons>
          </template>

          <template
            v-if="
              declarationTypeSelected === DECLARATION_TYPES_CODES.PARENTS_MULTI
            "
          >
            <q-banner class="h-banner h-banner--warning">
              <div class="text-body1">
                Attenzione, l'altro genitore deve avere assistenza sanitaria in
                Piemonte ed in possesso di credenziali SPID, accedere al
                servizio ed accettare la dichiarazione di genitorialità.
              </div>
            </q-banner>

            <!-- ELENCO GENITORI GIA' PRESENTI IN ALTRE DICHIARAZIONI -->
            <div class="row items-stretch q-col-gutter-md q-mt-md">
              <div
                v-for="parent in declarationOtherParentList"
                :key="parent.codice_fiscale"
                class="col-12 col-sm-6 col-lg-4 full-height"
              >
                <q-card class="fit">
                  <q-card-section>
                    <q-item class="no-padding">
                      <q-item-section avatar>
                        <q-icon size="xl" :name="avatarIcon(parent.sesso)" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-h6">
                          <strong
                            >{{ parent.cognome }} {{ parent.nome }}</strong
                          >
                        </q-item-label>
                        <q-item-label caption>{{
                          parent.codice_fiscale
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                  <q-card-actions class="q-pa-md">
                    <q-btn
                      color="primary"
                      class="full-width"
                      label="Scegli"
                      @click="onParentSelected(parent)"
                    />
                  </q-card-actions>
                </q-card>
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-card class="fit">
                  <q-card-section>
                    <q-item class="no-padding">
                      <q-item-section avatar>
                        <q-icon size="xl" :name="avatarIconAdd()" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-h6 text-weight-regular">
                          Inserisci i dati del nuovo genitore
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card-section>

                  <q-card-actions class="q-pa-md">
                    <q-btn
                      outline
                      color="primary"
                      class="full-width"
                      label="Nuovo genitore"
                      @click="onStepDeclarationTypeNext"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </template>
        </q-step>

        <!-- Step 2 -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-step
          title="Altro genitore"
          :name="STEPS.PARENT"
          prefix="2"
          :disable="isParentStepDisabled"
          :done="currentStep > STEPS.PARENT"
        >
          <q-card>
            <q-card-section>
              Dati dell'altro genitore
            </q-card-section>
            <q-card-section>
              <lms-form-person
                ref="formParent"
                :name.sync="parent.name"
                :surname.sync="parent.surname"
                :birth-date.sync="parent.birthDate"
                :birth-place.sync="parent.birthPlace"
                :tax-code.sync="parent.taxCode"
                :gender.sync="parent.gender"
                @has-warnings="onWarningParentStep"
              />
            </q-card-section>
          </q-card>

          <q-card
            transition-show="slide-right"
            transition-hide="slide-left"
            class="bg-transparent"
            v-if="showWarningAlertStep"
          >
            <q-banner class="h-banner h-banner--warning q-mt-lg">
              <div class="text-body1">
                <p>Ci sono dei campi che potrebbero essere sbagliati.</p>
                <p>Per favore, controlla prima di andare avanti</p>
                <div class="text-right">
                  <q-btn flat @click="onStepParentNext"
                    >Ok, ho controllato</q-btn
                  >
                </div>
              </div>
            </q-banner>
          </q-card>

          <lms-buttons v-else class="q-mt-lg">
            <lms-button
              label="Continua"
              :loading="isVerifyingParentStep"
              @click="onStepParentNext"
            />
            <lms-button outline label="Indietro" @click="onStepPrevious" />
            <template v-if="!isProduction">
              <q-btn-dropdown label="Imposta" color="orange" outline>
                <q-list link>
                  <q-item
                    clickable
                    v-close-popup
                    v-for="parent in PARENTS__"
                    :key="parent.codice_fiscale"
                    @click="setParent(parent)"
                  >
                    <q-item-section>
                      <q-item-label
                        >{{ parent.cognome }} {{ parent.nome }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </template>
          </lms-buttons>
        </q-step>

        <!-- Step 3 -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-step
          title="Figli"
          :name="STEPS.CHILDREN"
          prefix="3"
          :disable="isChildrenStepDisabled"
          :done="currentStep > STEPS.CHILDREN"
        >
          <transition-group
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <q-card
              v-for="(minor, index) in minors"
              :key="index"
              class="q-ma-sm"
            >
              <q-card-section class="q-title">
                <div class="row items-center justify-between">
                  <div class="col">Dati del minore #{{ index + 1 }}</div>
                  <div class="col-auto">
                    <q-btn
                      v-show="index > 0"
                      @click="removeMinor(minor, index)"
                      flat
                      round
                      dense
                      icon="close"
                    />
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <lms-form-person
                  ref="formChild"
                  :name.sync="minor.name"
                  :surname.sync="minor.surname"
                  :birth-date.sync="minor.birthDate"
                  :birth-place.sync="minor.birthPlace"
                  :tax-code.sync="minor.taxCode"
                  :gender.sync="minor.gender"
                  @has-warnings="val => onWarningMinorStep(val, index)"
                  is-minor
                  :parents-surname="controlParentSurname"
                />
                <template v-if="isMonoParent">
                  <lms-minor-upload-file
                    :documents.sync="minor.documents"
                    :error="$v.minors.$each[index].documents.$error"
                  >
                    <template v-slot:error>
                      <div v-if="!$v.minors.$each[index].documents.required">
                        Campo obbligatorio
                      </div>
                    </template>
                  </lms-minor-upload-file>
                </template>
              </q-card-section>

              <template v-if="!isProduction">
                <q-card-section>
                  <q-btn-dropdown label="Imposta" color="orange" outline>
                    <q-list link>
                      <q-item
                        clickable
                        v-close-popup
                        v-for="m in MINORS__"
                        :key="m.codice_fiscale"
                        @click="setMinor__(m, minor)"
                      >
                        <q-item-section>
                          <q-item-label
                            >{{ m.cognome }} {{ m.nome }}</q-item-label
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-card-section>
              </template>
            </q-card>
          </transition-group>

          <!-- AGGIUNGI MINORE -->
          <div class="text-center q-mt-lg q-px-sm">
            <lms-button secondary color="black" @click="addMinor">
              Vuoi aggiungere un altro minore alla dichiarazione?
            </lms-button>
          </div>

          <q-card
            transition-show="slide-right"
            transition-hide="slide-left"
            class="bg-transparent"
            v-if="showWarningAlertStep"
          >
            <q-banner class="h-banner h-banner--warning q-mt-lg">
              <div class="text-body1">
                <p>Ci sono dei campi che potrebbero essere sbagliati.</p>
                <p>Per favore, controlla prima di andare avanti</p>
                <div class="text-right">
                  <q-btn flat @click="onStepMinorNext"
                    >Ok, ho controllato</q-btn
                  >
                </div>
              </div>
            </q-banner>
          </q-card>
          <template v-else>
            <lms-buttons class="q-mt-lg q-mb-md ">
              <lms-button
                :loading="isVerifyingMinorStep"
                label="Continua"
                @click="onStepMinorNext()"
              />
              <lms-button outline label="Indietro" @click="onStepPrevious" />
            </lms-buttons>
          </template>
        </q-step>

        <!-- Step 4 -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-step
          title="Riepilogo"
          :name="STEPS.SUMMARY"
          prefix="4"
          :done="currentStep > STEPS.SUMMARY"
        >
          <!-- ALTRI GENITORI -->
          <template
            v-if="
              declarationTypeSelected !== DECLARATION_TYPES_CODES.PARENTS_MONO
            "
          >
            <q-card class="q-ma-sm">
              <q-card-section>
                <q-item class="no-padding">
                  <q-item-section avatar>
                    <q-icon size="xl" :name="avatarIcon(parent.gender)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      <strong>Dati altro genitore</strong>
                    </q-item-label>
                  </q-item-section>
                  <template v-if="!declarationToCopy">
                    <q-item-section side>
                      <q-btn @click="goToParent" flat round dense icon="edit" />
                    </q-item-section>
                  </template>
                </q-item>
              </q-card-section>

              <q-card-section>
                <lms-declaration-summary :person="parent" />
              </q-card-section>
            </q-card>
          </template>

          <!-- MINORI -->
          <q-card class="q-ma-sm q-mt-md">
            <div v-for="(minor, index) in minors" :key="index">
              <q-card-section>
                <q-item class="no-padding">
                  <q-item-section avatar>
                    <q-icon size="xl" :name="avatarIconMinor(minor.gender)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      <strong>Dati del minore n°{{ index + 1 }}</strong>
                    </q-item-label>
                  </q-item-section>
                  <template v-if="!declarationToCopy">
                    <q-item-section side v-if="index === 0">
                      <q-btn
                        @click="goToChildren"
                        flat
                        round
                        dense
                        icon="edit"
                      />
                    </q-item-section>
                  </template>
                </q-item>
              </q-card-section>
              <q-card-section>
                <lms-declaration-summary :person="minor" />
              </q-card-section>

              <!-- ATTO DI NASCITA E/O STATO DI FAMIGLIA -->
              <template v-if="isMonoParent">
                <template v-if="!declarationToCopy">
                  <q-card-section class="text-h6">
                    Atto di nascita o stato di famiglia
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-list no-border class="q-pt-none">
                      <q-item
                        v-for="document in minor.documents"
                        :key="document.name"
                        class="q-py-none"
                      >
                        <q-item-section side>
                          <q-icon size="sm" name="insert_drive_file" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ document.name }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </template>

                <!-- IN CASO DI RIATTIVAZIONE DELEGA MONOGENITORIALE -->
                <!-- IL CITTADINO DEVE RIALLEGARE IL DOCUMENTO -->
                <template v-else>
                  <lms-minor-upload-file
                    :documents.sync="minor.documents"
                    :error="$v.minors.$each[index].documents.$error"
                  >
                    <template v-slot:error>
                      <div v-if="!$v.minors.$each[index].documents.required">
                        Campo obbligatorio
                      </div>
                    </template>
                  </lms-minor-upload-file>
                </template>
              </template>

              <q-card-section v-if="index < minors.length - 1">
                <q-separator />
              </q-card-section>
            </div>
          </q-card>

          <!-- TERMINI E CONDIZIONI D'USO -->
          <q-card class="q-ma-sm q-mt-md">
            <q-card-section>
              <strong>Privacy e condizioni d'uso</strong>
            </q-card-section>

            <q-card-section>
              <div>
                <lms-policy src="files/delegations-minors.html" />
              </div>
              <q-toggle
                v-model="isDisclaimerAccepted"
                label="Dichiaro di aver preso visione e dell'informativa e di accettare le condizioni d'uso"
                class="q-mt-lg"
              />
            </q-card-section>
          </q-card>

          <lms-buttons class="q-my-md">
            <lms-button
              label="Conferma"
              :loading="isSavingDeclarations"
              @click="onConfirm"
            />
            <template v-if="!isDeclarationCopy">
              <lms-button outline label="Indietro" @click="onStepPrevious" />
            </template>
          </lms-buttons>
        </q-step>

        <!-- STEP 5 -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          title="Fine"
          :name="STEPS.END"
          prefix="5"
          :done="currentStep > STEPS.END"
        >
          <q-banner
            class="h-banner h-banner--positive  q-pa-md"
            v-if="minorsToPrint.length"
          >
            <div class="text-body1">
              <p>
                Hai inserito una dichiarazione congiunta di responsabilità
                genitoriale per i seguenti figli:
              </p>

              <ul>
                <li v-for="(minor, index) in minorsToPrint" :key="index">
                  <strong>{{ minor.nome }} {{ minor.cognome }}</strong>
                </li>
              </ul>

              <!-- Diciamo che la notifica è stata inoltrata all'altro genitore -->
              <!-- solo in caso di dichiarazioni multi genitore -->
              <template
                v-if="
                  declarationTypeSelected ===
                    DECLARATION_TYPES_CODES.PARENTS_MULTI
                "
              >
                <p>
                  Una notifica è stata inoltrata a
                  <strong>{{ parent.name }} {{ parent.surname }}</strong> per
                  completare la dichiarazione.
                </p>
              </template>
            </div>
          </q-banner>

          <q-banner
            v-if="minorsNotToPrint.length"
            class="q-mt-md h-banner h-banner--negative"
          >
            <div class="text-body1">
              <p>
                Non è stato possibile inserire la dichiarazione per i seguenti
                figli:
              </p>
              <ul>
                <li v-for="(minor, index) in minorsNotToPrint" :key="index">
                  <strong>{{ minor.name }} {{ minor.surname }}</strong>
                </li>
              </ul>
            </div>
          </q-banner>
          <div class="q-mt-md text-right">
            <q-btn :to="DECLARATION_MINOR_LIST" color="primary">
              Torna ai tuoi figli minori
            </q-btn>
          </div>
        </q-step>
      </lms-stepper>
    </template>

    <lms-inner-loading :showing="isLoading" />
  </lms-page>
</template>

<script>
import {
  DECLARATION_DETAIL_ROLE_CODES,
  DECLARATION_DETAILS_STATUS_CODES,
  DECLARATION_DOCUMENT_CODES,
  DECLARATION_MODE_CODES,
  DECLARATION_STATUS_CODES,
  DECLARATION_TYPES_CODES,
  EMPTY_PERSON
} from "src/services/config";
import { date } from "quasar";
import LmsStepper from "components/core/LmsStepper";
import {
  apiErrorNotify,
  capitalize,
  capitalizeEveryWord,
  deepClone,
  isStatusIn,
  toBase64,
  uniqueElementsBy
} from "src/services/utils";
import {
  getDeclarationMinorList,
  getDelegate,
  getPiedmontSupport,
  saveDeclaration
} from "src/services/api";
import LmsFormPerson from "components/LmsFormPerson";
import { DECLARATION_MINOR_LIST } from "src/router/routes";
import LmsDeclarationSummary from "components/LmsDeclarationSummary";
import LmsPolicy from "components/core/LmsPolicy";
import { getAvatarIcon, hasTrueValue } from "src/services/business-logic";
import LmsMinorUploadFile from "components/LmsMinorUploadFile";
const PARENTS__ = [
  {
    codice_fiscale: "XXXXXXXXXXXX",
    cognome: "COGNOME",
    data_nascita: "23/04/1992",
    comune_nascita: "COMUNE",
    nome: "NOME",
    sesso: "M"
  }
];
const MINORS__ = [
  {
    codice_fiscale: "XXXXXXXXXXXX",
    cognome: "COGNOME",
    data_nascita: "22/03/2008",
    comune_nascita: "COMUNE",
    nome: "NOME",
    sesso: "M",
    documents: []
  },

];
const STEPS = {
  TYPE: 1,
  PARENT: 2,
  CHILDREN: 3,
  SUMMARY: 4,
  END: 5
};
export default {
  name: "PageDeclarationMinorNew",
  components: {
    LmsMinorUploadFile,
    LmsPolicy,
    LmsDeclarationSummary,
    LmsFormPerson,
    LmsStepper
  },
  data() {
    return {
      PARENTS__,
      MINORS__,
      DECLARATION_MINOR_LIST,
      DECLARATION_TYPES_CODES,
      STEPS,
      showWarningAlertStep: false,
      isDisclaimerAccepted: false,
      isParentFormValid: false,
      isVerifyingParentStep: false,
      declarationToCopy: null,
      declarationList: [],
      // declarationTypeSelected: TYPES.PARENTS_MONO,
      declarationTypeSelected: DECLARATION_TYPES_CODES.PARENTS_MULTI,
      minorsValidations: [],
      parent: null,
      minors: [],
      isSavingDeclarations: false,
      parentList: [],
      start: false,
      isLoading: false,
      controlParentSurname: [],
      minorsToPrint: [],
      minorsNotToPrint: [],
      currentStep: STEPS.TYPE,
      submit: false,
      hasWarningsStep: false,
      hasWarningsChildStep: [],
      isVerifyingMinorStep: false
    };
  },

  created() {
    this.parent = deepClone(EMPTY_PERSON);
    this.minors.push(this.getDefaultMinor());
    this.hasWarningsChildStep.push(false);
  },
  validations() {
    return {
      minors: {
        $each: {
          documents: {
            required: doc => doc?.length > 0 || !this.isMonoParent
          }
        }
      }
    };
  },
  computed: {
    isTest(){
      return process.env.APP_IS_DEV || process.env.APP_IS_TEST
    },
    isMonoParent() {
      return (
        this.declarationTypeSelected === DECLARATION_TYPES_CODES.PARENTS_MONO
      );
    },
    isProduction() {
      return process.env.APP_IS_PROD;
    },
    user() {
      return this.$store.getters["getUser"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },

    isTypeStepDisabled() {
      return this.isDeclarationCopy;
    },
    isParentStepDisabled() {
      return (
        this.isDeclarationCopy ||
        this.declarationTypeSelected ===
          this.DECLARATION_TYPES_CODES.PARENTS_MONO
      );
    },
    isChildrenStepDisabled() {
      return this.isDeclarationCopy;
    },
    // L'elenco dei genitori usati in altre dichiarazioni
    declarationParentList() {
      let detailList = [];
      this.declarationList?.forEach(
        d => (detailList = detailList.concat(d.dettagli))
      );

      let parentList = detailList.map(d => d.genitore_tutore_curatore);
      return uniqueElementsBy(
        parentList,
        (a, b) => a.codice_fiscale === b.codice_fiscale
      );
    },
    // L'elenco dei genitori usati in altre dichiarazioni che NON sono il cittadino loggato
    declarationOtherParentList() {
      let otherParentList = this.declarationParentList.filter(
        d => d.codice_fiscale !== this.taxCode
      );
      return otherParentList;
    },
    isDeclarationCopy() {
      return !!this.declarationToCopy;
    },
    canShowOtherParentList() {
      return (
        !this.isDeclarationCopy && this.declarationOtherParentList.length > 0
      );
    }
  },
  async mounted() {
    let { declaration, dettagli } = this.$route.params;

    this.declarationToCopy = declaration;
    this.declarationList = dettagli;

    // se non ci hanno già passato tutte le dichiarazioni => proviamo a scaricarle
    if (!this.declarationList) {
      this.isLoading = true;

      try {
        let response = await getDeclarationMinorList(this.taxCode);
        this.declarationList = response.data || [];
      } catch (err) {
        // non siamo riusciti ad ottenere l'elenco delle dichiarazioni.
        // Quindi non possiamo precompilare l'elenco di genitori già usati
        console.error(err);
      }

      this.isLoading = false;
    }

    // Vogliamo creare una nuova dichiarazione partendo da una già esistente
    if (this.declarationToCopy) {
      let declarationType =
        this.declarationToCopy.tipo && this.declarationToCopy.tipo.codice;
      // let cittadino = this.declarationToCopy.cittadino;
      let minore =
        this.declarationToCopy.dettagli[0] &&
        this.declarationToCopy.dettagli[0].figlio_tutelato_curato;
      let genitore0 =
        this.declarationToCopy.dettagli[0] &&
        this.declarationToCopy.dettagli[0].genitore_tutore_curatore;
      let genitore1 =
        this.declarationToCopy.dettagli[1] &&
        this.declarationToCopy.dettagli[1].genitore_tutore_curatore;

      if (declarationType) {
        this.declarationTypeSelected = declarationType;
      }

      // if (cittadino && this.user.cf !== cittadino.codice_fiscale) {
      //   this.useTheSameParent(cittadino, true)
      // } else if (genitore1 && this.user.cf !== genitore1.codice_fiscale) {
      if (genitore1 && this.taxCode !== genitore1.codice_fiscale) {
        this.useTheSameParent(genitore1, true);
      } else {
        this.useTheSameParent(genitore0, true);
      }

      let minor = this.getDefaultMinor();
      minor.name = capitalize(minore.nome, true);
      minor.surname = capitalizeEveryWord(minore.cognome, true);
      minor.birthDate = minore.data_nascita;
      minor.birthPlace = minore.comune_nascita;
      minor.taxCode = minore.codice_fiscale;
      minor.gender = minore.sesso;
      this.minors = [minor];

      // this.minors[0] = {
      //   name: capitalize(minore.nome, true),
      //   surname: capitalizeEveryWord(minore.cognome, true),
      //   birthDate: minore.data_nascita,
      //   birthPlace: minore.comune_nascita,
      //   taxCode: minore.codice_fiscale,
      //   gender: minore.sesso,
      //   documents: []
      // }

      // Non ho capito il motivo, ma senza $nextTick $refs.stepper === undefined
      this.$nextTick(() => {
        this.currentStep = STEPS.SUMMARY;
      });
    }
    if (this.parent) this.parent.gender = this.checkGender();
  },
  methods: {
    onWarningParentStep(val) {
      this.hasWarningsStep = val;
    },
    onWarningMinorStep(val, index) {
      this.hasWarningsChildStep[index] = val;
    },
    async isParentStepValid() {
      this.$refs.formParent.$v.$touch();
      if (this.$refs.formParent.$v.$error) return false;
      // E' possibile creare una dichiarazione solo con altri genitori piemontesi
      try {
        let response = await getPiedmontSupport(this.parent.taxCode);
      } catch (err) {
        // Se la chiamata fallisce vuol dire che il cittadino NON è su AURA
        let message =
          "L'altro genitore deve avere assistenza sanitaria in piemonte";
        apiErrorNotify({ message });
        return false;
      }
      this.generateSurnameToControl();
      this.parent.name = capitalize(this.parent.name, true);
      this.parent.surname = capitalizeEveryWord(this.parent.surname, true);
      if (this.hasWarningsStep) {
        if (this.showWarningAlertStep) {
          return true;
        } else {
          this.showWarningAlertStep = true;
          return false;
        }
      }
      return true;
    },
    onStepDeclarationTypeNext() {
      let step =
        this.declarationTypeSelected ===
        this.DECLARATION_TYPES_CODES.PARENTS_MONO
          ? STEPS.CHILDREN
          : STEPS.PARENT;
      this.currentStep = step;
    },

    async onStepParentNext() {
      this.isVerifyingParentStep = true;
      let isValid = await this.isParentStepValid();
      this.isVerifyingParentStep = false;
      if (isValid) {
        this.currentStep = STEPS.CHILDREN;
      }
    },
    isMinorStepValid() {
      this.$v.minors.$touch();
      for (let i = 0; i < this.$refs.formChild.length; i++) {
        let form = this.$refs.formChild[i];
        form.$v.$touch();
        if (form.$v.$error || this.$v.minors.$error) {
          return false;
          break;
        }
      }

      if (hasTrueValue(this.hasWarningsChildStep)) {
        if (this.showWarningAlertStep) {
          return true;
        } else {
          this.showWarningAlertStep = true;
          return false;
        }
      }

      return true;
    },
    onStepMinorNext() {
      this.isVerifyingMinorStep = true;
      let isValid = this.isMinorStepValid();
      this.isVerifyingMinorStep = false;
      if (isValid) {
        this.minors.map(minor => {
          minor.name = capitalize(minor.name, true);
          minor.surname = capitalizeEveryWord(minor.surname, true);
        });
        this.currentStep = STEPS.SUMMARY;
      }
    },
    async goToChildren() {
      this.currentStep = STEPS.CHILDREN;
    },
    goToParent() {
      this.currentStep = STEPS.PARENT;
    },
    goToSummary() {
      this.currentStep = STEPS.SUMMARY;
    },
    onStepPrevious() {
      this.$refs.stepper.previous();
    },
    // onStepMinorNext() {
    //   this.isMinorsStepValid() && this.$refs.stepper.next()
    // },
    setParent(parent) {
      this.parent.name = capitalize(parent.nome, true);
      this.parent.surname = capitalizeEveryWord(parent.cognome, true);
      this.parent.birthDate = parent.data_nascita;
      this.parent.birthPlace = parent.comune_nascita;
      this.parent.taxCode = parent.codice_fiscale;
      this.parent.gender = parent.sesso;
    },
    setMinor__(minor, currentMinor) {
      currentMinor.name = capitalize(minor.nome, true);
      currentMinor.surname = capitalizeEveryWord(minor.cognome, true);
      currentMinor.birthDate = minor.data_nascita;
      currentMinor.birthPlace = minor.comune_nascita;
      currentMinor.taxCode = minor.codice_fiscale;
      currentMinor.gender = minor.sesso;
    },
    onParentSelected(parent) {
      this.setParent(parent);
      this.generateSurnameToControl();
      this.currentStep = STEPS.CHILDREN;
    },

    onStep(step) {
      this.hasWarningsStep = false;
      // Al cambio di step resettiamo gli errori
      this.showWarningAlertStep = false;

      // Se ci stiamo muovendo verso lo step dei minori
      // rimuoviamo tutti i documenti selezionati perché al momento
      // il componente di Quasar non ci permette di impostare dei files
      if (step === STEPS.CHILDREN) {
        this.minors.forEach(m => {
          m.documents = [];
        });
      }
    },
    useTheSameParent(parent, flag) {
      //setto il parente che mi passo dalla route
      this.parent.name = capitalize(parent.nome, true);
      this.parent.surname = capitalizeEveryWord(parent.cognome, true);
      this.parent.birthDate = parent.data_nascita;
      this.parent.birthPlace = parent.comune_nascita;
      this.parent.taxCode = parent.codice_fiscale;
      this.parent.gender = parent.sesso;
      this.generateSurnameToControl();
      if (!flag) this.$refs.stepper.next();
    },
    generateSurnameToControl() {
      if (this.isMonoParent) this.controlParentSurname = [];
      else {
        let parents = [
          {
            surname: this.user?.cognome,
            gender: this.user?.profile?.info_anag.dati_primari.sesso
          },
          { surname: this.parent?.surname, gender: this.parent?.gender }
        ];
        let parent1 = parents[0];
        let parent2 = parents[1];
        // Basta che il minore abbia il cognome di almeno uno dei due genitori
        // Quindi va bene se il minore ha:
        //    Cognome del genitore 1
        //    Cognome del genitore 2
        //    Cognome del genitore 1 + cognome del genitore 2
        //    Cognome del genitore 2 + cognome del genitore 1
        let result = [
          parent1.surname,
          parent2.surname,
          `${parent1.surname} ${parent2.surname}`,
          `${parent2.surname} ${parent1.surname}`
        ];
        this.controlParentSurname = result;
      }
    },
    async getSaveDeclarationDataMono(minor) {
      let document = minor.documents[0];
      let base64 = await toBase64(document);

      let me = {
        codice_fiscale: this.taxCode
      };

      let minorData = { codice_fiscale: minor.taxCode };

      let myDetail = {
        stato: { codice: DECLARATION_DETAILS_STATUS_CODES.CONFIRM_WAITING },
        genitore_tutore_curatore: { codice_fiscale: this.user.cf },
        ruolo_genitore_tutore_curatore: {
          codice: DECLARATION_DETAIL_ROLE_CODES.PARENT_1
        },
        figlio_tutelato_curato: minorData,
        ruolo_figlio_tutelato_curato: {
          codice: DECLARATION_DETAIL_ROLE_CODES.CHILD
        },
        documento_famiglia: {
          tipo: {
            // TODO: sostituire con atto di nascita
            codice: DECLARATION_DOCUMENT_CODES.IDENTITY_CARD
          },
          file: {
            nome: document.name,
            dimensione_in_bytes: document.size,
            base_file: base64
          }
        }
      };

      let data = {
        // tipo: {codice: 'CONGIUNTA'},
        tipo: { codice: DECLARATION_TYPES_CODES.PARENTS_MONO },
        stato: { codice: DECLARATION_STATUS_CODES.CONFIRM_WAITING },
        modo: { codice: DECLARATION_MODE_CODES.ONLINE },
        cittadino: me,
        dettagli: [myDetail]
      };

      return data;
    },
    async getSaveDeclarationDataMulti(parent1TaxCode, parent2, minor) {
      let minorData = { codice_fiscale: minor.taxCode };
      let parent2Data = { codice_fiscale: parent2.taxCode };

      let myDetail = {
        stato: { codice: DECLARATION_DETAILS_STATUS_CODES.TO_APPROVE },
        genitore_tutore_curatore: { codice_fiscale: parent1TaxCode },
        ruolo_genitore_tutore_curatore: {
          codice: DECLARATION_DETAIL_ROLE_CODES.PARENT_1
        },
        figlio_tutelato_curato: minorData,
        ruolo_figlio_tutelato_curato: {
          codice: DECLARATION_DETAIL_ROLE_CODES.CHILD
        }
      };

      let otherDetail = {
        stato: { codice: DECLARATION_DETAILS_STATUS_CODES.TO_APPROVE },
        genitore_tutore_curatore: parent2Data,
        ruolo_genitore_tutore_curatore: {
          codice: DECLARATION_DETAIL_ROLE_CODES.PARENT_2
        },
        figlio_tutelato_curato: minorData,
        ruolo_figlio_tutelato_curato: {
          codice: DECLARATION_DETAIL_ROLE_CODES.CHILD
        }
      };

      let data = {
        // tipo: {codice: 'CONGIUNTA'},
        tipo: { codice: DECLARATION_TYPES_CODES.PARENTS_MULTI },
        stato: { codice: DECLARATION_STATUS_CODES.TO_COMPLETE },
        modo: { codice: DECLARATION_MODE_CODES.ONLINE },
        dettagli: [myDetail, otherDetail]
      };

      return data;
    },
    async getSaveDeclarationData(parent1TaxCode, parent2, minor) {
      return this.declarationTypeSelected ===
        DECLARATION_TYPES_CODES.PARENTS_MONO
        ? this.getSaveDeclarationDataMono(minor)
        : this.getSaveDeclarationDataMulti(parent1TaxCode, parent2, minor);
    },
    isResumeStepValid() {
      if (!this.isDisclaimerAccepted) {
        let message = `Non puoi andare avanti senza accettare l'informativa`;
        apiErrorNotify({ message });
      }
      return this.isDisclaimerAccepted;
    },
    async onConfirm() {
      if (this.declarationToCopy) {
        this.$v.minors.$touch();
        if (this.$v.minors.$error) return;
      }
      if (!this.isResumeStepValid()) return;

      // Generiamo una lista di dichiarazioni da salvare
      let declarations = [];
      for (let i = 0; i < this.minors.length; i++) {
        let minor = this.minors[i];
        let data = await this.getSaveDeclarationData(
          this.taxCode,
          this.parent,
          minor
        );
        declarations.push(data);
      }

      let promises = declarations.map(declaration =>
        saveDeclaration(this.taxCode, declaration)
      );

      this.isSavingDeclarations = true;

      let responses = await Promise.all(
        promises.map(p => {
          return p
            .then(data => {
              this.minorsToPrint.push(
                data.data.dettagli[0].figlio_tutelato_curato
              );
            })
            .catch(error => {
              if (error.response.status !== 502) {
                let message = "Non è stato possibile modificare alcune deleghe";
                apiErrorNotify({ error, message });
              }
            });
        })
      );

      this.minorsToPrint = this.minorsToPrint.map(minor => {
        minor.nome = capitalize(minor.nome, true);
        minor.cognome = capitalizeEveryWord(minor.cognome, true);
        return minor;
      });

      this.$refs.stepper.next();

      if (this.minorsToPrint.length !== this.minors.length) {
        if (this.minorsToPrint.length > 0) {
          this.minorsNotToPrint = this.minors.filter(obj => {
            return this.minorsToPrint.some(obj2 => {
              return obj.taxCode !== obj2.codice_fiscale;
            });
          });
          this.minorsNotToPrint = this.minorsNotToPrint.map(minor => {
            minor.nome = capitalize(minor.nome, true);
            minor.cognome = capitalizeEveryWord(minor.cognome, true);
          });
        } else this.minorsNotToPrint = this.minors;
      }

      this.isSavingDeclarations = false;
    },
    getDefaultMinor() {
      let params = deepClone(EMPTY_PERSON);
      params.documents = [];
      return params;
    },
    addMinor() {
      this.hasWarningsChildStep.push(false);
      this.minors.push(this.getDefaultMinor());
    },
    removeMinor(minor, index) {
      this.hasWarningsChildStep.splice(index, 1);
      this.minors.splice(index, 1);
    },
    checkGender() {
      let gender = this.user?.profile?.info_anag.dati_primari?.sesso;
      return gender === "M" ? "F" : "M";
    },
    avatarIcon(gender) {
      return getAvatarIcon(gender);
    },
    avatarIconMinor(gender) {
      return getAvatarIcon(gender, true);
    },
    avatarIconAdd() {
      return getAvatarIcon(this.parent?.gender, false, true);
    },
    setMinorDocument(minor, documents) {
      minor.documents = documents;
    }
  }
};
</script>

<style scoped></style>
