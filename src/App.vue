<script setup lang="ts">
import Fuse from 'fuse.js/basic';
import { toPixel } from '@tb-dev/utils';
import { useColorMode } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';
import { asyncRef, sessionRef, useWidth } from '@tb-dev/vue';
import { Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@tb-dev/vue-components';

interface TrunkEntry {
  readonly card_id: string;
  readonly name: string;
  readonly amount: number;
}

const { state: trunk } = asyncRef<readonly TrunkEntry[]>([], async () => {
  return fetch('trunk.json').then((it) => it.json());
});

const searchValue = sessionRef('trunk-search', '');

const fuse = computed(() => {
  return new Fuse(trunk.value, {
    keys: ['name'],
    threshold: 0.2,
    ignoreLocation: true,
    isCaseSensitive: false,
  });
});

const cards = computed(() => {
  const value = searchValue.value.trim();
  if (value) {
    const results = fuse.value.search(value);
    return results.map((it) => it.item);
  }
  else {
    return trunk.value;
  }
});

const table = useTemplateRef('tableEl');
const tableWidth = useWidth(table);

useColorMode({
  initialValue: 'dark',
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
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-for="card of cards" :key="card.card_id">
              <TableRow>
                <TableCell>{{ card.name }}</TableCell>
                <TableCell>{{ card.amount }}</TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>
    </div>
  </main>
</template>
