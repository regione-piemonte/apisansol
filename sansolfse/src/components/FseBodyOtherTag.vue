<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div
    ref="dropzone"
    class="fse-body-other-tag row text-bold"
    :class="classes"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="col">
      {{ label }}
    </div>
    <div class="col-2">
      {{ count }}
    </div>
  </div>
</template>

<script>
export default {
  name: "FseBodyOtherTag",
  props: {
    tag: { type: Object, required: false, default: () => null },
    count: { type: [String, Number], required: false, default: 0 }
  },
  data() {
    return {
      isDragging: false
    };
  },
  computed: {
    label() {
      return this.tag?.testo;
    },
    classes() {
      let result = [];

      if (this.isDragging) result.push("fse-body-other-tag--drag-over");

      return result;
    }
  },
  created() {},
  methods: {
    onDragEnter(event) {
      console.log("onDragEnter");
      this.isDragging = true;
      // this.$emit("dragenter");
    },
    onDragOver(event) {
      // this.isDragging = true;
    },
    onDragLeave(event) {
      // manteniamo lo stato "sono in drag" anche su elementi nested
      let el = this.$refs["dropzone"];
      let isChild = el.contains(event.fromElement);
      // console.log({ isChild, event });
      if (isChild) return;

      this.isDragging = false;
      // this.$emit("dragleave");
    },
    onDrop(event) {
      this.$emit("drop", event, this.tag);
      this.isDragging = false;
    }
  }
};
</script>

<style lang="scss">
.fse-body-other-tag--drag-over {
  background-color: $grey-4;
}
</style>
