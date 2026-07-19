<script setup lang="ts">
import { openUrl } from "@/lib/url";
import { onCtrlKeyDown } from "@tb-dev/vue";
import { useColorMode } from "@vueuse/core";
import { Sonner } from "@tb-dev/vue-components";

useColorMode({
  initialValue: "dark",
  writeDefaults: true,
});

onCtrlKeyDown(["g", "G"], () => {
  openUrl("https://github.com/ferreira-tb/trunk");
});
</script>

<template>
  <main class="fixed inset-0">
    <Sonner position="top-center" />
    <div class="relative size-full overflow-hidden">
      <RouterView #default="{ Component }">
        <template v-if="Component">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </template>
      </RouterView>
    </div>
  </main>
</template>
