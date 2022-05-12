<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div
    ref="dropzone"
    class="fse-body-section-tag"
    :class="{ 'fse-body-section-tag--focused': isDragging }"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    @click="onClick"
  >
    <template v-if="!isHover">
      <div class="fse-body-section-tag__inner">
        <q-btn round outline dense class="fse-body-section-tag__count">
          {{ tagCountBodySection }}
        </q-btn>

        <span class="fse-body-section-tag__line" :style="lineStyle"></span>

        <div class="fse-body-section-tag__label text-caption">
          {{ label }}
        </div>
      </div>
    </template>

    <template v-else>
      <div class="q-pa-md">
        <div class="row q-col-gutter-xs">
          <div
            v-for="tag in tagListBodySection"
            :key="'h--' + tag.id"
            class="col-auto"
          >
            <q-badge class="text-bold q-px-sm q-py-xs">
              {{ tag.testo }}: {{ getTagCount(tag) }}
            </q-badge>
          </div>
        </div>
      </div>
    </template>

    <template v-if="isDragging">
      <div class="q-pa-md z-top">
        <q-card class="z-top">
          <q-list>
            <q-item
              :ref="'tagFixed' + tag.id"
              v-for="tag in tagListBodySection"
              :key="tag.id"
              :class="{
                'fse-body-section-tag__item--focused': draggingTag === tag
              }"
              @dragenter.prevent="onDragEnterTag($event, tag)"
              @dragover.prevent="onDragOverTag($event, tag)"
              @dragleave.prevent="onDragLeaveTag($event, tag)"
              @drop.prevent="onDropTag($event, tag)"
            >
              <q-item-section>
                {{ tag.testo }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </div>
</template>

<script>
import {
  groupTagCountsFixedByBodySection,
  groupTagListFixedByBodySection
} from "../services/business-logic";
import { TAG_TYPE_MAP } from "../services/config";

export default {
  name: "FseBodySectionTag",
  props: {
    count: { type: [String, Number], required: false, default: 0 },
    lineWidth: { type: [String, Number], required: false, default: 20 },
    label: { type: String, required: false, default: "" },
    type: { type: String, required: true, default: "head" },
    tagList: { type: Array, required: false, default: () => [] },
    tagCount: { type: Array, required: false, default: () => [] }
  },
  data() {
    return {
      isHover: false,
      isDragging: false,
      draggingTag: null
    };
  },
  computed: {
    lineStyle() {
      let result = [];
      result.push(`width: ${this.lineWidth}px;`);
      return result.join(" ");
    },
    tagListFixed() {
      return this.tagList.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.FIXED
      );
    },
    tagListGrouped() {
      return groupTagListFixedByBodySection(this.tagListFixed);
    },
    tagListBodySection() {
      return this.tagListGrouped[this.type];
    },
    tagCountGrouped() {
      return groupTagCountsFixedByBodySection(this.tagCount);
    },
    tagCountBodySection() {
      return this.tagCountGrouped[this.type];
    }
  },
  created() {},
  methods: {
    onClick(event) {
      this.$emit("click", event, this.type, this.tagListBodySection);
    },
    getTagCount(tag) {
      let count = this.tagCount.find(el => el.etichetta.id === tag.id);
      return count?.numero_documenti ?? 0;
    },
    onDragEnter(event) {
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
      // this.$emit("drop", event);
      this.isDragging = false;
    },
    onDragEnterTag(event, tag) {
      this.draggingTag = tag;
      // let el = this.$refs["tagFixed" + tag.id][0].$el;
      // el.classList.add("fse-body-section-tag__item--focused");
      // console.log("dragenter", tag.testo, { event, tag });
    },
    onDragOverTag(event, tag) {
      // console.log("dragover", tag.testo, { event, tag });
    },
    onDragLeaveTag(event, tag) {
      let el = this.$refs["tagFixed" + tag.id][0].$el;
      let isChild = el.contains(event.fromElement);
      if (isChild) return;

      // el.classList.remove("fse-body-section-tag__item--focused");
      // console.log("dragleave", tag.testo, { event, tag });
      this.draggingTag = null;
    },
    onDropTag(event, tag) {
      // let el = this.$refs["tagFixed" + tag.id][0].$el;
      // el.classList.remove("fse-body-section-tag__item--focused");
      // console.log("drop", tag.testo, { event, tag });
      this.draggingTag = null;
      this.$emit("drop", event, tag);
    }
  }
};
</script>

<style lang="scss">
.fse-body-section-tag {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  // border: 1px solid red;

  &:hover,
  &--focused {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.fse-body-section-tag__inner {
  padding-left: 16px;
  padding-right: 16px;
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}

.fse-body-section-tag__count {
  pointer-events: none;
  background-color: #73d7ff !important;
}

.fse-body-section-tag__line {
  display: inline-block;
  margin-left: 4px;
  border-bottom: 2px solid black;
}

.fse-body-section-tag__label {
  font-weight: bold;
  margin-top: 4px;
}

.fse-body-section-tag__item--focused {
  background-color: $grey-4;
}
</style>
