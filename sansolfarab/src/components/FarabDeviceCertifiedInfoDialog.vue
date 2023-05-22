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
            <strong>Informazioni sul dispositivo certificato</strong>
          </h2>

          <q-btn v-close-popup flat round dense icon="close" class="col-auto" />
        </div>
      </q-card-section>

      <template v-if="deviceInfo">
        <q-card-section>
          <p>
            Modello dispositivo:
            <strong
            >{{ deviceInfo.modello | capitalize }}</strong
            >
          </p>

          <p>
            Sistema operativo:
            <strong
            >{{ deviceInfo.sistema_operativo | capitalize }}</strong
            >
          </p>
          <p>
            Browser:
            <strong
            >
              {{ deviceInfo.browser | capitalize }}</strong
            >
          </p>
          <p>
            Data:
            <strong>{{
              deviceInfo.data_certificazione | date("DD MMMM YYYY")
            }}</strong>
          </p>
          <p>
            Certificato da:
            <strong>{{ deviceInfo.fonte_descrizione | capitalize }}</strong>
          </p>


        </q-card-section>
      </template>

      <q-card-section>
        <q-btn
          v-close-popup
          label="Disabilita certificazione"
          color="negative"
          outline
          class="full-width"
          @click="$emit('click-remove-certification')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "FarabDeviceCertifiedInfoDialog",
  components: {},
  props: {
    deviceInfo: { type: Object, required: false, default: () => null }
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  methods: {}
};
</script>

<style scoped></style>
