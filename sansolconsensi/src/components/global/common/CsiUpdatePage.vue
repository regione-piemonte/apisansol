<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<!--    <q-page-container>-->
      <q-page padding>
        <div class="row items-center justify-around">
          <div class="col-10 col-sm-8 col-md-6 col-lg-4">
            <img src="statics/images/banners/img_aggiorna_pwa.svg" alt="Manutenzione" class="responsive">
          </div>
        </div>


        <div class="text-center">
            <h1 class="csi-h1 text-primary q-my-md">E' necessario un aggiornamento.</h1>
            <p>Sul tuo dispositivo è salvata una versione non più supportata.</p>
            <p>Clicca su aggiorna per proseguire con la navigazione.</p>
          <div class="row justify-center">
            <!--<csi-buttons class="center">
              <csi-button primary  class="center" label="Aggiorna" @click="update" />
            </csi-buttons>-->
            <strong>
              Aspetta un secondo! A breve comparirà un banner azzurro in basso a destra. <br>
              Clicca sul bottone "Aggiorna" per ottenere la nuova versione.
            </strong>
          </div>
        </div>
      </q-page>
<!--    </q-page-container>-->
</template>


<script>
export default {
  methods: {
    update() {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        if (reg)
          reg.unregister().then(function() {
            window.location.reload(true);
          });
        else window.location.reload(true);
      });
    }
  }
};
</script>
