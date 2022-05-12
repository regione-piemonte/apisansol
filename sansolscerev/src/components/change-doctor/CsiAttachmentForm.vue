<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-item class="no-padding" >
    <q-item-main>
      <q-field
        class="q-my-md"
        :error="$v.document.$error"
        required
        v-if="!isPreviousAttachment"
      >
        <q-uploader
          ref="uploader"
          :float-label="attachment.descrizione"
          url=""
          clearable
          hide-upload-button
          hide-upload-progress
          auto-expand
          class="csi-uploader"
          @add="onDocumentsAdded"
          @remove:cancel="onDocumentRemoved"
        />
        <template slot="error-label">
          <div v-if="!$v.document.required">Documento mancante</div>
          <div v-if="!$v.document.dimensionLimit">Il documento è troppo grande</div>
        </template>

      </q-field>

      <q-field
        class="q-my-md"
        v-else
      >
        <q-input
          v-model="previousAttachment.nome_file"
          :float-label="previousAttachment.descrizione"
          readonly
          :after="[{icon: 'cancel', content:true, handler: changeFile } ]"
        />
      </q-field>



    </q-item-main>
  </q-item>
</template>

<script>
    import required from "vuelidate/lib/validators/required";
    import {toBase64} from "@services/global/files";
    import {notifyError} from "@services/api/utils";
    import {isEmpty} from "@services/global/utils";

    export default {
        name: "CsiAttachmentForm",
        props:{
          attachment : {type:Object, required:true, default:{}},
          isNotDocument: {type:Boolean, default:false},

        },
        data(){
            return{
              document : null,
              documentParams: {},
              requestAttachments:null,
              previousAttachment:null,
              isPreviousAttachment: false
            }
        },
        validations(){
          return {
            document: {
              required: v => this.isPreviousAttachment || this.isNotDocument  || !!v,
              dimensionLimit: v => this.fileDimensionError(v)
            }
          }
        },
      watch:{
          isNotDocument(val){
            this.$v.document.$touch();
          },
      },
      computed: {
        userInfo() {
          return this.$store.getters['changeDoctor/getUserInfo']
        },
      },
      created(){
        this.getDefaultData()
      },
      methods:{
        getDefaultData(){
          this.requestAttachments =  this.userInfo && this.userInfo.richiesta_cambio ?  this.userInfo.richiesta_cambio.allegati : null;
          if(!isEmpty(this.requestAttachments)){
            let attachment = this.requestAttachments.find( attachment => attachment.tipo === this.attachment.tipo);
            this.previousAttachment = attachment ? attachment: null;
            if(this.previousAttachment){
              this.isPreviousAttachment = true
            }
          }
        },
        async onDocumentsAdded(files) {
          let file = files[0];
          try {
            let base64 = await toBase64(file);
            let type = !isEmpty(file.type) ? file.type : 'application/octet-stream';
            let dataTypeString =  `data:${type};base64,`;
            file.__base64 = base64.replace(dataTypeString, "");
            this.document = file;
          } catch (e) {
            notifyError(e, 'Si è verificato un errore nella lettura del file caricato')
          }
          this.$v.document.$touch();

          if (this.$v.$error) {
            return
          }

          this.setDocumentsInfo(file)
        },
        onDocumentRemoved(file) {
          this.document = null;
          this.$emit('remove-document', this.documentParams);
        },
        fileDimensionError(file) {
          const MAX_FILE_SIZE = 3 * 1024 * 1024;

          if(file){
            return  file.size <= MAX_FILE_SIZE
          }
          else{
              return true

          }

        },
        touch(){

          this.$v.document.$touch();
        },

        setDocumentsInfo(file) {
          if (file) {
            this.documentParams = {
              tipo: this.attachment.tipo,
              nome_file: file.name,
              descrizione: this.attachment.descrizione,
              base_64: file.__base64,
              stranieri: this.attachment.stranieri,
            };

            this.$emit('add-document', this.documentParams);
          }

        },
        changeFile(){
          this.isPreviousAttachment = false
        }

      }
    }
</script>

<style scoped>

</style>
