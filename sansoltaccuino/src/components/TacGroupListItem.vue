<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="tac-group-list-item" :class="classes">
    <q-card-section>
      <!-- NOME SEZIONE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="tac-group-list-item__header row items-center q-col-gutter-md">
        <div class="col text-body1 text-bold">
          {{ title }}
        </div>

        <template v-if="!isDelegationTacWeak">
          <div class="col-auto">
            <template v-if="isUpdating">
              <q-spinner size="sm" color="primary" />
            </template>
            <template v-else>
              <q-toggle
                :value="isEnabled"
                dense
                @input="$emit('update:isEnabled', $event)"
              />
            </template>
          </div>
        </template>
      </div>

      <template v-if="isEnabled">
        <q-separator spaced />

        <!-- ULTIMA RILEVAZIONE -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <div
          class="tac-group-list-item__body row q-col-gutter-y-md q-col-gutter-x-lg q-py-lg"
        >
          <div class="col-auto">
            <q-icon :name="icon" size="lg" />
          </div>

          <div class="col">
            <slot name="text"></slot>
          </div>
        </div>

        <q-separator spaced />

        <!-- AZIONI -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <template v-if="addable || graph">
          <div class="tac-group-list-item__footer row q-col-gutter-md">
            <template v-if="graph">
              <div class="col-auto">
                <q-btn
                  flat
                  round
                  icon="img:/statics/la-mia-salute/icone/istogrammi.svg"
                  size="sm"
                  @click="$emit('graph')"
                />
              </div>
            </template>

            <q-space />

            <template v-if="!isDelegationTacWeak && addable">
              <div class="col-auto">
                <q-btn
                  round
                  unelevated
                  size="sm"
                  color="primary"
                  icon="add"
                  @click="$emit('add')"
                />
              </div>
            </template>
          </div>
        </template>
      </template>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "TacGroupListItem",
  props: {
    isEnabled: { type: Boolean, required: false, default: false },
    isUpdating: { type: Boolean, required: false, default: false },
    title: { type: String, required: false, default: "" },
    icon: { type: String, required: false, default: "" },
    addable: { type: Boolean, required: false, default: false },
    graph: { type: Boolean, required: false, default: false },
    isHighlighted: { type: Boolean, required: false, default: false }
  },
  data() {
    return {};
  },
  computed: {
    isDelegationTacWeak() {
      return this.$store.getters["isDelegationTacWeak"];
    },
    classes() {
      let result = [];

      result.push(
        this.isEnabled
          ? "tac-group-list-item--enabled"
          : "tac-group-list-item--disabled"
      );

      if (this.isHighlighted) {
        result.push("tac-group-list-item--highlighted");
      }

      return result;
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="sass">
.tac-group-list-item--highlighted
  background-color: $blue-1

  hr
    background-color: $blue-5

.tac-group-list-item--disabled
  background-color: $grey-2

.tac-group-list-item--enabled
  .tac-group-list-item__header
    min-height: 60px

  .tac-group-list-item__body
    min-height: 180px
</style>
