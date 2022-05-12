<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <component
    :is="component"
    v-bind="attrs"
    v-on="listeners"
    :class="classes"
    :style="styles"
    ref="transition">
    <slot />
  </component>
</template>


<script>

  const defaultName = 'csi-transition-fade-out-right'

  export default {
    name: 'CsiTransitionFadeOutRight',
    inheritAttrs: false,
    props: {
      isGroup: {type: Boolean, required: false, default: false},
      // Attivo solo se isGroup === true
      // Il numero di millisecondi di delay tra lo slide dell'elemento rimosso
      // ed il move degli altri elementi della lista
      moveDelay: {type: Number, required: false, default: 0},
    },
    computed: {
      component() {
        return this.isGroup ? 'transition-group' : 'Transition'
      },
      attrs() {
        let {...attrs} = this.$attrs

        attrs.name = attrs.name || defaultName
        attrs['leave-active-class'] = attrs['leave-active-class'] || ''
        attrs['leave-active-class'] += ' animated fadeOutRight absolute'

        if (this.isGroup) {
          attrs['move-class'] = attrs['move-class'] || 'csi-transition-delay-1000'
        }

        return attrs
      },
      listeners() {
        let {...listeners} = this.$listeners
        return listeners
      },
      classes() {
        return {
          [defaultName]: true,
          'overflow-hidden': true,
          'relative-position': true,
        }
      },
      styles() {
        let result = {}
        return result
      }
    },
    // methods: {
    //   onBeforeLeave(el) {
    //     let wrapperEl = this.$refs.csiTransitionSlideRight.$el
    //     wrapperEl.style.height = wrapperEl.clientHeight
    //   },
    //   afterLeave(el) {
    //     let wrapperEl = this.$refs.csiTransitionSlideRight.$el
    //     wrapperEl.style.height = ''
    //   }
    // }
  }
</script>


<style lang="stylus">
  .csi-transition-fade-out-right
    .csi-transition-delay-1000
      transition-delay 1000ms
</style>
