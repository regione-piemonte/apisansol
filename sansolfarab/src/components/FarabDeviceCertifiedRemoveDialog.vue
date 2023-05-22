<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-dialog v-bind="attrs" v-on="listeners">
    <q-card>
      <q-card-section>
        <div class="row items-start justify-between ">
          <h2 class="no-margin col">
            <strong>Avviso</strong>
          </h2>
          <q-btn v-close-popup class="col-auto" dense flat icon="close" round/>
        </div>
      </q-card-section>

      <template v-if="deviceDisableSuccess">
        <q-card-section>
          <q-banner class="q-banner--positive">
            <div class="text-body1">
              La certificazione è stata disabilitata con successo.
            </div>
          </q-banner>
        </q-card-section>

        <q-card-section>
          <lms-button
            v-close-popup
            class="full-width"
            label="Torna alla home"
            outline
          />
        </q-card-section>
      </template>

      <template v-else>
        <q-card-section>
          <q-banner class="q-banner--info">
            <div
              class="text-body1 row items-start justify-between q-col-gutter-x-sm"
            >
              <q-icon class="col-auto" name="o_info" size="sm"/>
              <q-space/>
              <div class="col">
                <strong>Attenzione!</strong><br>
                Se disabiliti la certificazione del tuo dispositivo, le farmacie in cui ti servi occasionalmente non
                potranno più accedere alle tue ricette.
              </div>
            </div>
          </q-banner>
        </q-card-section>

        <q-card-section>
          <q-btn
            :loading="loadingDisableDevice"
            class="full-width"
            color="negative"
            label="Disabilita certificazione"
            outline
            @click="disableDevice"
          />
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import {disassociateDevice} from "src/services/api";
import {apiErrorNotify, apiErrorNotifyDialog} from "src/services/utils";

export default {
  name: "FarabDeviceCertifiedRemoveDialog",
  components: {},
  props: {},
  data() {
    return {
      deviceDisableSuccess: false,
      loadingDisableDevice: false
    };
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    }
  },
  created() {
  },
  methods: {
    async disableDevice() {
      this.deviceDisableSuccess = false;
      this.loadingDisableDevice = true;

      try {
        let response = await disassociateDevice(this.taxCode);
        this.$emit('removed');
        this.deviceDisableSuccess = true;
      } catch (error) {
        let message =
          "Non è stato possibile disabilitare la certificazione. Riprovare.";
        apiErrorNotifyDialog({error, message});
      }

      this.loadingDisableDevice = false;
    }
  }
};
</script>

<style scoped></style>
