<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <div>
        <lms-page-title class="q-mb-md">Annulla appuntamento</lms-page-title>

        <q-card class="q-pa-md">
          <div class="q-pb-md">Vaccini interessati: <strong>{{ vaccinationsName | capitalCase }}</strong></div>

          <!--MOTIVAZIONE -->
          <q-form ref="form" greedy @submit.prevent="" :class="$q.screen.lt.md ? 'q-gutter-lg' : 'q-gutter-md'">
            <q-select
              dense
              required
              no-error-icon
              label="Seleziona una motivazione"
              v-model="motivation"
              bottom-slots
              emit-value
              map-options
              :options="optionsOmission"
              :rules="[ruleRequired]"
            />
            <!--          documento da allegare-->
            <div>
              <!-- inserimento file-->
              <div>
                <div class="q-mb-xs">
                  <p class=" q-mb-none">
                    Carica il documento che attesta il motivo dell'annullamento
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
              type="tel"
              v-model="phoneNumber"
              :placeholder="phoneNumber"
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
      </div>

      <lms-buttons class="q-pt-md">
        <lms-button :loading="isSaving" @click="confirm">
          Invia richiesta
        </lms-button>
      </lms-buttons>
    </div>
    <lms-inner-loading :showing="isLoading" block />
  </lms-page>
</template>

<script>
import { date } from "quasar";
import { capitalCase } from "change-case";
import {
  getAppointmentList,
  getConvocationList,
  getOmissionMotivations,
  getVaccinationUserInfo,
  newContribution
} from "../services/api";
import { OMISSION_SUCCESS } from "../router/routes";
import { apiErrorNotify } from "../services/utils";
import format from "quasar/src/utils/format";
import { toBase64 } from "../services/files";
import {vaccinationsList, vaccinationsNames} from "src/services/business-logic";
import {FORMAT_DATE} from "src/services/config";

const {extractDate, formatDate, getDateDiff} = date

