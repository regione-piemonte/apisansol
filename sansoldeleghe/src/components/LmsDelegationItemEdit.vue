<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

  <div class="row items-start justify-between q-col-gutter-md lms-delegation-item-edit" >

    <div class="col-12 col-md-4 " >
      <div  class="fse-service-name q-pl-xl" v-if="isFse">
          <span>
            <strong>{{ delegationsName }}</strong>
          </span>
          <q-btn
            flat
            round
            dense
            class="col-2"
            icon="o_info"
            color="primary"
            @click="showFseInfoModal()"
          />

      </div>
      <q-toggle v-else v-model="isActive"  color="primary" @input="onInputActivation">
        <strong>{{delegationsName}}</strong>
      </q-toggle>
      <div class="q-pt-md q-pl-xl" v-if="!isNew">
        <lms-delegations-list-item-status :status="delegationStatus" icon-left/>
      </div>
    </div>
    <div class="col-12 col-md-5" :class="{'lms-delegation-item-content': $q.screen.lt.md}">
      <div class="q-px-sm" v-if="isFse">
        <p class="text-overline" >Cosa può fare il delegato</p>
        <p>
          <q-checkbox
            dense
            v-if="acceptWeakDelegation"
            v-model="weak"
            :label="weakLabel"
            @input="onInputWeak"
          />
        </p>
        <p>
          <q-checkbox
            dense
            v-if="acceptStrongDelegation"
            v-model="strong"
            :label="strongLabel"
            @input="onInputStrong"/>
        </p>

      </div>
      <div class="q-px-sm" v-else>
        <p class="text-overline">Cosa può fare il delegato</p>
<!--        <p><strong>Vedere e modificare</strong></p>-->
          <q-item class="no-padding q-mb-md" v-if="delegationInfoMessage">
            <q-item-section>
              <q-item-label class="no-fse-info" :lines="showInfoLines" v-html="delegationInfoMessage"></q-item-label>
              <q-item-label>
                <a v-if="!showMore" class="lms-link" href="#" @click.prevent="readMore">Leggi tutto</a>
                <a v-else class="lms-link" href="#" @click.prevent="readMore">Leggi meno</a>
              </q-item-label>
            </q-item-section>

          </q-item>
<!--          <div class="info-read-more&#45;&#45;text"  ></div>-->
<!--          <p class="info-read-more&#45;&#45;label"><a href="#" @click.prevent="readMore" class="info-read-more&#45;&#45;link">Leggi tutto</a></p>-->

      </div>
    </div>
    <div class="col-12 col-md"
         :class="{'lms-delegation-item-content': $q.screen.lt.md}">
      <div class="q-px-sm" :class="{'invisible': !isSelected}">
        <p class="text-overline"><strong>Validità</strong></p>
        <q-item dense class="q-pa-none">
<!--          <q-item-section side>-->
<!--            <q-item-label overline class="text-secondary">dal</q-item-label>-->
<!--          </q-item-section>-->
          <q-item-section>
            <q-input
              label-color="primary"
              ref="startDateInput"
              dense
              input-class="text-primary"
              label="dal"
              v-model="startDate"
              mask="##/##/####"
              placeholder="gg/mm/aaaa"
              no-error-icon
              bottom-slots
              :error="$v.startDate.$error"
              @input="onInputStartDate"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" color="primary">
                  <q-popup-proxy ref="examDateProxy" v-model="showStartDateCalendar">
                    <q-date
                      v-model="startDate"
                      minimal
                      :mask=FORMAT_DATE
                      @input="showStartDateCalendar=false"
                      :options="rangeStartOptions"

                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:error>
                <div v-if="!$v.startDate.validDate || !$v.startDate.required">Inserire una data valida</div>
                <template v-else>
                  <div v-if="!$v.startDate.validRange">la data deve essere compresa tra {{ minStartDate | date }} e
                    {{ maxStartDate | date }}
                  </div>
                </template>

              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item dense class="q-pa-none">
<!--          <q-item-section side>-->
<!--            <q-item-label overline class="text-secondary">al</q-item-label>-->
<!--          </q-item-section>-->
          <q-item-section>
            <q-input
              ref="endDateInput"
              dense
              v-model="endDate"
              label="al"
              label-color="primary"
              input-class="text-primary"
              mask="##/##/####"
              placeholder="gg/mm/aaaa"
              no-error-icon
              bottom-slots
              :error="$v.endDate.$error"
              @input="onInputEndDate"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" color="primary">
                  <q-popup-proxy ref="examDateProxy" v-model="showEndDateCalendar">
                    <q-date
                      v-model="endDate"
                      minimal
                      :mask=FORMAT_DATE
                      @input="showEndDateCalendar=false"
                      :options="rangeEndOptions"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:error>
                <div v-if="!$v.endDate.validDate || !$v.endDate.required">Inserire una data valida</div>
                <template v-else>
                  <div v-if="!$v.endDate.validRange">la data deve essere compresa tra {{ minEndDate | date }} e
                    {{ maxEndDate | date }}
                  </div>
                </template>

              </template>
            </q-input>
          </q-item-section>
        </q-item>
      </div>
    </div>

    <lms-delegation-info-dialog v-model="isOpenFseInfoModal" :title="delegationsName">
      <div v-html="delegationInfoMessage"></div>
    </lms-delegation-info-dialog>


  </div>


