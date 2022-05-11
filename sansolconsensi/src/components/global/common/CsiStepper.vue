<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-stepper">
    <div ref="stepperTop" class="invisible"></div>
    <q-stepper
      v-bind="attrs"
      v-on="listeners"
      @step="onStep"
      ref="stepper">
      <!-- Elemento nascosto che funge da ancora per lo scrolling -->
      <slot />
    </q-stepper>
  </div>
</template>


<script>
  import {scrollToElement} from "@services/global/utils";

  export default {
    name: 'CsiStepper',
    inheritAttrs: false,
    data() {
      return {
        firstOnStep: true,
      }
    },
    computed: {
      listeners() {
        const {step, ...listeners} = this.$listeners;
        return listeners;
      },
      attrs() {
        const {...attrs} = this.$attrs;
        return attrs;
      },
    },
    methods: {
      onStep(event) {
        this.$emit('step', event)
        if (!this.firstOnStep) scrollToElement(this.$refs.stepperTop, 0)
        this.firstOnStep = false
      },
      next() {
        this.$refs.stepper.next()
      },
      previous() {
        this.$refs.stepper.previous()
      },
      reset() {
        this.$refs.stepper.reset()
      },
      goToStep(step) {
        this.$refs.stepper.goToStep(step)
      }
    }
  }
</script>


<style scoped lang="stylus"></style>
