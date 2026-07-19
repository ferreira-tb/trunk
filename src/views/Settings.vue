<script setup lang="ts">
import { useSettings } from "@/stores/settings";
import { Checkbox, Label } from "@tb-dev/vue-components";

const settings = useSettings();
</script>

<template>
  <div class="size-full overflow-hidden p-4">
    <div class="flex flex-col gap-2">
      <Label>
        <Checkbox v-model="settings.showCardImages" />
        <span>Show card images</span>
      </Label>
    </div>
  </div>
</template>
