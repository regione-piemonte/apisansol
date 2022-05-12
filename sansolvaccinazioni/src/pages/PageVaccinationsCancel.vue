<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title class="q-mb-md">Annulla appuntamento</lms-page-title>

      <div>
        <q-banner class="q-mb-md q-banner--info">
          <div class="text-body1 ">
            <p >
              Hai richiesto la cancellazione dell'appuntamento per i seguenti
              vaccini:
              <strong>{{ vaccinationsName | capitalCase}}</strong>
            </p>
            <p class="q-mb-sm">Desideri confermare la richiesta?</p>
          </div>
        </q-banner>

        <q-card class="q-pa-md">
          <!--Se NON è stato fatto con agenda-->
          <div v-if="!agenda">
            <q-form ref="form" greedy @submit.prevent="" :class="$q.screen.lt.md ? 'q-gutter-lg' : 'q-gutter-md'">
              <!--            MOTIVAZIONE-->
              <q-select
                label="Seleziona una motivazione"
                dense
                required
                bottom-slots
                no-error-icon
                emit-value
                map-options
                v-model="motivation"
                :options="motivationOptions"
                :rules="[ruleRequired]"
              />

              <template v-if="citizen">
                <!--CONTATTI-->

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
              </template>
            </q-form>
          </div>

          <!--          NOTE-->
          <q-input
            v-model="notes"
            type="textarea"
            :max-height="200"
            rows="4"
            label="Inserisci eventuali note per l'operatore"
          ></q-input>
        </q-card>
      </div>

      <div class="q-pt-md ">
        <lms-buttons>
          <lms-button :loading="isCanceling" @click="cancel"
            >Conferma
          </lms-button>
        </lms-buttons>
      </div>
    </div>

    <lms-inner-loading :showing="isLoading" block />
  </lms-page>
</template>

<script>
import {
  getAppointmentList,
  getVaccinationUserInfo,
  getMotivationsList,
  removeAppointment,
  removeAppointmentRequest
} from "../services/api";
import { apiErrorNotify } from "../services/utils";
import { capitalCase } from "change-case";
import { DELETE_SUCCESS } from "../router/routes";
import {vaccinationsList, vaccinationsNames} from "src/services/business-logic";

export default {
  name: "PageVaccinationsCancel",
  components: {},
  data() {
    return {
      //vaccinazione di prova da visualizzare quando la pagina viene ricaricata
      isLoading: false,
      appointment: null,
      notes: null,
      motivation: null,
      motivations: null,
      citizen: null,
      email: null,
      telefono: null,
      isCanceling: false
    };
  },
  computed: {
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
    appointmentVaccinationList() {
      return vaccinationsList(this.appointment?.associazioni)
    },
    vaccinationsName() {
      return vaccinationsNames(this.appointmentVaccinationList)
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    user() {
      return this.$store.getters["getUser"];
    },
    motivationOptions() {
      if (this.motivations)
        return this.motivations.map(t => ({
          label: t.descrizione,
          value: t.codice
        }));
      return [];
    },
    agenda(){
      return this.appointment?.agenda
    }
  },
  methods: {
    onBack() {
      this.$router.go(-1);
    },
    cancel() {
      this.agenda ? this.onCancelAgenda() : this.onCancelNoAgenda();
    },
    async onCancelAgenda(){
      let id = this.appointment.id;
      this.isCanceling = true;
        let payload = {
          note: this.notes
        };

        try {
          let response = await removeAppointment(
            this.cf,
            id,
            payload
          );

          let params = {
            id: id,
            appuntamento: this.appointment
          };

          let name = DELETE_SUCCESS.name;

          this.$router.push({ name, params });
        } catch (e) {
          let message = "Non è stato possibile annullare l'appuntamento";
          apiErrorNotify({ e, message });
        }finally {
          this.isCanceling = false;
        }
    },
    async onCancelNoAgenda(){
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;
      let id = this.appointment.id;
      this.isCanceling = true;

      try {
        let payload = {
          telefono: this.telefono,
          mail: this.email,
          note: this.notes,
          id_appuntamento: id,
          motivazione: this.motivation,
          centro_vaccinale: this.appointment.centro_vaccinale,
          cf_richiedente: this.user?.cf
        };

        let response = await removeAppointmentRequest(
          this.cf,
          id,
          payload
        );

        let params = {
          id: id,
          appuntamento: this.appointment
        };

        let name = DELETE_SUCCESS.name;

        this.$router.push({ name, params });
      } catch (e) {
        let message = "Non e' stato possibile revocare l'appuntamento";
        apiErrorNotify({ e, message });
      }finally {
        this.isCanceling = false;
      }
    },
    async download() {
      //await getPromemoriaAppunamento(this.cf, this.appointment.id)
    }
  },
  async created() {
    this.isLoading = true;
    let {id, appointment} = this.$route.params;
    let appointmentListPromise = null;
    if(!appointment)  appointmentListPromise = await getAppointmentList(this.cf);
    let motivationListPromise = getMotivationsList();
    let citizenPromise = getVaccinationUserInfo(this.cf);
    if (appointmentListPromise) {
      let response = await appointmentListPromise;
      let appointmentList = response.data;
      appointment = appointmentList.find(c => id === c.id.toString());
    }
    this.appointment = appointment

    try {
      let response = await motivationListPromise;

      this.motivations = response.data;
      if (this.motivations?.length === 0) {
        let message =
          "Non è stato possibile recuperare i dati delle motivazioni";
        apiErrorNotify({
          message
        });
      }
    } catch (e) {
      let message = "Non è stato possibile recuperare i dati delle motivazioni";
      apiErrorNotify({
        e,
        message
      });
    }
    try {
      let response = await citizenPromise;
      this.citizen = response.data;
      this.telefono = this.citizen?.contatti_vaccinazioni?.telefono;
      this.email = this.citizen?.contatti_vaccinazioni?.email;
    } catch (e) {
      let message = "Non è stato possibile recuperare i dati del cittadino";
      apiErrorNotify({ e, message });
    }

    this.isLoading = false;
  }
};
</script>

<style></style>
