<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title class="q-mb-md">Differimento</lms-page-title>
      <q-card class="q-pa-md">
        <div class="q-pb-lg">Vaccini interessati: <strong>{{ vaccinationsName |capitalCase }}</strong></div>

        <!--scelta motivo -->

        <q-form ref="form" greedy @submit.prevent="" :class="$q.screen.lt.md ? 'q-gutter-lg' : 'q-gutter-md'">
          <q-select
            dense
            required
            no-error-icon
            label="Seleziona una motivazione"
            v-model="motivation"
            bottom-slots
            :options="optionsDifferiment"
            :rules="[ruleRequired]"
          />
          <!--          documento da allegare-->
          <div>
            <div class="q-mb-xs">
              <p class=" q-mb-none">
                Carica il documento che attesta il motivo del differimento
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
              lazy-rules="ondemand"
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
          <!--data -->
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
          <!--          soggetto emittente-->
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

          <!--note-->
          <q-input
            v-model="notes"
            type="textarea"
            label="Note per l'operatore"
            :max-height="200"
            dense
            rows="4"
          />
        </q-form>
      </q-card>


      <lms-buttons class="q-pt-md">
        <lms-button :loading="isSaving" @click="confirm">
          Invia richiesta
        </lms-button>
      </lms-buttons>
    </div>
    <lms-inner-loading :showing="isLoading" block/>
  </lms-page>
</template>

<script>
import {date, format} from "quasar";
import {capitalCase} from "change-case";
import {toBase64} from "../services/files";
import {apiErrorNotify} from "../services/utils";
import {
  getAppointmentList,
  getDefermentMotivations,
  getVaccinationUserInfo,
  newContribution
} from "../services/api";
import {DIFFERIMENT_SUCCESS} from "../router/routes";
import {vaccinationsList, vaccinationsNames} from "src/services/business-logic";
import {FORMAT_DATE} from "src/services/config";

const {extractDate, formatDate, getDateDiff} = date

export default {
  name: "PageVaccinationsDifferiment",
  components: {},
  props: {
    id: {required: false},
    exemption: {type: Object, required: false, default: () => undefined}
  },
  data() {
    return {
      FORMAT_DATE,
      showDocumentDateCalendar: false,
      fileAdded: null,
      isLoading: null,
      fileName: null,
      document: null,
      emittingSubject: null,
      alreadyVaccinated: false,
      fileUpload: false,
      motivation: null,
      appointment: null,
      documentStartDate: null,
      notes: "",
      requestSend: false,
      email: null,
      telefono: null,
      citizen: null,
      isSaving: false,
      motivations: [],
      maxDefaultDate: null

    };
  },
  computed: {
    notFuture() {
      let today = new Date();
      return v =>
        getDateDiff(extractDate(v, FORMAT_DATE), today) <= 0 ||
        "La data deve essere precedente ad oggi";
    },
    ruleValidDate() {
      return v => /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(v) || "Inserire una data valida";
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

    appointmentVaccinationList() {
      return vaccinationsList(this.appointment?.associazioni)
    },
    vaccinationsName() {
      return vaccinationsNames(this.appointmentVaccinationList)
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    optionsDifferiment() {
      if (this.motivations)
        return this.motivations.map(t => ({
          label: t.descrizione,
          value: t.codice
        }));
      return [];
    }
  },
  methods: {
    rangeDateOptions(calendarDate, format = 'YYYY/MM/DD') {
      let selectedDate = extractDate(calendarDate, format)
      return getDateDiff(selectedDate, new Date(), 'days') <= 0
    },
    onBack() {
      this.$router.go(-1);
    },

    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: "negative",
        message: `file non valido`
      });
    },
    onInputDocumentDate(val) {
      this.showDocumentDateCalendar = false
      this.documentStartDate = val
    },
    async onDocumentsAdded(file) {
      this.fileUpload = true;

      console.debug({addFile: file});

      try {
        let base64 = await toBase64(file);
        file.__base64 = base64.replace("data:application/pdf;base64,", "");
        this.document = base64;
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

      let vaccinazioni = this.appointmentVaccinationList.map(a => ({
        codice: a.codice,
        dose: ""
      }));


      let convocazione = this.appointment?.id_convocazione ?? "";
      let appuntamento = this.appointment?.id ?? "";

      let documentDate = extractDate(this.documentStartDate, FORMAT_DATE)
      let payload = {
        descrizione: this.notes,
        tipologia: "DIFFERIMENTO",
        motivazione: this.motivation.value,
        telefono: this.telefono,
        mail: this.email,
        id_convocazione: convocazione,
        id_appuntamento: appuntamento,
        vaccinazioni: vaccinazioni,
        soggetto_emittente: this.emittingSubject,
        data_emissione_documento: documentDate.toISOString(),
        documento_64: this.document,
        nome_documento: this.fileName
      };

      try {
        let contributionPromise = await newContribution(this.cf, payload);

        let params = null;

        params = {appuntamento: this.appointment};

        let name = DIFFERIMENT_SUCCESS.name;

        this.$router.push({name, params});
      } catch (e) {
        let message = "la richiesta di annullamento non è andata a buon fine";
        apiErrorNotify({e, message});
      }
      this.isSaving = false;
    }
  },

  async created() {
    this.isLoading = true;
    this.documentStartDate = formatDate(new Date(), FORMAT_DATE);
    this.maxDefaultDate = formatDate(new Date(), 'YYYY/MM')
    let citizen = this.$route?.params?.cittadino;

    if (!citizen) {
      try {
        let cittadinoPromise = await getVaccinationUserInfo(this.cf);
        citizen = cittadinoPromise.data;
      } catch (e) {
        let message = "Non è stato possibile recuperare i dati del cittadino";
        apiErrorNotify({e, message});
      }
    }

    this.citizen = citizen;
    this.email = this.citizen?.contatti_vaccinazioni?.email;
    this.telefono = this.citizen?.contatti_vaccinazioni?.telefono;

    let appointment = this.$route?.params?.appointment;

    if (!appointment) {

      let id = this.$route?.params?.id;
      let response = await getAppointmentList(this.cf);
      let appointmentList = response.data;
      appointment = appointmentList.filter(
        c => c.id.toString() === id.toString()
      )[0];
    }
    this.isLoading = false;
    this.appointment = appointment;
    if (!this.appointment) {
      this.onBack();
    }

    try {
      let responsePromise = await getDefermentMotivations();
      this.motivations = responsePromise.data;
      if (this.motivations.length === 0) {
        let message =
          "Non è stato possibile recuperare i dati delle motivazioni";
        apiErrorNotify({message});
      }
    } catch (e) {
      let message = "Non è stato possibile recuperare i dati delle motivazioni";
      apiErrorNotify({e, message});
    }
  }
};
</script>

<style></style>
