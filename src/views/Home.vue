<script setup lang="ts">
import { compare } from "@/lib/intl";
import { useRouter } from "vue-router";
import { toPixel } from "@tb-dev/utils";
import { FuseWorker } from "fuse.js/worker";
import { sessionRef, useWidth } from "@tb-dev/vue";
import { useColorMode, watchDebounced } from "@vueuse/core";
import trunk from "../assets/trunk.json" with { type: "json" };
import { nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef } from "vue";
import { Input, Table, TableBody, TableCell, TableRow } from "@tb-dev/vue-components";

const router = useRouter();

const searchValue = sessionRef("trunk-search", "");

const fuse = new FuseWorker([] as TrunkEntry[], {
  keys: ["name", "name_pt", "archetype"],
  threshold: 0.2,
  ignoreLocation: true,
  isCaseSensitive: false,
}, {
  numWorkers: 4,
});

const cards = shallowRef<TrunkEntry[]>([]);

const table = useTemplateRef("tableEl");
const tableWidth = useWidth(table);

useColorMode({
  initialValue: "dark",
  writeDefaults: true,
});

watchDebounced(searchValue, update, {
  debounce: 100,
  maxWait: 300,
});

onMounted(async () => {
  await fuse.setCollection(trunk);
  await nextTick(update);
});

onUnmounted(() => {
  fuse.terminate();
});

async function update() {
  let newCards: TrunkEntry[];
  const search = searchValue.value.trim();

  if (search) {
    const results = await fuse.search(search);
    newCards = results.map((result) => {
      return result.item;
    });
  }
  else {
    newCards = [...trunk];
  }

  newCards.sort((a, b) => compare(a.name, b.name));

  cards.value = newCards;
}

async function goToCardView(card: TrunkEntry) {
  await router.push(`/card/${card.card_id}`);
}
</script>

<template>
  <div class="size-full flex flex-col gap-2 overflow-hidden p-4">
    <div class="flex items-center">
      <Input
        v-model="searchValue"
        :style="{ width: toPixel(tableWidth) }"
        @keydown.stop
      />
    </div>

    <div class="size-full overflow-auto pr-4">
      <Table ref="tableEl" class="min-w-max">
        <TableBody>
          <template v-for="card of cards" :key="card.card_id">
            <TableRow
              v-if="card.amount > 0"
              role="link"
              tabindex="0"
              class="cursor-pointer"
              @click.stop="() => void goToCardView(card)"
              @keydown.enter.stop="() => void goToCardView(card)"
              @keydown.space.stop="() => void goToCardView(card)"
            >
              <TableCell class="max-w-min p-0">
                <span class="px-2 lg:pr-4">{{ card.amount }}</span>
              </TableCell>
              <TableCell class="w-full">
                <span>{{ card.name }}</span>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
