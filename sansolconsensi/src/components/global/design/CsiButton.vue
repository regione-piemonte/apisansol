<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn
    v-on="listeners"
    v-bind="attrs"
    :outline="secondary"
    class="csi-button"
    :class="classes">

    <!-- Propaghiamo lo slot di default -->
    <slot />

    <!-- Propaghiamo i named slots -->
    <slot name="loading" slot="loading" />
  </q-btn>
</template>


<script>
    export default {
        name: 'CsiButton',
        inheritAttrs: false,
        props: {
            secondary: {type: Boolean, required: false, default: false},
            block: {type: Boolean, required: false, default: false},
            noMinWidth: {type: Boolean, required: false, default: false},
            link: {type: Boolean, required: false, default: false},
        },
        computed: {
            listeners() {
                const {...listeners} = this.$listeners;
                return listeners;
            },
            attrs() {
                const {outline, ...attrs} = this.$attrs;
                if(!this.link) attrs.color = attrs.color || 'primary'

                if (this.link) {
                    attrs.textColor = attrs.textColor || 'primary'
                    attrs.flat = attrs.flat || true
                    attrs.noRipple = attrs.noRipple || true
                    attrs.noCaps = attrs.noCaps || true
                }

                return attrs;
            },
            classes() {
                return {
                    'full-width': this.block,
                    'min-width': !this.noMinWidth,
                    'csi-button--link': this.link

                }
            }
        },
    }

</script>


<style lang="stylus">
  .csi-button--link
    display: inline
    padding: 0

    &:focus
      outline: none
</style>
