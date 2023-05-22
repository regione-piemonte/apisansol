<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-chat-message
    :bg-color="chatColor"
    :sent="!isDoctorMsg"
    :size="$q.screen.gt.md ? '6' : '11'"
    class="q-px-md"
    :class="classes"
  >
    <template v-slot:avatar>
      <q-icon
        :name="chatAvatar"
        :style="!isDoctorMsg ? 'left:16px' : 'right:16px'" size="sm"
      />

    </template>
    <template v-slot:stamp>
      <div class="row items-end  q-mt-md q-col-gutter-y-xs">
        <template v-if="isDoctorMsg">
          <div class="col col-sm text-caption">
            <div>
             <span v-if="isEdited">Modificato il</span> {{ messageDate | datetime }}
            </div>
            <div class="text-caption text-italic" v-if="isEdited" >Modificato</div>
          </div>
        </template>
        <template v-else>
          <div class="col-12 col-sm text-caption">
            <div>
              <span v-if="isEdited">Modificato il</span> {{ messageDate | datetime }}
            </div>
            <div v-if="isDelegator">Inviato da delegato {{author.codice_fiscale}}</div>
          </div>


          <div class="col-12 col-sm text-caption text-italic " v-if="isEdited" :class="{'text-right': $q.screen.gt.xs}">
            <div :class="{'q-mr-sm' : readNotification && readNotification }" >{{changeText}}</div>

          </div>

          <div  class="col-12 col-sm-auto text-right" v-if="readNotification">
            <q-icon v-if="isRead" color="secondary" name="done_all"
                    size="sm"/>
          </div>
        </template>

      </div>

    </template>

    <template v-slot:default>
      <div class="row items-start">
        <div class="col">
          <p class="q-mb-xs pre-class"  ref="codMessageText"> {{ messageText }}</p>
          <div v-if="attachments.length>0" class="q-mt-md">
            <div v-for="attachment in attachments" :key="attachment.id" class="q-py-sm">

              <a class="lms-link" :href="attachmentName(attachment)" @click.prevent="$emit('show-document',attachment)">
                <div class="row">
                  <div class="col-auto q-pr-xs" >   <q-icon name="attach_file" size="xs"  /></div>

                  <div class="col">    {{ attachmentName(attachment) }}
                    <span class="text-italic" v-if="attachment.accession_numbers && attachment.accession_numbers.length>0">(contiene immagini)</span></div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <template v-if="isMessageEditable">
          <q-btn
            aria-label="Menu opzioni"
            class="col-auto"
            dense
            flat
            icon="more_vert"
            round
          >
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 180px">
                <q-item v-close-popup clickable @click="$emit('edit-message', message)">
                  <q-item-section>Modifica</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <div v-else class="q-px-md"></div>

      </div>

    </template>

  </q-chat-message>
</template>

<script>
import {MSG_AUTHOR_MAP} from "src/services/config";
import {getGender} from "src/services/tax-code";
import {date} from "quasar";
import {apiErrorNotify, apiErrorNotifyDialog, isEmpty} from "src/services/utils";
import {attachmentName, searchMessageRegex} from "src/services/business-logic";
import {getDocumentDetail, getDocumentPdfUrl, getDocumentPersonalAttachmentPdfUrl} from "src/services/api";
import CodDocumentItemDetail from "components/CodDocumentItemDetail";

export default {
  name: "CodMessageItem",
  components: {},
  props: {
    message: {type: Object, default: null},
    focused: {type: Boolean, default: false},
    searchedText: {type: String, default: ''},
    readNotification: {type: Boolean, default: false},
  },
  data(){
    return{
      isLoadingDocumentDetail:false,
      showDocumentDetail:false,
      document:null

    }
  },
  computed: {
    messageText(){
      return this.message?.testo
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    isRead(){
      return this.message?.letto
    },
    author(){
      return this.message?.autore
    },
    isDoctorMsg() {
      return this.author?.tipo === MSG_AUTHOR_MAP?.DOCTOR
    },
    chatColor() {
      return this.isDoctorMsg ? 'chat-pink' : 'chat-blue'
    },
    chatAvatar() {
      let patientGender = getGender(this.taxCode)
      let userAvatar = ''

      if(this.isDelegator){
        let delegatorGender = getGender(this.author?.codice_fiscale)
        userAvatar = `avatar-delegato-${patientGender.toLowerCase()}-${delegatorGender.toLowerCase()}`
      }else{
        userAvatar = patientGender === 'F' ? 'avatar-donna' : 'avatar-uomo'
      }

      let img = this.isDoctorMsg ? 'medico-uomo' : userAvatar

      return `img:/statics/la-mia-salute/icone/${img}.svg`
    },
    isDelegator(){
      return this.author?.tipo === MSG_AUTHOR_MAP.DELEGATOR
    },
    isEdited(){
      return this.message?.modificato
    },
    changeText(){
      let author = this.message?.autore_modifica

      if(this.isDoctorMsg){
        return `Modificato`
      }
      else if(author === this.taxCode){
        return `Modificato da te`
      } else{
        return `Modificato dal delegato ${author}`
      }

    },
    attachments() {
      return this.message?.allegati ?? []
    },
    isMessageEditable() {
      return this.message?.modificabile && !this.isDoctorMsg
    },
    messageDate(){
      let date = this.message?.data_creazione

      if(this.isEdited && this.message?.data_modifica) {
        date = this.message?.data_modifica
      }
       return date
    },
    classes(){
      let result = [];
      if(this.focused){
        result.push(`cod-message-item__focused`);
      }
      return result
    }
  },
  watch:{
    searchedText:{
      immediate:true,
      handler(val, oldVal){
        let selectedText = this.$refs.codMessageText
        let innerHTML = selectedText?.innerHTML
        if(!innerHTML) return

        let newText = innerHTML.replaceAll('<span class="highlight">', '');
        newText = newText.replaceAll('</span>', '');
        selectedText.innerHTML = newText;

        if(!isEmpty(val)){
          const regex = searchMessageRegex(val)
          newText = newText.replaceAll(regex, '<span class="highlight">$&</span>');
          selectedText.innerHTML = newText;

        }


      }
    }
  },
  methods:{
    attachmentName,

  }
}
</script>

<style lang="sass">
.cod-message-item__focused
  background-color: transparent
  animation-name: change-bg
  animation-duration: 5s

.highlight
  background-color: rgba($lms-secondary,0.5)

@keyframes change-bg
  0%
    background-color: rgba($lms-secondary,0.1)


.pre-class
  white-space: pre-wrap
  word-wrap: break-word
  font-family: inherit



</style>