export default {
  name: "PageVaccinationsOmission",
  components: {},
  data() {
    return {
      FORMAT_DATE,
      dateToShow: null,
      maxFileSIze: 1024 * 1024 * 10,
      fileAdded: null,
      isLoading: null,
      fileName: null,
      document: null,
      emittingSubject: null,
      fileUpload: false,
      motivation: null,
      appointment: null,
      documentStartDate: null,
      notes: "",
      email: null,
      phoneNumber: null,
      citizen: null,
      isSaving: false,
      motivations: [],
      emittingSubjectErr: false,
      documentErr: false,
      phoneErr: false,
      emailErr: false,
      motivationErr: false,
      releaseDateErr: false,
      mailErrorLabel: "Aggiungi almeno un contatto",
      documentErrLabel: "Documento obbligatorio",
      showDocumentDateCalendar:false,
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

    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    ruleValidDate() {
      return v => /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(v) || "Inserire una data valida";
    },
    contactsRequired() {
      let message = "Indica almeno uno dei contatti";
      let toFill = [this.email, this.phoneNumber];
      let someFilled = toFill.some(i => !!i);
      return v => someFilled || message;
    },

    notLetter() {
      return v => !v || /^\d+$/.test(v) || "Carattere non valido";
    },
    notValidMail() {
      return v => !v || v.indexOf("@") >= 0 || "mail non valida";
    },

    appointmentVaccinationList() {
      return this.appointment?.vaccini ?? []
    },
    vaccinationsName() {
      return vaccinationsNames(this.appointmentVaccinationList)
    },

    cf() {
      return this.$store.getters["getTaxCode"];
    },
    optionsOmission() {
      if (this.motivations)
        return this.motivations.map(t => ({
          label: t.descrizione,
          value: t.codice
        }));
      return [];
    }
  },
  methods: {
    onDocumentRemove() {
      this.fileUpload = false;
      this.documentErr = true;
      this.documentErrLabel = "Documento obbligatorio";
    },
    rangeDateOptions(calendarDate, format = 'YYYY/MM/DD') {
      let selectedDate = extractDate(calendarDate, format)
      return getDateDiff(selectedDate, new Date(), 'days') <= 0
    },
    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: "negative",
        message: `file non valido`
      });
    },

    onBack() {
      this.$router.go(-1);
    },
    onInputDocumentDate(val) {
      this.showDocumentDateCalendar = false
      this.documentStartDate = val
    },
    async onDocumentsAdded(file) {
      this.fileUpload = true;

      console.debug({ addFile: file });

      try {
        let base64 = await toBase64(file);
        file.__base64 = base64.replace("data:application/pdf;base64,", "");
        this.document = base64;
        this.fileName = file.name;
      } catch (e) {
        let message = "Si è verificato un errore nella lettura del file caricato";
        apiErrorNotify({ e, message });
      }
    },
    async confirm() {
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.isSaving = true;

      //perchè nel campo da passare non vuole descrizione e la dose non ce l'ho
      let vaccinazioni = this.appointmentVaccinationList.map(a => ({
        codice: a.codice,
        dose: ""
      }));


      let appuntamento = "";
      if (this.appointment.id_convocazione) {
        appuntamento = this.appointment.id_convocazione;
      }
      if (this.appointment.id) {
        appuntamento = this.appointment.id;
      }

      let documentDate = extractDate(this.documentStartDate, FORMAT_DATE)
      console.log(documentDate)
      let payload = {
        descrizione: this.notes,
        tipologia: "OMISSIONE",
        motivazione: this.motivation,
        telefono: this.phoneNumber,
        mail: this.email,
        id_convocazione: "",
        id_appuntamento: appuntamento,
        vaccinazioni: vaccinazioni,
        soggetto_emittente: this.emittingSubject,
        data_emissione_documento: documentDate.toISOString(),
        documento_64: this.document,
        nome_documento: this.fileName
      };

      try {
        let contributionPromise = await newContribution(this.cf, payload);

        let params = { appuntamento: this.appointment };

        let name = OMISSION_SUCCESS.name;

        this.$router.push({ name, params });
      } catch (e) {
        let message = "la richiesta di annullamento non è andata a buon fine";
        apiErrorNotify({ e, message });
      }
      this.isSaving = false;
    }
  },

  async created() {
    this.isLoading = true;
    this.documentStartDate = formatDate(new Date(), FORMAT_DATE);
    this.maxDefaultDate = formatDate(new Date(), 'YYYY/MM')

    let citizen = this.$route.params?.cittadino;

    if (!citizen) {
      try {
        let cittadinoPromise = await getVaccinationUserInfo(this.cf);
        citizen = cittadinoPromise.data;
      } catch (e) {
        let message = "Non è stato possibile recuperare i dati del cittadino";
        apiErrorNotify({ e, message });
      }
    }
    this.citizen = citizen;
    this.email = this.citizen?.contatti_vaccinazioni?.email;
    this.phoneNumber = this.citizen?.contatti_vaccinazioni?.telefono;

    let appointment = null

    let proposta = null;
    if (this.$route.params.convocation) {
      appointment = this.$route.params.convocation;
    }else{
      appointment = this.$route.params?.appointment;
    }

    if (!appointment) {
      let id = this.$route.params?.id;

      let response = await getAppointmentList(this.cf);
      let appointmentList = response.data;
      appointment = appointmentList.filter(
        c => c.id.toString() === id.toString()
      )[0];

      //se ancora non c' provo su convocazioni
      if (!appointment) {
        let response = await getConvocationList(this.cf);
        let appointmentList = response.data;
        appointment = appointmentList.filter(
          c => c.id_convocazione.toString() === id.toString()
        )[0];
      }
    }
    this.appointment = appointment;
    if (!this.appointment) {
      this.onBack();
    }
    // for (let i = 0; i < this.appointment.vaccini.length; i++) {
    //   this.vaccinationModel.push({
    //     vaccino: this.appointment.vaccini[i],
    //     value: false
    //   });
    // }

    try {
      let response = await getOmissionMotivations();
      this.motivations = response.data;
      if (this.motivations.length === 0) {
        let message =
          "Non è stato possibile recuperare i dati delle motivazioni";
        apiErrorNotify({
          message
        });
      }
    } catch (e) {
      let message = "Non è stato possibile recuperare i dati delle motivazioni";
      apiErrorNotify({ e, message });
    }

    this.isLoading = false;
  }
};
</script>

<style></style>
