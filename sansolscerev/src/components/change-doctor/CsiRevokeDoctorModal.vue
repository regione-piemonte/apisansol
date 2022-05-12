<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>


  <q-modal
    @input="$emit('input', $event)"
    :value="value"
    :content-css="{maxWidth: '800px'}"
    ref="modal"
  >

    <q-modal-layout header-class="no-shadow no-scroll">
      <q-toolbar slot="header" color="transparent" text-color="primary">
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay/>
      </q-toolbar>
      <div class="csi-modal-content flex items-center">
        <div class="q-px-xl q-pb-lg ">

          <q-alert type="info" class="csi-revoke-doctor-alert">
            <div class="q-body-1 q-pa-md">
              Stai revocando il medico <span class="text-weight-bold"
                                             v-if="doctor">{{ doctor.cognome | upperCase }} {{ doctor.nome }}</span>.
              Resterai privo di medico dell'assistenza
              sanitaria nazionale.<br>
              <strong>Ricorda che puoi cambiare medico scegliendone subito un altro: la revoca del tuo medico attuale sarà
                automatica.</strong>
              <!--              Se intendi richiedere un medico di un'altra Regione, revoca anche l'assistenza della tua ASL.-->
            </div>
          </q-alert>
          <q-card class="bg-white q-my-lg">
            <q-card-main>
              <q-item class="no-padding">
                <q-item-main>
                  <q-field
                    required
                    :error="$v.message.$error"
                  >
                    <q-input type="text" v-model.trim="message" float-label="Motivo della revoca" maxlength="400"/>
                    <template slot="error-label">
                      <div v-if="!$v.message.required">Campo obbligatorio</div>
                    </template>
                  </q-field>


                </q-item-main>
              </q-item>
            </q-card-main>
          </q-card>
          <csi-policy-form @get-policy-value="getPolicyValue"/>

          <div class="row q-mt-lg justify-end items-center">

            <csi-buttons class="col-12 col-md-auto">
              <csi-button
                color="negative"
                secondary
                label="Revoca medico"
                @click="revokeDoctor"
                :loading="isLoading"
              />
              <!--                <csi-button-->
              <!--                  color="negative"-->
              <!--                  secondary-->
              <!--                  label="Revoca medico e assistenza"-->
              <!--                  @click="revokeAssistance"-->
              <!--                  :loading="isLoading"-->
              <!--                />-->
            </csi-buttons>
          </div>
        </div>
      </div>
    </q-modal-layout>


  </q-modal>
</template>

<script>

import {getUserInfo, revokeAssistance, revokeDoctor} from "@services/api/change-doctor";
import {is4XX, notifyError} from "@services/api/utils";
import CsiPolicyForm from "components/change-doctor/CsiPolicyForm";
import {required} from "vuelidate/lib/validators";
import {revokeDoctorDelete} from "../../services/api/change-doctor";
import max from "date-fns/max";
import startOfDay from "date-fns/start_of_day";
import {maxLimitDate} from "../../services/change-doctor/business-logic";


export default {
  name: "CsiRevokeDoctorModal",
  components: {CsiPolicyForm},
  props: {
    doctor: {type: Object, default: null},
    cf: {type: String, required: true, default: ''},
    value: {type: Boolean, required: false, default: false}
  },
  computed: {
  },
  validations: {
    message: {
      required
    },
  },
  data() {
    return {
      isLoading: false,
      isPolicyAccepted: false,
      message: ''
    }
  },
  methods: {
    async revokeDoctor() {
      this.$v.$touch();
      if (this.$v.$error) return;

      if (!this.isPolicyAccepted) {
        this.$q.notify({
          color: 'negative',
          message: "Devi accettare l'informativa prima di richiedere la revoca."
        });
        return
      }

      try {
        this.isLoading = true;
        let motivation = {
          motivo_revoca: this.message
        }

        let revokePromise = await revokeDoctor(this.cf, motivation, {_no5XXRedirect: true});

        let userInfoPromise = await getUserInfo(this.cf, {_no5XXRedirect: true});
        let userInfo = userInfoPromise.data;
        if (userInfo)
          this.$store.dispatch('changeDoctor/setUserInfo', {info: userInfo});

      } catch (e) {
        notifyError(e, 'Errore durante la richiesta di revoca.')
      } finally {
        this.isLoading = false;
        this.$router.push(this.$routes.CHANGE_DOCTOR.APP);
        this.hide()
      }

    },
    async revokeAssistance() {
      if (!this.isPolicyAccepted) {
        this.$q.notify({
          color: 'negative',
          message: "Devi accettare l'informativa prima di richiedere l'esenzione"
        });
        return
      }

      this.isLoading = true;
      try {
        let revokePromise = await revokeAssistance(this.cf, {_no5XXRedirect: true});

        this.isLoading = false;
        this.$emit('revoke-assistance');
        this.$q.notify({
          type: 'positive',
          message: 'Medico e assistenza revocati con successo.'
        })
      } catch (e) {
        notifyError(e, 'Errore durante la richiesta di revoca.')
      }


    },

    hide() {
      return this.$refs.modal.hide();
    },

    getPolicyValue(value) {
      this.isPolicyAccepted = value
    }
  },
}
</script>

<style lang="stylus">
.csi-modal-content
  height: calc(100% - 50px)

.loader-container
  max-height: 30px
  display: flex
  align-items: center
  justify-content: center

.csi-revoke-doctor-alert
  .q-alert-side
    align-self: center
    background: none
    @media (max-width: 480px)
      display: none

</style>