</template>

<script>
import {date} from "quasar";
import {getDelegationDaysInterval} from "src/services/business-logic";
import {required} from "vuelidate/lib/validators";
import {isEmpty} from "src/services/utils";
import {DELEGATION_RANK_CODES, DELEGATION_STATUS_MAP, DELEGATION_TYPE_CODES, FORMAT_DATE} from "src/services/config";
import LmsDelegationsListItemStatus from "components/LmsDelegationsListItemStatus";
import LmsDelegationInfoDialog from "components/LmsDelegationInfoDialog";


export default {
  name: "LmsDelegationItemEdit",
  components: {LmsDelegationInfoDialog, LmsDelegationsListItemStatus},
  props: {
    delegation: {type: Object, default: null},
    isNew: {type: Boolean, default: false},
    isFse: {type: Boolean, default: false},
    isWeakDelegation: {type: Boolean, default: false}
  },
  data() {
    return {
      FORMAT_DATE,
      startDate: '',
      endDate: '',
      showStartDateCalendar: false,
      showEndDateCalendar: false,
      today: new Date(),
      strong: false,
      weak: false,
      isActive: false,
      status: '',
      uuid: null,
      firstStatus: null,
      isOpenFseInfoModal:false,
      showMore:false
    }
  },
  watch: {
    isWeakDelegation: {
      immediate: true,
      handler(val, oldVal) {
        if (this.acceptWeakDelegation) {
          this.weak = val
          this.isActive = val
        }
      }
    },
    selectedParams: {
      immediate: true,
      handler(val, oldVal) {
        if (val) {
          this.$emit('on-change', val)
        }
      }
    },
    // delegationActivationInfo: {
    //   immediate: true,
    //   deep: true,
    //   handler(val, oldval) {
    //
    //     this.getDefaultData(val)
    //   }
    // }
  },
  created() {

    this.getDefaultData(this.delegation?.info_attivazione)

  },
  validations() {
    return {
      startDate: {
        required,
        validDate: v => isEmpty(v) || this.$rules.date(v),
        validRange: v => {
          let today = date.formatDate(new Date(), FORMAT_DATE)
          return isEmpty(v) || this.rangeStartOptions(v, FORMAT_DATE)
        }
      },
      endDate: {
        required,
        validDate: v => isEmpty(v) || this.$rules.date(v),
        validRange: v => {
          let minDate = date.formatDate(this.minEndDate, FORMAT_DATE)
          let maxDate = date.formatDate(this.maxEndDate, FORMAT_DATE)
          return isEmpty(v) || this.rangeEndOptions(v, FORMAT_DATE)
        }
      }
    }
  },
  computed: {
    delegationsName() {
      return this.delegation?.applicazione?.descrizione || this.delegation?.delega_descrizione
    },
    delegationCode() {
      return this.delegation?.codice_servizio ?? ''
    },
    acceptStrongDelegation() {
      return this.delegation?.delega_forte
    },
    acceptWeakDelegation() {
      return this.delegation?.delega_debole
    },
    strongLabel() {
      return this.delegation?.delega_forte_descrizione ?? ''
    },
    weakLabel() {
      return this.delegation?.delega_debole_descrizione ?? ''
    },
    delegationInfoMessage(){
      return this.delegation?.delega_info_descrizione ?? ''
    },
    minStartDate(){
      return this.today
    },
    maxStartDate(){
      let endDate = date.extractDate(this.endDate, FORMAT_DATE)
      return endDate
    },
    minEndDate() {
      let startDate = date.extractDate(this.startDate, FORMAT_DATE)
      return date.addToDate(startDate, {days: 1})
    },
    maxEndDate() {
      let serviceDaysInterval = getDelegationDaysInterval(this.delegation?.numero_giorni)
      return date.addToDate(new Date(), {days: serviceDaysInterval})
    },
    isSelected() {
      return this.isActive || this.strong || this.weak
    },
    delegationLevel() {
      let level = null
      if (this.strong)
        level = DELEGATION_RANK_CODES.STRONG
      else if (this.weak)
        level = DELEGATION_RANK_CODES.WEAK
      return level
    },
    delegationStatus() {
      let firstStatus= this.firstStatus?.stato_delega
      let isActive=  firstStatus === DELEGATION_STATUS_MAP.ACTIVE
      let revokeFirstStatus = firstStatus === DELEGATION_STATUS_MAP.REVOKED
      let defaultStatus = firstStatus ?? DELEGATION_STATUS_MAP.NOT_ACTIVE
      let deactiveStatus = revokeFirstStatus || isActive  ? DELEGATION_STATUS_MAP.REVOKED : defaultStatus
      return this.isSelected ? DELEGATION_STATUS_MAP.ACTIVE : deactiveStatus
    },
    selectedParams() {

      return {
        delega_descrizione: this.delegationsName,
        codice_servizio: this.delegationCode,
        grado_delega: this.delegationLevel,
        tipo_delega: DELEGATION_TYPE_CODES.ADULT,
        data_inizio_delega: date.extractDate(this.startDate, FORMAT_DATE),
        data_fine_delega: date.extractDate(this.endDate, FORMAT_DATE),
        stato_delega: this.delegationStatus,
        uuid: !this.isNew && this.uuid ? this.uuid : null
      }
    },
    delegationActivationInfo() {
      return this.delegation?.info_attivazione
    },
    showInfoLines(){
      return this.showMore ? '' : 2
    }
  },
  methods: {
    getDefaultData(delegationInfo) {

      let serviceDaysInterval = getDelegationDaysInterval(this.delegation?.numero_giorni)

      this.uuid = delegationInfo?.uuid
      this.strong = delegationInfo?.grado_delega === DELEGATION_RANK_CODES.STRONG
      this.weak = delegationInfo?.grado_delega === DELEGATION_RANK_CODES.WEAK
      this.isActive = delegationInfo?.stato_delega === DELEGATION_STATUS_MAP.ACTIVE

      this.firstStatus = delegationInfo
      if(this.isWeakDelegation && this.acceptWeakDelegation){
        this.weak = true
        this.isActive = true
      }

      //Nel caso di deleghe FSE senza grado ma attive, le impostiamo di default a forte
      if(this.isActive && this.isFse){
        if(delegationInfo && !delegationInfo?.grado_delega)
          this.strong = true
      }else{
        this.strong = false
        this.weak=false
      }

      let startDate = (delegationInfo?.data_inizio_delega && this.isActive) ? delegationInfo?.data_inizio_delega : new Date()
      let endDate = (delegationInfo?.data_fine_delega  && this.isActive) ? delegationInfo?.data_fine_delega : date.addToDate(new Date(), {days: serviceDaysInterval})
      this.startDate = date.formatDate(startDate, FORMAT_DATE)
      this.endDate = date.formatDate(endDate, FORMAT_DATE)

    },
    rangeStartOptions(calendarDate, format = 'YYYY/MM/DD') {
      let selectedDate = date.extractDate(calendarDate, format)
      let today = new Date()
      let endDate = date.extractDate(this.endDate, FORMAT_DATE)
      return date.isBetweenDates(selectedDate, today, endDate, {inclusiveFrom: true, inclusiveTo: true, onlyDate: true})
    },

    rangeEndOptions(calendarDate, format = 'YYYY/MM/DD') {
      let selectedDate = date.extractDate(calendarDate, format)
      return date.isBetweenDates(selectedDate, this.minEndDate, this.maxEndDate, {
        inclusiveFrom: true,
        inclusiveTo: true,
        onlyDate: true
      })
    },
    onInputWeak(val) {

      this.isActive = val
      this.$emit('change-weak-delegation', val)
    },
    onInputStrong(val, event) {

      this.isActive = val
      // this.$emit('change-strong-delegation', val)
    },

    onInputStartDate(val) {
      this.$v.startDate.$touch();
      if (this.$v.startDate.$error) {
        return;
      }
      // this.$emit('change-start-date', val)
    },
    onInputEndDate(val) {
      this.$v.endDate.$touch();
      if (this.$v.endDate.$error) {
        return;
      }
      // this.$emit('change-end-date', val)
    },
    onInputActivation(val) {
      // this.$emit('on-activate', val)
    },
    showFseInfoModal(){
      this.isOpenFseInfoModal = true
    },
    readMore(){
      this.showMore = !this.showMore
    }
  }
}
</script>

<style lang="sass">
.lms-delegation-item-edit
  .fse-service-name
    position: relative
    &:before
      content: ""
      position: absolute
      top: -3px
      bottom: 50%
      width: 16px
      left: 8px
      border-left: 2px solid $primary
      border-bottom: 2px solid $primary
.lms-delegation-item-content
  padding-left: 40px
  .invisible
    display: none

.no-fse-info
  ul
    padding-left: 12px
</style>
