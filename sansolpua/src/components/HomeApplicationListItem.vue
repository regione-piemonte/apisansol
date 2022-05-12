<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card
    v-bind="attrs"
    v-on="listeners"
    class="home-application-list-item full-height column reverse q-pa-md no-margin overflow-hidden q-col-gutter-y-md no-margin"
    :class="classes"

  >
    <div class="col q-col-gutter-y-md column">
      <!-- NOME E  DESCRIZIONE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="col">
        <q-item class="q-px-none">
          <q-item-section side top>
            <q-icon :name="'img:' + iconUrl" size="md" class="q-mr-xs" />
          </q-item-section>

          <q-item-section top>
            <q-item-label class="text-bold" style="word-break: break-word">
              {{ appName | empty }}
            </q-item-label>
            <q-item-label class="text-caption">
              {{ categoryLabel | empty("") }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <template v-if="description">
        <div class="col">
          {{ appDescription | empty }}
        </div>
      </template>

      <template v-if="moreActions && groupLabel">
        <div class="text-caption text-italic">
          Basato su {{ groupLabel | empty }}
        </div>
      </template>

      <!-- AZIONI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <slot name="actions">
        <template v-if="isInMaintenance">
          <div class="col-auto">
            <q-separator />

            <div class="q-mt-md text-caption text-bold text-red-7 text-right">
              Momentaneamente sospeso
            </div>
          </div>
        </template>

        <template v-else-if="actions">
          <div class="col-auto">
            <q-separator class="gt-xs"/>

            <div class="row items-center q-mt-md" :class="{'reverse': user}">
              <!-- SOLO GLI UTENTI ANONIMI VEDONO I LUCCHETTI -->
              <template v-if="!user">
                <div class="col-auto gt-xs">
                  <template v-if="isLocked">
                    <q-icon name="lock" size="sm" class="q-mr-sm"  />
                    <a  :href="url" class="lms-link">
                     <span class="text-caption text-bold" >Accedi per usare il servizio</span>
                    </a>
                  </template>
                  <template v-else>
                    <q-icon name="lock_open" size="sm" />
                  </template>
                </div>

                <div class="col-auto lt-sm">
                  <template v-if="isLocked">
                    <q-icon name="lock" size="xs" class="q-mr-sm" />
                    <a  :href="url" class="lms-link">
                    <span class="text-caption text-bold">Accedi per usare il servizio</span>
                    </a>
                  </template>
                </div>
              </template>

              <div class="col-12 col-sm">
                <lms-buttons>
                  <template v-if="!isLocked">
                    <lms-button
                      outline
                      unelevated
                      dense
                      type="a"
                      :href="url"
                      label="Vai al servizio"
                    />
                  </template>

                  <!--                <lms-button no-min-width outline dense label="Maggiori info" />-->
                </lms-buttons>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="col-auto">

            <div class="row items-center reverse  q-mt-md" >
            <template v-if="isLocked"  >
              <div class="q-mb-sm col-12 col-sm-auto" >

                  <q-icon name="lock" size="xs" class="q-mr-sm" />
                <a  :href="url" class="lms-link">
                  <span class="text-caption text-bold">Accedi per usare il servizio</span>
                </a>

              </div>

            </template>
              <template v-else>
                <div class="col-12 col-sm" >
                  <lms-buttons>
                    <lms-button
                      :no-min-width="$q.screen.gt.md && user"
                      unelevated
                      outline
                      dense
                      type="a"
                      :href="url"
                      label="Vai al servizio"
                    />
                  </lms-buttons>
                </div>

              </template>
              </div>
          </div>



        </template>
      </slot>
    </div>
    <!-- HEADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="col-auto q-pt-none">
      <div class="row">
        <template v-if="!anonymous">
          <div class="col-auto">
            <button
               class="no-padding no-border bg-transparent"
               @click.prevent.stop="
                favorite ? onFavoriteRemove() : onFavoriteAdd()
              "
               :aria-label="favorite ? 'Rimuovi dai servizi preferiti' : 'Aggiungi ai servizi preferiti'">
              <q-icon
                :name="favorite ? 'star' : 'star_border'"
                color="pink-8"
                size="sm"
                class="home-application-list-item__favorite-icon"
              >
                <q-tooltip
                  class="desktop-only"
                  content-class="bg-pink-8 text-caption"
                >
                  <template v-if="favorite">
                    Rimuovi dai servizi preferiti
                  </template>
                  <template v-else>
                    Aggiungi ai servizi preferiti
                  </template>
                </q-tooltip>
              </q-icon>
            </button>
          </div>
        </template>

        <q-space />

        <template v-if="moreActions">
          <div class="col-auto">
            <q-btn
              flat
              round
              dense
              size="sm"
              icon="more_vert"
              aria-label="Menu azioni"
              @click.prevent.stop=""
            >
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item
                    v-close-popup
                    tag="a"
                    clickable
                    :href="appDetailInfoUrl"
                  >
                    <q-item-section>Maggiori informazioni</q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    tag="a"
                    clickable
                    :href="appDetailFaqUrl"
                  >
                    <q-item-section>FAQ</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </template>

        <template v-if="!moreActions && groupLabel">
          <div class="text-caption text-italic">
            Basato su {{ groupLabel | empty }}
          </div>
        </template>
      </div>
    </div>


  </q-card>

<!--  <q-card-->
<!--    v-bind="attrs"-->
<!--    v-on="listeners"-->
<!--    class="home-application-list-item full-height column reverse q-pa-md no-margin overflow-hidden q-col-gutter-y-md no-margin"-->
<!--    :class="classes"-->

<!--  >-->
<!--    <div class="col q-col-gutter-y-md column">-->
<!--      &lt;!&ndash; NOME E  DESCRIZIONE &ndash;&gt;-->
<!--      &lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
<!--      <div class="col">-->
<!--        <q-item class="q-px-none">-->
<!--          <q-item-section side top>-->
<!--            <q-icon :name="'img:' + iconUrl" size="md" class="q-mr-xs" />-->
<!--          </q-item-section>-->

<!--          <q-item-section top>-->
<!--            <q-item-label class="text-bold" style="word-break: break-word">-->
<!--              {{ appName | empty }}-->
<!--            </q-item-label>-->
<!--            <q-item-label class="text-caption">-->
<!--              {{ categoryLabel | empty("") }}-->
<!--            </q-item-label>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--      </div>-->

<!--      <template v-if="description">-->
<!--        <div class="col">-->
<!--          {{ appDescription | empty }}-->
<!--        </div>-->
<!--      </template>-->

<!--      <template v-if="moreActions && groupLabel">-->
<!--        <div class="text-caption text-italic">-->
<!--          Basato su {{ groupLabel | empty }}-->
<!--        </div>-->
<!--      </template>-->

<!--      &lt;!&ndash; AZIONI &ndash;&gt;-->
<!--      &lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
<!--      <slot name="actions">-->
<!--        <template v-if="isInMaintenance">-->
<!--          <div class="col-auto">-->
<!--            <q-separator />-->

<!--            <div class="q-mt-md text-caption text-bold text-red-7 text-right">-->
<!--              Momentaneamente sospeso-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->

<!--        <template v-else-if="actions">-->
<!--          <div class="col-auto">-->
<!--            <q-separator />-->

<!--            <div class="row items-center q-mt-md">-->
<!--              &lt;!&ndash; SOLO GLI UTENTI ANONIMI VEDONO I LUCCHETTI &ndash;&gt;-->
<!--              <template v-if="!user">-->
<!--                <div class="col-auto gt-xs">-->
<!--                  <template v-if="isLocked">-->
<!--                    <q-icon name="lock" size="sm" />-->
<!--                  </template>-->
<!--                  <template v-else>-->
<!--                    <q-icon name="lock_open" size="sm" />-->
<!--                  </template>-->
<!--                </div>-->
<!--              </template>-->

<!--              <div class="col">-->
<!--                <lms-buttons>-->
<!--                  <template v-if="!isLocked">-->
<!--                    <lms-button-->
<!--                      no-min-width-->
<!--                      unelevated-->
<!--                      dense-->
<!--                      type="a"-->
<!--                      :href="url"-->
<!--                      label="Vai al servizio"-->
<!--                    />-->
<!--                  </template>-->

<!--                  &lt;!&ndash;                <lms-button no-min-width outline dense label="Maggiori info" />&ndash;&gt;-->
<!--                </lms-buttons>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </slot>-->
<!--    </div>-->
<!--    &lt;!&ndash; HEADER &ndash;&gt;-->
<!--    &lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
<!--    <div class="col-auto q-pt-none">-->
<!--      <div class="row">-->
<!--        <template v-if="!anonymous">-->
<!--          <div class="col-auto">-->
<!--            <button-->
<!--              class="no-padding no-border bg-transparent"-->
<!--              @click.prevent.stop="-->
<!--                favorite ? onFavoriteRemove() : onFavoriteAdd()-->
<!--              "-->
<!--              :aria-label="favorite ? 'Rimuovi dai servizi preferiti' : 'Aggiungi ai servizi preferiti'">-->
<!--              <q-icon-->
<!--                :name="favorite ? 'star' : 'star_border'"-->
<!--                color="pink-8"-->
<!--                size="sm"-->
<!--                class="home-application-list-item__favorite-icon"-->
<!--              >-->
<!--                <q-tooltip-->
<!--                  class="desktop-only"-->
<!--                  content-class="bg-pink-8 text-caption"-->
<!--                >-->
<!--                  <template v-if="favorite">-->
<!--                    Rimuovi dai servizi preferiti-->
<!--                  </template>-->
<!--                  <template v-else>-->
<!--                    Aggiungi ai servizi preferiti-->
<!--                  </template>-->
<!--                </q-tooltip>-->
<!--              </q-icon>-->
<!--            </button>-->
<!--          </div>-->
<!--        </template>-->

<!--        <template v-else-if="isLocked"  >-->
<!--          <div class="col-auto">-->
<!--            <q-icon name="lock" size="xs" class="q-mr-sm" />-->
<!--            <span class="text-caption">Accedi per usare il servizio</span>-->
<!--          </div>-->
<!--        </template>-->
<!--        <q-space />-->

<!--        <template v-if="moreActions">-->
<!--          <div class="col-auto">-->
<!--            <q-btn-->
<!--              flat-->
<!--              round-->
<!--              dense-->
<!--              size="sm"-->
<!--              icon="more_vert"-->
<!--              aria-label="Menu azioni"-->
<!--              @click.prevent.stop=""-->
<!--            >-->
<!--              <q-menu>-->
<!--                <q-list style="min-width: 100px">-->
<!--                  <q-item-->
<!--                    v-close-popup-->
<!--                    tag="a"-->
<!--                    clickable-->
<!--                    :href="appDetailInfoUrl"-->
<!--                  >-->
<!--                    <q-item-section>Maggiori informazioni</q-item-section>-->
<!--                  </q-item>-->
<!--                  <q-item-->
<!--                    v-close-popup-->
<!--                    tag="a"-->
<!--                    clickable-->
<!--                    :href="appDetailFaqUrl"-->
<!--                  >-->
<!--                    <q-item-section>FAQ</q-item-section>-->
<!--                  </q-item>-->
<!--                </q-list>-->
<!--              </q-menu>-->
<!--            </q-btn>-->
<!--          </div>-->
<!--        </template>-->

<!--        <template v-if="!moreActions && groupLabel">-->
<!--          <div class="text-caption text-italic">-->
<!--            Basato su {{ groupLabel | empty }}-->
<!--          </div>-->
<!--        </template>-->
<!--      </div>-->
<!--    </div>-->


<!--  </q-card>-->
</template>

<script>
import * as urls from "src/services/urls";

export default {
  name: "HomeApplicationListItem",
  inheritAttrs: false,
  props: {
    app: { type: Object, required: false, default: null },
    anonymous: { type: Boolean, required: false, default: false },
    favorite: { type: Boolean, required: false, default: false },
    description: { type: Boolean, required: false, default: false },
    actions: { type: Boolean, required: false, default: false },
    moreActions: { type: Boolean, required: false, default: false },
    isInMaintenance: { type: Boolean, required: false, default: false }
  },
  data() {
    return {};
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    user() {
      return this.$store.getters["getUser"];
    },
    appName() {
      return this.app?.descrizione ?? "";
    },
    appCode() {
      return this.app?.portale_codice ?? "";
    },
    appDescription() {
      return this.app?.descrizione_estesa ?? "";
    },
    iconUrl() {
      return this.app?.icona_url ?? "";
    },
    groupLabel() {
      return this.app?.gruppo?.descrizione ?? "";
    },
    categoryLabel() {
      return this.app?.categoria?.descrizione ?? "";
    },
    url() {
      return this.app?.url ?? "";
    },
    isPublic() {
      return this.app?.pubblico;
    },
    isLocked() {
      return this.anonymous && !this.isPublic;
    },
    classes() {
      let result = [];
      if (this.isLocked) result.push("home-application-list-item--locked");
      // if( this.actions) result.push("home-application-list-item--actions");
      return result;
    },
    appDetailInfoUrl() {
      return urls.appDetailInfo(this.appCode);
    },
    appDetailFaqUrl() {
      return urls.appDetailFaq(this.appCode);
    }
  },
  created() {},
  methods: {
    onFavoriteAdd() {
      this.$emit("click-favorite-add");
    },
    onFavoriteRemove() {
      this.$emit("click-favorite-remove");
    }
  }
};
</script>

<style scoped lang="sass">
.home-application-list-item
  transition: all .5s ease

  &:hover
    box-shadow: nth($shadows, 3) !important
    //background-color: $blue-1

  &.home-application-list-item--locked
    background-color: $grey-1
    // box-shadow: none !important
    // border: 1px solid $grey-6

  .home-application-list-item__favorite-icon
    transition: transform .5s ease

    &:hover
      transform: rotate(215deg) scale(1.5)

  &.home-application-list-item--actions
    &:hover
      background-color: $blue-1
</style>
