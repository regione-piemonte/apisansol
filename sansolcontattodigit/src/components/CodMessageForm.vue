<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card>
    <q-card-section>
      <q-input v-model="text"
               bg-color="white"
               no-error-icon
               outlined
               placeholder="Scrivi messaggio"
               type="textarea"
      />

      <div v-if="attachments.length >0" class="q-mt-lg">
        <q-chip v-for="attachment in attachments" :key="attachment.id_documento_ilec" color="grey-3" removable
                square @remove="removeAttachment(attachment.id_documento_ilec)">
          <strong class="q-pr-sm ">{{ attachmentName(attachment) }}</strong>
        </q-chip>
      </div>

      <div class="q-pt-md">
        <a class="lms-link " href="#" @click.prevent="showDocumentListDialog = true">
          <q-icon name="attach_file" size="xs"></q-icon>

          Condividi documento del Fascicolo Sanitario</a>
      </div>

      <lms-buttons>
        <lms-button @click="sendMessage">Invia</lms-button>
      </lms-buttons>

      <cod-document-list-dialog v-model="showDocumentListDialog" :attachment-list="attachments"
                                @on-attachment="onAttachment" @remove-attachment="removeAttachment"/>

    </q-card-section>
  </q-card>
</template>

<script>
import {date} from "quasar";
import CodDocumentListDialog from "components/CodDocumentListDialog";

export default {
  name: "CodMessageForm",
  components: {CodDocumentListDialog},
  data() {
    return {
      text: '',
      attachments: [],
      showDocumentListDialog: false
    }
  },
  computed: {
    computed: {
      user() {
        return this.$store.getters["getUser"];
      },
      attrs() {
        const {...attrs} = this.$attrs;
        return attrs;
      },
      listeners() {
        const {...listeners} = this.$listeners;
        return listeners;
      },

    },
  },
  methods: {
    onAttachment(attachment) {
      this.showDocumentListDialog = false
      this.attachments.push(attachment)
    },

    attachmentName(attachment) {
      let structureName = attachment.descrizione_struttura ?? ''
      let aslName = attachment.azienda?.descrizione ?? ''
      let issueDate = attachment.data_validazione ? date.formatDate(attachment.data_validazione, 'DD/MM/YYYY') : ''

      return `${structureName} - ${aslName} - ${issueDate}`

    },
    removeAttachment(id) {
      this.attachments = this.attachments.filter(a => a.id_documento_ilec !== id)
    },
    sendMessage() {
      let params = {
        testo: this.text,
        allegati: this.attachments
      }

      this.$emit('new-message', params)
    }
  }
}
</script>

<style scoped>

</style>
