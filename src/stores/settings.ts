import { defineStore } from "pinia";
import { localRef } from "@tb-dev/vue";

export const useSettings = defineStore("settings", () => {
  const showCardImages = localRef(key("showCardImages"), true);

  return {
    showCardImages,
  };
});

function key(value: string) {
  return `settings:${value}`;
}
