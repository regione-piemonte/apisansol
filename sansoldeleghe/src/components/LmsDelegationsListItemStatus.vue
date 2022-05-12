<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div >
    <div class="row flex-inline" :class="{'reverse': iconRight}">
      <div>
        <q-icon slot="icon" size="20px" :name="iconName" :color="iconColor"></q-icon>
      </div>
      <div class="separator"></div>
      <div>
        <span slot="label" class="text-caption">{{statusLabel}}</span>
      </div>
    </div>
    <div class="row q-mt-xs text-overline reverse" v-if="rank">
      <a class="lms-link cursor-pointer">{{rankLabel}}</a>
    </div>
  </div>
</template>


<script>

  import {DELEGATION_STATUS_LABEL, DELEGATION_STATUS_MAP, DELEGATION_RANK_CODES, DELEGATION_RANK_LABEL} from "src/services/config";

  const ICON_MAP = {
    [DELEGATION_STATUS_MAP.ACTIVE]: {name: 'check_circle', color: 'positive'},
    [DELEGATION_STATUS_MAP.UPDATED]: {name: 'check_circle', color: 'positive'},
    [DELEGATION_STATUS_MAP.IS_EXPIRING]: {name: 'check_circle', color: 'warning'},
    [DELEGATION_STATUS_MAP.REFUSED]: {name: 'cancel', color: 'negative'},
    [DELEGATION_STATUS_MAP.REVOKED]: {name: 'cancel', color: 'warning'},
    [DELEGATION_STATUS_MAP.NOT_ACTIVE]: {name: 'cancel', color: 'accent'},
    [DELEGATION_STATUS_MAP.EXPIRED]: {name: 'cancel', color: 'accent'},
  }


  export default {
    name: "LmsDelegationsListItemStatus",
    components: {},
    props: {
      rank: {type: String, required: false},
      status: {type: String, required: true},
      iconRight: {type: Boolean, required: false, default: false}
    },
    computed: {
      statusLabel() {
        return DELEGATION_STATUS_LABEL[this.status]
      },
      iconName() {
        return ICON_MAP[this.status].name
      },
      iconColor() {
        return ICON_MAP[this.status].color
      },
      rankLabel(){
        return DELEGATION_RANK_LABEL[this.rank] ?? ''
      }
    }
  }
</script>


<style scoped>
  .separator {
    width: 4px;
  }
</style>
