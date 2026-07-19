<script setup lang="ts">
import { compare } from "@/lib/intl";
import { MenuIcon } from "@lucide/vue";
import { sessionRef } from "@tb-dev/vue";
import { go, type Route } from "@/router";
import { FuseWorker } from "fuse.js/worker";
import { onBeforeRouteLeave } from "vue-router";
import { useColorMode, watchDebounced } from "@vueuse/core";
import trunk from "../assets/trunk.json" with { type: "json" };
import { nextTick, onActivated, onMounted, onUnmounted, shallowRef } from "vue";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@tb-dev/vue-components";

const cards = shallowRef<TrunkEntry[]>([]);
const currentCard = shallowRef<TrunkEntry>();

const searchValue = sessionRef("trunk-search", "");

const fuse = new FuseWorker([] as TrunkEntry[], {
  keys: ["name", "name_pt", "archetype"],
  threshold: 0.2,
  ignoreLocation: true,
  isCaseSensitive: false,
}, {
  numWorkers: 4,
});

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

onActivated(async () => {
  if (currentCard.value) {
    const id = getRowId(currentCard.value);
    await document.waitScroll(`#${id}`, {
      behavior: "instant",
      block: "start",
      inline: "nearest",
      timeout: 2_000,
      throwOnTimeout: false,
    });
  }
});

onBeforeRouteLeave((to) => {
  if (to.name !== ("home" satisfies Route)) {
    const rows = document.queryAsArray(".card-table-row")
      .filter((row) => isVisible(row));

    const row = rows.at(1) ?? rows.at(0);
    currentCard.value = cards.value.find((card) => {
      return row?.id === getRowId(card);
    });
  }
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
  await go("card", { query: { id: card.card_id } });
}

function getRowId(card: TrunkEntry) {
  return `card-${card.card_id}`;
}

function isVisible(element: Element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}
</script>

<template>
  <div class="size-full grid grid-cols-1 gap-2 overflow-hidden p-4">
    <div class="flex items-center gap-2">
      <Input v-model="searchValue" @keydown.stop />
      <div class="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
              <MenuIcon stroke-width="1.5px" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" :align-offset="-15" side="bottom" class="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RouterLink :to="{ name: 'settings' satisfies Route }" class="w-full">
                  <span>Settings</span>
                </RouterLink>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div class="size-full overflow-auto pr-4">
      <Table class="min-w-max">
        <TableBody>
          <template v-for="card of cards" :key="card.card_id">
            <TableRow
              v-if="card.amount > 0"
              :id="getRowId(card)"
              role="link"
              tabindex="0"
              class="card-table-row cursor-pointer"
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
