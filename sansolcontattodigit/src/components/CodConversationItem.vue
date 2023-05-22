<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="cod-conversation-item cursor-pointer"   :class="classes" @click="onClick">

  <q-card-section >
    <div class="row q-col-gutter-md">
      <div class="col-auto gt-sm self-center">
        <q-icon :name="doctorIcon" size="lg" />
      </div>
      <div class="col column q-col-gutter-y-xs">
        <div class="row justify-between">
          <div v-if="doctor" class="col-12 col-md">
            dott. {{doctor.nome}} {{doctor.cognome}}
          </div>



        </div>

        <div class="text-h5">
          {{conversation.argomento}}
        </div>

        <template v-if="hasMessages">
          <div  class="text-italic cod-conversation-item--msg-text">
            {{lastMessage.testo}}
          </div>
          <div class=" text-caption text-accent q-mt-xs lt-md">
            <div class="">{{lastMessage.data_creazione | datetime}}</div>

          </div>

        </template>
        <div v-else class="text-caption lt-md">Nessun messaggio</div>

      </div>
      <div class="col-auto column items-end gt-sm q-col-gutter-y-sm">
        <div class="col-auto" v-if="unSeenMessages">
          <q-badge class="text-bold q-px-sm q-py-xs" color="lms-pink" rounded>
            {{unSeenMessages}} &nbsp;
            <span v-if="unSeenMessages === 1">messaggio non letto</span>
            <span v-else>messaggi non letti</span> </q-badge>
        </div>
          <div v-if="blocked">
            <div>
              <q-badge color="black" class="text-bold" rounded outline>
                <q-icon name="lock" size="xs" class="q-mr-xs" />
                Conversazione in sola lettura
              </q-badge>
            </div>

          </div>
      </div>
      <div class="col-auto row items-center q-col-gutter-x-md">
        <div v-if="blocked" class="lt-md">
          <div>
            <q-icon name="lock" size="xs" class="q-mr-xs" >
              <q-tooltip>
                Conversazione in sola lettura
              </q-tooltip>
            </q-icon>

          </div>

        </div>
        <div class="lt-md" v-if="unSeenMessages">
          <q-badge class="text-bold  text-h6" color="lms-pink" rounded>{{unSeenMessages}}
          </q-badge>
        </div>
        <div v-if="hasMessages">
          <q-icon :name="senderIcon" size="sm"></q-icon>
        </div>
        <div  class="column q-col-gutter-y-xs text-caption gt-sm" >
          <template v-if="hasMessages">
            <div class="">Ultimo messaggio</div>
            <div class="text-bold">{{lastMessage.data_creazione | datetime}}</div>
          </template>
          <template v-else >
            <div class="text-caption ">Nessun messaggio</div>
          </template>
        </div>

      </div>
    </div>


  </q-card-section>
<!--    <q-card-section  v-if="IS_DEV" class="q-pa-sm">-->
<!--      <q-btn flat @click.stop="onClickNew" no-caps> nuova pagina</q-btn>-->
<!--    </q-card-section>-->
  </q-card>
</template>

<script>
import { IS_DEV, MSG_AUTHOR_MAP} from "src/services/config";
import {CONVERSATION_DETAIL} from "src/router/routes";
import {doctorIcon, getGender, hasEnrollmentWarning} from "src/services/business-logic";

export default {
  name: "CodConversationItem",
  props:{
    conversation:{type: Object, required:true, default: null}
  },
  data() {
    return{
      IS_DEV,
    }
  },
  computed:{
    doctor(){
      return this.conversation?.medico
    },
    classes(){
      return {
        "cod-conversation-item--blocked": this.blocked,
        "cod-conversation-item--unseen": this.unSeenMessages > 0 && !this.blocked
      };
    },

    enrollmentCode(){
      return this.$store.getters["getEnrollmentCode"]
    },
    isEnrollmentBlocked(){
      return hasEnrollmentWarning()
    },
    blocked(){
      return this.conversation?.sola_lettura || this.isEnrollmentBlocked
    },
    lastMessage(){
      return this.conversation?.ultimo_messaggio
    },
    unSeenMessages(){
      return this.conversation?.n_messaggi_non_letti
    },
    senderIcon(){
      let isMsgReceived = this.lastMessage?.autore?.tipo === MSG_AUTHOR_MAP.DOCTOR
      return isMsgReceived ? 'south' : 'north'
    },
    doctorIcon(){

      return doctorIcon(this.doctor?.codice_fiscale)
    },
    hasMessages(){
      return this.lastMessage?.data_creazione
    }
  },
  methods:{
    onClick(){
      let route= {
        name: CONVERSATION_DETAIL.name,
        params:{
          id: this.conversation.id,
          conversation: this.conversation
        }
      }
      this.$router.push(route)
    },
    // onClickNew(){
    //   let route= {
    //     name: CONVERSATION_DETAIL_NEW.name,
    //     params:{
    //       id: this.conversation.id,
    //       conversation: this.conversation
    //     }
    //   }
    //   this.$router.push(route)
    // }
  }
}
</script>

<style lang="sass">
.cod-conversation-item
  &.cod-conversation-item--blocked
    background-color: $grey-1
    box-shadow: none !important
    border: 1px solid rgba(0, 0, 0, 0.12)
  &--msg-text
    padding-right: 24px
    max-width: 100%
    text-overflow: ellipsis
    white-space: nowrap
    overflow: hidden
</style>
