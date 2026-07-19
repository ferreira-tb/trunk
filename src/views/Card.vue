<script setup lang="ts">
import { computed } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useSettings } from "@/stores/settings";
import { openLiga, openYugipedia } from "@/lib/url";
import { Badge, Button } from "@tb-dev/vue-components";
import trunk from "../assets/trunk.json" with { type: "json" };

const settings = useSettings();

const cardId = useRouteQuery("id");
const card = computed(() => {
  return trunk.find((it) => it.card_id === cardId.value);
});

const description = computed(() => {
  return card.value?.description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
});
</script>

<template>
  <div class="size-full overflow-hidden p-4">
    <div v-if="card" class="size-full flex flex-col gap-2">
      <img
        v-if="settings.showCardImages"
        :src="`https://tsukilabs.dev.br/ygo/${card.card_id}`"
        :alt="card.name"
        decoding="async"
        loading="eager"
        referrerpolicy="origin"
        class="max-h-1/2 object-scale-down"
      >

      <div class="h-full flex flex-col justify-between gap-1 overflow-hidden">
        <div class="flex flex-col gap-1 overflow-x-hidden overflow-y-auto pr-2">
          <div class="flex justify-between gap-2">
            <h1 class="font-bold select-text">{{ card.name }}</h1>
            <div class="flex justify-end items-center gap-1">
              <Badge
                v-if="card.banlist_status === 'Forbidden'"
                variant="outline"
                class="max-h-max text-red-500"
              >
                <span>F</span>
              </Badge>
              <Badge
                v-else-if="card.banlist_status === 'Limited'"
                variant="outline"
                class="max-h-max text-orange-500"
              >
                <span>L</span>
              </Badge>
              <Badge
                v-else-if="card.banlist_status === 'Semi-Limited'"
                variant="outline"
                class="max-h-max text-yellow-500"
              >
                <span>S</span>
              </Badge>
            </div>
          </div>

          <p v-for="(line, idx) of description" :key="idx" class="select-text">{{ line }}</p>
        </div>

        <div class="grid grid-cols-2 justify-center items-center gap-2">
          <Button variant="outline" @click="() => void (card && openLiga(card))">
            <span>Buy</span>
          </Button>

          <Button variant="outline" @click="() => void (card && openYugipedia(card))">
            <span>Wiki</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
