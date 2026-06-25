<script setup lang="ts">
import { compare } from "@/lib/intl";
import { FuseWorker } from "fuse.js/worker";
import { type Option, toPixel } from "@tb-dev/utils";
import { useColorMode, watchDebounced } from "@vueuse/core";
import { asyncRef, onCtrlKeyDown, sessionRef, useWidth } from "@tb-dev/vue";
import { Input, Table, TableBody, TableCell, TableRow } from "@tb-dev/vue-components";
import { nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from "vue";

interface TrunkEntry {
  readonly card_id: string;
  readonly name: string;
  readonly name_pt: Option<string>;
  readonly archetype: Option<string>;
  readonly ygoprodeck_url: Option<string>;
  readonly amount: number;
}

const { state: trunk } = asyncRef<TrunkEntry[]>([], async () => {
  return fetch("trunk.json").then((it) => it.json());
});

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

watch(() => trunk.value, async (values) => {
  await fuse.setCollection(values);
  await update();
});

watchDebounced(searchValue, update, {
  debounce: 100,
  maxWait: 300,
});

onMounted(async () => {
  await fuse.setCollection(trunk.value);
  await nextTick(update);
});

onUnmounted(() => {
  fuse.terminate();
});

onCtrlKeyDown(["g", "G"], () => {
  openUrl("https://github.com/ferreira-tb/trunk");
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
    newCards = [...trunk.value];
  }

  newCards.sort((a, b) => compare(a.name, b.name));

  cards.value = newCards;
}

function openUrl(url: string) {
  window.open(url, "_blank")?.focus();
}

function openYugipedia(entry: TrunkEntry) {
  openUrl(`https://yugipedia.com/index.php?search=${entry.name}`);
}
</script>

<template>
  <main class="fixed inset-0">
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
                @click="() => openYugipedia(card)"
                @keydown.enter="() => openYugipedia(card)"
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
  </main>
</template>
