<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->


<template>
  <div
    class="csi-radio-button"
    tabindex="0"
    @keyup.space.enter.prevent.stop="onKeyup"
  >
    <input
      :value="value"
      type="radio"
      :id="id"
      :name="name"
      @input="onInput"
    />

    <div class="row q-col-gutter-sm items-center">
      <div class="col-auto">
        <template v-if="!value">
          <q-icon
            name="radio_button_unchecked"
            :size="size"
            aria-hidden="true"
            @click="onToggle"
          />
        </template>
        <template v-else>
          <q-icon
            name="check_circle"
            :size="size"
            :color="color"
            aria-hidden="true"
            @click="onToggle"
          />
        </template>
      </div>

      <div class="col">
        <label :for="id">
          <slot>
            {{ label }}
          </slot>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CsiRadioButton",
  props: {
    value: { type: Boolean, required: false, default: false },
    label: { type: String, required: false, default: null },
    id: { type: String, required: false, default: null },
    name: { type: String, required: false, default: null },
    size: { type: String, required: false, default: "xs" },
    color: { type: String, required: false, default: "primary" }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onInput(event) {
      // let value = event?.target?.value === "true";
      // console.log("onInput", !value, event, event?.target?.value);
      // this.$emit("input", !value, event);
      this.onToggle(event);
    },
    onToggle(event) {
      // console.log("onToggle", this.value);
      this.$emit("input", !this.value, event);
    },
    onKeyup(event) {
      this.onToggle(event);
      // this.$emit("input", !this.value, event);
    }
  }
};
</script>

<style lang="sass">
.csi-radio-button
  cursor: pointer
  input
    position: absolute
    z-index: -1
    opacity: 0
  label
    cursor: pointer
    user-select: none
    vertical-align: middle
  &:focus
    outline: 2px solid darkorange

</style>
