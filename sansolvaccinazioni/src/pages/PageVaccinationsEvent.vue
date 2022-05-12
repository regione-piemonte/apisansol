<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title class="q-mb-md"
        >Segnalazione reazione avversa</lms-page-title
      >

      <q-banner class="q-mb-md q-banner--info">
        <div class="text-body1 ">
          Se in seguito alla vaccinazione per:
          {{ vaccinationsName }} effettuata il
          {{ administration.data_appuntamento | date }}
          hai manifestato una sospetta reazione avversa, puoi inviare una segnalazione spontanea compilando i campi
          sottostanti.
        </div>
      </q-banner>

      <q-card>
        <q-card-section>
          <!--        tipologia reazione-->
          <q-form ref="form" greedy @submit.prevent="" :class="$q.screen.lt.md ? 'q-gutter-lg' : 'q-gutter-md'">
            <q-select
              required
              dense
              no-error-icon
              bottom-slots
              v-model="typeSelected"
              emit-value
              map-options
              :options="typologyOptions"
              label="Seleziona una tipologia di reazione avversa"
              :rules="[v=> $rules.required(v) || 'Segnala la tipologia']"
            >
            </q-select>
            <!--        farmaco concomitante-->
            <q-input
              type="text"
              dense
              no-error-icon
              bottom-slots
              v-model="medicine"
              label="Eventuale farmaco concomitante"
            ></q-input>
            <!--      data reazione-->
            <q-input
              dense
              no-error-icon
              required
              bottom-slots
              mask="##/##/####"
              @input="onInputDate"
              placeholder="gg/mm/aaaa"
              label="Data reazione avversa"
              v-model="dateReaction"
              :rules="[ruleRequired, ruleValidDate, notFuture]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="examDateProxy" v-model="showDateCalendar">
                    <q-date
                      :value="dateReaction"
                      minimal
                      :mask=FORMAT_DATE
                      @input="onInputDate"
                      :options="rangeDateOptions"
                      :navigation-max-year-month="maxDefaultDate"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!--      contatti-->

            <q-input
              type="email"
              required
              dense
              bottom-slots
              no-error-icon
              :value="email"
              v-model="email"
              :placeholder="email"
              label="Email"
              :rules="[contactsRequired, v => $rules.email(v) || 'L\'email inserita non è valida']"
            ></q-input>

            <q-input
              :value="telefono"
              type="tel"
              required
              dense
              bottom-slots
              no-error-icon
              unmasked-value
              mask="### ### ## ##"
              prefix="+39"
              v-model="telefono"
              :placeholder="telefono"
              label="Numero di telefono"
              :rules="[contactsRequired]"
            ></q-input>

            <!--        note-->
            <q-input
              v-model="note"
              type="textarea"
              label="Note per l'operatore"
              rows="3"
            >
            </q-input>
          </q-form>
        </q-card-section>

      </q-card>

      <div class="q-mt-md">
        <lms-buttons>
          <lms-button :loading="isSaving" @click="onSave">Salva</lms-button>
        </lms-buttons>
      </div>
    </div>

    <lms-inner-loading :showing="isLoading" block />
  </lms-page>
</template>

<script>
import { date } from "quasar";
import {
  createReaction,
  getAdministrationList,
  getReactionTypeList
} from "../services/api";
import { EVENT_SUCCESS } from "../router/routes";
import {apiErrorNotify, startCase} from "../services/utils";
import { capitalCase } from "change-case";
import {FORMAT_DATE} from "src/services/config";
const {extractDate, formatDate, getDateDiff} = date

export default {
  name: "PageVaccinationsEvent",
  components: {},
  props: {
    id: { required: false },
    exemption: { type: Object, required: false, default: () => undefined }
  },
  data() {
    return {
      FORMAT_DATE,
      //vaccinazione di prova da visualizzare quando la pagina viene ricaricata
      isLoading: false,
      administration: null,
      vaccinationsName: "",
      typeSelected: null,
      typologyList: null,
      dateReaction:null,
      citizen: null,
      email: null,
      telefono: null,
      note: null,
      medicine: null,
      isSaving: false,
      showDateCalendar:false,
      maxDefaultDate:null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },
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
    notValidMail() {
      return v => !v || v.indexOf("@") >= 0 || "mail non valida";
    },
    typologyOptions() {
      if (this.typologyList) {
        return this.typologyList.map(s => ({
          label: s.descrizione,
          value: s.codice,
          model: s
        }));
      } else return [];
    }
  },
  methods: {
    rangeDateOptions(calendarDate, format = 'YYYY/MM/DD') {
      let selectedDate = extractDate(calendarDate, format)
      return getDateDiff(selectedDate, new Date(), 'days') <= 0
    },
    onInputDate(val) {
      this.showDateCalendar = false
      this.dateReaction = val
    },
    onBack() {
      this.$router.go(-1);
    },
    async onSave() {
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      this.isSaving = true;

      let dateToSend = extractDate(this.dateReaction, FORMAT_DATE);

      let payload = {
        telefono: this.telefono,
        mail: this.email,
        farmaco: this.medicine,
        note: this.note,
        data_reazione: dateToSend.toISOString(),
        tipologia: this.typeSelected,
        id_vaccinazione: this.administration.id
      };

      try {
        let reactionPromise = await createReaction(this.cf, payload);

        let name = EVENT_SUCCESS.name;

        this.$router.push({ name });
      } catch (e) {
        let message = "Non è stato possibile segnalare la reazione avversa";
        apiErrorNotify({ e, message });
      }
      this.isSaving = false;
    }
  },
  async created() {
    this.isLoading = true;
    this.maxDefaultDate = formatDate(new Date(), 'YYYY/MM')
    this.dateReaction = formatDate(new Date(), FORMAT_DATE)

    try {
      let typologyListPromise = await getReactionTypeList(this.cf);
      this.typologyList = typologyListPromise.data;
    } catch (e) {
      let message = "Non è stato possibile recuperare le tipologie";
      apiErrorNotify({ e, message });
    }
    let { id, administration,citizen} = this.$route.params
    if(citizen){
      this.citizen = citizen;
      this.email = citizen.contatti_vaccinazioni?.email;
      this.telefono = citizen.contatti_vaccinazioni?.telefono;
    }

    //controllo refresh
    if (!administration) {
      let response = await getAdministrationList(this.cf);
      let administrationList = response.data;
      administration = administrationList.filter(
        c => c.id.toString() === id.toString()
      )[0];
    }
    this.administration = administration;

    //nomi vaccini
    for (let i = 0; i < this.administration.associazioni?.length; i++) {
      let association = this.administration.associazioni[i]
      for (
        let h = 0;
        h < association?.vaccinazioni?.length;
        h++
      ) {
        if (this.vaccinationsName === "") {
          this.vaccinationsName = startCase(
            association.vaccinazioni[h].descrizione
          );
        } else {
          this.vaccinationsName =
            this.vaccinationsName +
            ", " +
            startCase(
              association.vaccinazioni[h].descrizione
            );
        }
      }
    }

    this.isLoading = false;
  }
};
</script>

<style></style>
