
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {date, format} from 'quasar'
const { pad } = format;

/**
 * Mixin che implementa la logica di un countdown ad una determinata data.
 *
 * @note
 * Usiamo un namespace per evitare strane collisioni con altri mixins e/o proprietà stesse del componente che usa il mixin
 *
 * @example
 * ```html
 * // MyComponent.vue
 * <div v-if="countdownMixin_isStarted && !countdownMixin_isExpired" class="countdown">
 *    {{countdownMixin_expiration}}
 * </div>
 * <div v-if="countdownMixin_isExpired">
 *     Il countdown è terminato!
 * </div>
 * ```
 *
 *
 * ```js
 * // MyComponent.vue
 * export default = {
 *     name: 'MyComponent',
 *     // ...
 *     mounted(){
 *         let expirationDate = this.$moment().add(3, 'minutes');
 *         this.countdownMixin_start(expirationDate);
 *     }
 * }
 * ```
 */
export const countdownMixin = {
  data() {
    return {
      countdownMixin_startDate: undefined,
      countdownMixin_endDate: undefined,
      countdownMixin_now: undefined,
      countdownMixin_nowInterval: undefined,
    };
  },
  computed: {
    countdownMixin_isStarted() {
      return date.isValid(this.countdownMixin_startDate);
    },
    countdownMixin_isExpired() {
      return this.countdownMixin_difference <= 0
    },
    countdownMixin_difference() {
      if (!this.countdownMixin_isStarted) return undefined;
      return date.getDateDiff(this.countdownMixin_endDate, this.countdownMixin_now, 'seconds');
    },
    countdownMixin_minutesLeft() {
      if (!this.countdownMixin_difference) return null;
      let minutes =  Math.floor(this.countdownMixin_difference / 60);
      return pad(minutes,2)
    },
    countdownMixin_secondsLeft() {
      if (!this.countdownMixin_difference) return null;
      let seconds =  Math.floor(this.countdownMixin_difference % 60);
      return pad(seconds, 2)
    },
  },
  methods: {
    countdownMixin_start(to) {
      this.countdownMixin_startDate = new Date();
      this.countdownMixin_now = new Date();
      this.countdownMixin_endDate = to;
      this.countdownMixin_nowInterval = setInterval(() => {
        this.countdownMixin_now = new Date();
      }, 1000);
    }
  },
  beforeDestroy() {
    clearInterval(this.countdownMixin_nowInterval);
  }
};
