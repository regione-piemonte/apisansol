<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-barcode-reader">
    <div ref="reader" class="csi-barcode-reader__reader"></div>

    <template v-if="supportSomeActions">
      <div class="csi-barcode-reader__actions q-pa-sm text-right">
        <template v-if="isSupportedFlash">
          <q-btn round outline dense :icon="isActiveFlash ? 'flash_off' : 'flash_on'" @click="toggleFlash">
            <q-tooltip>Torcia</q-tooltip>
          </q-btn>
        </template>
      </div>
    </template>
  </div>
</template>


<script>
  import Quagga from 'quagga';

  const TYPES_ALLOWED = [
    'ImageStream',
    'VideoStream',
    'LiveStream'
  ]

  const READERS_ALLOWED = [
    "code_128_reader",
    "ean_reader",
    "ean_8_reader",
    "code_39_reader",
    "code_39_vin_reader",
    "codabar_reader",
    "upc_reader",
    "upc_e_reader",
    "i2of5_reader",
    "2of5_reader",
    "code_93_reader"
  ]

  const PATCH_SIZES_ALLOWED = [
    'x-small',
    'small',
    'medium',
    'large',
    'x-large',
  ]

  export default {
    name: 'CsiBarcodeReader',
    components: {},
    props: {
      type: {
        type: String,
        required: false,
        default: 'LiveStream',
        validator: v => TYPES_ALLOWED.includes(v)
      },
      readers: {
        type: Array,
        required: false,
        default: () => ['code_128_reader'],
        validator: arr => arr.every(el => READERS_ALLOWED.includes(el))
      },
      patchSize: {
        type: String,
        required: false,
        default: 'medium',
        validator: v => PATCH_SIZES_ALLOWED.includes(v)
      },
      workers: {type: [String, Number], required: false, default: 4},
      frequency: {type: [String, Number], required: false, default: 10},
      locate: {type: Boolean, required: false, default: false},
      halfSample: {type: Boolean, required: false, default: false},
      multiple: {type: Boolean, required: false, default: false},
      debug: {type: Boolean, required: false, default: false},
      showBoxes: {type: Boolean, required: false, default: false},
      hideFlash: {type: Boolean, required: false, default: false},
    },
    data() {
      return {
        isSupportedFlash: false,
        isActiveFlash: false,
      }
    },
    computed: {
      supportSomeActions() {
        return this.isSupportedFlash;
      },
      watchable() {
        return [
          this.type,
          this.readers,
          this.patchSize,
          this.workers,
          this.frequency,
          this.locate,
          this.halfSample,
          this.multiple,
          this.debug
        ]
      }
    },
    mounted() {
      let config = this.getConfig()
      this.init(config);
    },
    beforeDestroy() {
      this.stop()
    },
    watch: {
      watchable: {
        deep: true,
        handler() {
          this.restart()
        }
      },
    },
    methods: {
      getConfig() {
        return {
          numOfWorkers: Number(this.workers),
          locate: this.locate,
          frequency: Number(this.frequency),
          debug: this.debug,
          inputStream: {
            name: "Live",
            type: this.type,
            target: this.$refs.reader
          },
          locator: {
            halfSample: this.halfSample,
            patchSize: this.patchSize,
            debug: {
              showCanvas: this.debug,
              showPatches: this.debug,
              showFoundPatches: this.debug,
              showSkeleton: this.debug,
              showLabels: this.debug,
              showPatchLabels: this.debug,
              showRemainingPatchLabels: this.debug,
              boxFromPatches: {
                showTransformed: this.debug,
                showTransformedBox: this.debug,
                showBB: this.debug
              }
            }
          },
          decoder: {
            readers: this.readers,
            multiple: this.multiple,
            debug: {
              drawBoundingBox: this.debug,
              showFrequency: this.debug,
              drawScanline: this.debug,
              showPattern: this.debug
            }
          }
        }
      },
      restart() {
        try {
          this.stop();
          let config = this.getConfig();
          this.init(config);
        } catch (err) {
          // Do nothing
          console.error(err);
        }
      },
      init(config) {
        let self = this;

        Quagga.onProcessed(self.onProcessed);
        Quagga.onDetected(self.onDetected);

        Quagga.init(config, function (err) {
          if (err) {
            self.$emit('init-error', err);
            return
          }

          self.detectCapabilities();
          self.start();
        });
      },
      start() {
        Quagga.start();
        this.$emit('started')
      },
      stop() {
        Quagga.offProcessed(this.onProcessed);
        Quagga.offDetected(this.onDetected);
        Quagga.stop()
        this.$emit('stopped')
      },
      onProcessed(data){
        this.$emit('processed', data);
        if (this.showBoxes) this.drawBoxes(data)
      },
      async onDetected(data){
        this.$emit('detected', data)
        let code = data && data.codeResult && data.codeResult.code || null

        if (code) {
          this.stop();

          try {
            await this.$q.dialog({
              title: 'Conferma',
              message: `Il codice letto è ${code}, è corretto?`,
              color: 'primary',
              ok: 'Sì',
              cancel: 'No, riprova',
              preventClose: true,
            });

            this.$emit('success', code);
          } catch (e) {
            // L'utente ha deciso di riprovare la lettura
            this.restart();
          }
        }
      },
      drawBoxes(result) {
        let drawingCtx = Quagga.canvas.ctx.overlay;
        let drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            let width = parseInt(drawingCanvas.getAttribute("width"));
            let height = parseInt(drawingCanvas.getAttribute("height"));
            drawingCtx.clearRect(0, 0, width, height);

            result.boxes
              .filter(box => box !== result.box)
              .forEach(box => {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
          }
        }
      },
      detectCapabilities() {
        let track = Quagga.CameraAccess.getActiveTrack();

        if (track && typeof track.getCapabilities === 'function') {
          let capabilities = track.getCapabilities();
          this.isSupportedFlash = capabilities && capabilities.torch && !this.hideFlash
        }
      },
      toggleFlash() {
        let track = Quagga.CameraAccess.getActiveTrack();

        if (track && typeof track.getCapabilities === 'function') {
          this.isActiveFlash = !this.isActiveFlash;
          track.applyConstraints({advanced: [{torch: this.isActiveFlash}]});
        }
      }
    },
  }
</script>


<style lang="stylus">

  .csi-barcode-reader,
  .csi-barcode-reader__reader
    position: relative

  .csi-barcode-reader__reader
    line-height: 0

  .csi-barcode-reader__reader video,
  .csi-barcode-reader__reader canvas
    width: 100%
    max-width: 100%

  .csi-barcode-reader__reader canvas.drawing,
  .csi-barcode-reader__reader canvas.drawingBuffer
    position: absolute
    top: 0
    left: 0

  .csi-barcode-reader__actions
    line-height: 0

  .csi-barcode-reader__code-confirm
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: rgba(0, 0, 0, .4)
</style>
