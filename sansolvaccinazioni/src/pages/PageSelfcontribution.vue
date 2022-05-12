<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <div>
        <lms-page-title class="q-mb-md"
        >Comunicazione vaccinazioni pregresse
        </lms-page-title
        >
        <q-card>
          <q-card-section>

            <q-form ref="form" greedy @submit.prevent="" :class="$q.screen.lt.md ? 'q-gutter-lg' : 'q-gutter-md'">
              <div class="q-pb-md">
                Puoi caricare file relativi alla tua storia vaccinale pregressa.
                Questi saranno resi visibili agli operatori e tenuti in conto per
                le proposte sui nuovi vaccini da effettuare.
              </div>

            <!--   DOCUMENTO DA ALLEGARE  -->

              <div>
                <div class="q-mb-xs">
                  <p class=" q-mb-none">
                    Carica il documento desiderato
                  </p>
                  <a class=" lms-link cursor-pointer" style="color: blue">
                    Quali documenti posso allegare?
                    <q-tooltip
                    ><p class="q-mb-sm">
                      Puoi caricare documenti di massimo 10MB e risulteranno
                      validi solo in presenza di
                      <strong>firma digitale</strong>(.p7m).
                    </p>
                      Se non ne sei in possesso, puoi prenotare un appuntamento al
                      Centro Vaccinale e presentare la documentazione all'operatore
                      per la validazione.
                    </q-tooltip>
                  </a>
                </div>

                <!-- inserimento file-->
                <q-file
                  dense
                  max-file-size="10485760"
                  accept=".pdf, .p7m"
                  @rejected="onRejected"
                  v-model="fileAdded"
                  bottom-slots
                  no-error-icon
                  @input="onDocumentsAdded"
                  required
                  label="* Upload documento"
                  :rules="[ruleRequired]"
                >
                  <template v-slot:append>
                    <q-icon name="add" @click.stop class="cursor-pointer"/>
                  </template>
                  <template v-slot:hint>
                    <div> Seleziona un documento di massimo 10 MB</div>
                  </template>
                </q-file>
              </div>

              <!-- DATA -->
              <q-input
                dense
                no-error-icon
                required
                bottom-slots
                mask="##/##/####"
                @input="onInputDocumentDate"
                placeholder="gg/mm/aaaa"
                label="Data rilascio documentazione"
                v-model="documentStartDate"
                :rules="[ruleRequired, ruleValidDate, notFuture]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="examDateProxy" v-model="showDocumentDateCalendar">
                      <q-date
                        :value="documentStartDate"
                        minimal
                        :mask=FORMAT_DATE
                        @input="onInputDocumentDate"
                        :options="rangeDateOptions"
                        :navigation-max-year-month="maxDefaultDate"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>


              <!--          SOGGETTO EMITTENTE-->

              <q-input
                dense
                bottom-slots
                no-error-icon
                required
                v-model="emittingSubject"
                label="Soggetto che ha emesso il documento"
                :rules="[ruleRequired]"
              />

              <!--      contatti-->
              <q-input
                dense
                required
                bottom-slots
                no-error-icon
                type="email"
                :value="email"
                v-model="email"
                :placeholder="email"
                label="Email"
                :rules="[contactsRequired,   v => $rules.email(v) || 'L\'email inserita non è valida']"
              ></q-input>
              <!--            <q-item-side icon="phone" color="secondary"></q-item-side>-->
              <q-input
                :value="telefono"
                type="tel"
                v-model="telefono"
                :placeholder="telefono"
                required
                dense
                no-error-icon
                unmasked-value
                mask="### ### ## ##"
                prefix="+39"
                bottom-slots
                label="Numero di telefono"
                :rules="[contactsRequired]"
              ></q-input>

              <!--NOTE-->
              <q-input
                v-model="notes"
                type="textarea"
                label="Note per l'operatore"
                :max-height="200"
                dense
                rows="4"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <lms-buttons class="q-pt-md">
        <lms-button :loading="isSaving" @click="confirm">
          Carica file
        </lms-button>
      </lms-buttons>
    </div>
    <lms-inner-loading :showing="isLoading" block/>
  </lms-page>
