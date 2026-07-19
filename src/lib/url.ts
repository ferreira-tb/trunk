export function openUrl(url: string) {
  window.open(url, "_blank")?.focus();
}

export function openLiga(entry: TrunkEntry) {
  openUrl(`https://www.ligayugioh.com.br/?view=cards/search&card=${entry.name}&orderBy=3`);
}

export function openYugipedia(entry: TrunkEntry) {
  openUrl(`https://yugipedia.com/index.php?search=${entry.name}`);
}
