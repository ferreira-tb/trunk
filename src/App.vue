<script setup lang="ts">
import Fuse from "fuse.js/basic";
import { compare } from "@/lib/intl";
import { useColorMode } from "@vueuse/core";
import { computed, useTemplateRef } from "vue";
import { type Option, toPixel } from "@tb-dev/utils";
import { asyncRef, sessionRef, useWidth } from "@tb-dev/vue";
import { Input, Table, TableBody, TableCell, TableRow } from "@tb-dev/vue-components";

interface TrunkEntry {
  readonly card_id: string;
  readonly name: string;
  readonly name_pt: Option<string>;
  readonly archetype: Option<string>;
  readonly amount: number;
}

const { state: trunk } = asyncRef<readonly TrunkEntry[]>([], async () => {
  return fetch("trunk.json").then((it) => it.json());
});

const searchValue = sessionRef("trunk-search", "");

const fuse = computed(() => {
  return new Fuse(trunk.value, {
    keys: ["name", "name_pt", "archetype"],
    threshold: 0.2,
    ignoreLocation: true,
    isCaseSensitive: false,
  });
});

const cards = computed(() => {
  const value = searchValue.value.trim();
  if (value) {
    const results = fuse.value.search(value);
    return results
      .map((it) => it.item)
      .toSorted((a, b) => compare(a.name, b.name));
  }
  else {
    return trunk.value;
  }
});

const table = useTemplateRef("tableEl");
const tableWidth = useWidth(table);

useColorMode({
  initialValue: "dark",
  writeDefaults: true,
});
</script>

<template>
  <main class="fixed inset-0">
    <div class="size-full flex flex-col gap-2 overflow-hidden p-4">
      <div class="flex items-center">
        <Input v-model="searchValue" :style="{ width: toPixel(tableWidth) }" />
      </div>

      <div class="size-full overflow-auto pr-4">
        <Table ref="tableEl" class="min-w-max">
          <TableBody>
            <template v-for="card of cards" :key="card.card_id">
              <TableRow>
                <TableCell class="max-w-max p-0">
                  <span class="px-2">{{ card.amount }}</span>
                </TableCell>
                <TableCell>
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