</template>

<script>
import {date} from "quasar";
import {toBase64} from "../services/files";
import {apiErrorNotify} from "../services/utils";
import {getVaccinationUserInfo, newContribution} from "../services/api";
import {SELFCONTRIBUTION_SUCCESS} from "../router/routes";
import {FORMAT_DATE} from "src/services/config";
const {extractDate, formatDate, getDateDiff} = date
export default {
  name: "PageAutocontribution",
  components: {},
  props: {
    id: {required: false},
    exemption: {type: Object, required: false, default: () => undefined}
  },
  data() {
    return {
      FORMAT_DATE,
      fileAdded: null,
      isLoading: null,
      fileName: null,
      document: null,
      emittingSubject: null,
      fileUpload: false,
      documentStartDate:null,
      notes: "",
      email: null,
      telefono: null,
      citizen: null,
      isSaving: false,
      showDocumentDateCalendar:false,
      maxDefaultDate:null
    };
  },
  computed: {
    notFuture() {
      let today = new Date();
      return v =>
        getDateDiff(extractDate(v, FORMAT_DATE), today) <= 0 ||
        "La data deve essere precedente ad oggi";
    },

    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    contactsRequired() {
      let message = "Indica almeno uno dei contatti";
      let toFill = [this.email, this.telefono];
      let someFilled = toFill.some(i => !!i);
      return v => someFilled || message;
    },
    notLetter() {
      return v => !v || /^\d+$/.test(v) || "Carattere non valido";
    },
    notValidMail() {
      return v => !v || v.indexOf("@") >= 0 || "mail non valida";
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    ruleValidDate() {
      return v => /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(v) || "Inserire una data valida";
    },
  },
  methods: {
    rangeDateOptions(calendarDate, format = 'YYYY/MM/DD') {
      let selectedDate = extractDate(calendarDate, format)
      return getDateDiff(selectedDate, new Date(), 'days') <= 0
    },
    onInputDocumentDate(val) {
      this.showDocumentDateCalendar = false
      this.documentStartDate = val
    },

    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: "negative",
        message: `file non valido`
      });
    },

    async onDocumentsAdded(file) {
      this.fileUpload = true;

      console.debug({addFile: file});

      try {
        let base64 = await toBase64(file);
        file.__base64 = base64.replace("data:application/pdf;base64,", "");
        this.document = file.__base64;
        this.fileName = file.name;
      } catch (e) {
        let message = "Si è verificato un errore nella lettura del file caricato";
        apiErrorNotify({e, message});
      }
    },

    async confirm() {
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.isSaving = true;

      let dateToSend = extractDate(this.documentStartDate, FORMAT_DATE)

      let payload = {
        descrizione: this.notes,
        tipologia: "COMUNICAZIONE",
        telefono: this.telefono,
        mail: this.email,
        soggetto_emittente: this.emittingSubject,
        data_emissione_documento: dateToSend.toISOString(),
        documento_64: this.document,
        nome_documento: this.fileName
      };

      try {
        let contributionPromise = await newContribution(this.cf, payload);

        let name = SELFCONTRIBUTION_SUCCESS.name;

        this.$router.push({name});
      } catch (e) {
        let message = "L'upload non è andato a buon fine";
        apiErrorNotify({e, message});
      }
      this.isSaving = false;
    }
  },

  async created() {
    this.isLoading = true;
    this.maxDefaultDate = formatDate(new Date(), 'YYYY/MM')
    this.documentStartDate = formatDate(new Date(), FORMAT_DATE)

    let {citizen} = this.$route.params

    if (!citizen) {
      try {
        let citizenPromise = await getVaccinationUserInfo(this.cf);
        citizen = citizenPromise.data;
      } catch (e) {
        let message = "Non è stato possibile recuperare i dati del cittadino";
        apiErrorNotify({e, message});
      }
    }

    if(citizen){
      this.citizen = citizen;
      this.email = this.citizen.contatti_vaccinazioni?.email;
      this.telefono = this.citizen.contatti_vaccinazioni?.telefono;
    }

    this.isLoading = false;
  }
};
</script>

<style></style>
