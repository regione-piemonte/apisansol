<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-item clickable @click="openModal">
    <q-item-section side>
      <q-icon name="home" color="secondary" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1" class="text-subtitle1">
        <span v-if="required">*</span>
        {{ label }}
      </q-item-label>

      <template v-if="!address_" class="text-grey-7">
        <q-item-label>
          -
        </q-item-label>
      </template>
      <template v-else>
        <q-item-label class="text-grey-7">
          {{ comune_ | capitalCase }}, {{ address_ }}
        </q-item-label>
        <q-item-label caption class="text-grey-7">
          Valido dal {{ data_inizio_validita_ | date }} al
          {{ data_fine_validita_ | date }}
        </q-item-label>
      </template>
    </q-item-section>

    <template v-if="editable">
      <q-item-section side>
        <q-icon
          :name="address_ ? 'edit' : 'keyboard_arrow_right'"
          :color="address_ ? 'faded' : 'primary'"
        />
      </q-item-section>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isAddressModalOpen">
      <vac-address-dialog
        v-model="isAddressModalOpen"
        @confirmed="onAddressVerified"
      />
    </template>
  </q-item>
</template>

<script>
import VacAddressDialog from "./VacAddressDialog";

export default {
  name: "VacAddressItem",
  components: { VacAddressDialog },
  props: {
    address: { required: true },
    label: { type: String, required: false, default: "Indirizzo" },
    required: { type: Boolean, required: false, default: false },
    editable: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      isAddressModalOpen: false,
      address_: this.address.indirizzo_temporaneo,
      data_fine_validita_: this.address.data_fine_validita,
      data_inizio_validita_: this.address.data_inizio_validita,
      comune_: this.address.comune
    };
  },
  computed: {},
  methods: {
    openModal() {
      if (!this.editable) return;
      this.isAddressModalOpen = true;
    },
    onAddressVerified(newAddress) {
      //da aggiungere il comune
      this.address_ = newAddress.indirizzo_temporaneo;
      this.data_fine_validita_ = newAddress.data_fine_validita;
      this.data_inizio_validita_ = newAddress.data_inizio_validita;
      this.comune_ = newAddress.comune;
    }
  }
};
</script>

<style lang="sass"></style>
