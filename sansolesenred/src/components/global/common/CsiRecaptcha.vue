<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-recaptcha">
    <div ref="recaptcha"></div>
  </div>
</template>


<script>
  import config from '@configs'

  export default {
    name: 'CsiRecaptcha',
    components: {},
    props: {
      siteKey: {type: String, required: false, default: config.global.envs.RECAPTCHA_KEY},
      size: {type: String, required: false, default: 'normal'},
      theme: {type: String, required: false, default: 'light'},
      tabIndex: {type: Number, required: false, default: 0},
    },
    data() {
      return {
        recaptchaId: null,
      }
    },
    computed: {},
    mounted() {

      let container = this.$refs.recaptcha
      let params = {
        sitekey: this.siteKey,
        theme: this.theme,
        size: this.size,
        tabindex: this.tabIndex,
        callback: this.onCallback,
        'expired-callback': this.onExpired,
        'error-callback': this.onError,
      }

      this.recaptchaId = grecaptcha.render(container, params)
    },
    methods: {
      // executed when the user submits a successful response.
      // The g-recaptcha-response token is passed to your callback.
      onCallback(token) {
        this.$emit('token-update', token)
      },
      // executed when the reCAPTCHA response expires and the user needs to re-verify.
      onExpired() {
        this.$emit('expired')
      },
      // executed when reCAPTCHA encounters an error (usually network connectivity)
      // and cannot continue until connectivity is restored.
      // If you specify a function here, you are responsible for informing the user that they should retry.
      onError() {
        this.$emit('error')
      },
      reset() {
        grecaptcha.reset(this.recaptchaId)
      },
      getResponse() {
        grecaptcha.getResponse(this.recaptchaId)
      }
    },
  }
</script>


<style scoped lang="stylus"></style>
