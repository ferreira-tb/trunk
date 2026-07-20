import { readFileSync, writeFileSync } from "node:fs";

const trunk = readFileSync("src/assets/trunk.json", { encoding: "utf8" });
const trunkJson = JSON.parse(trunk);

let csv = "amount,name,card_type\n";

for (const entry of trunkJson) {
  for (const [key, value] of Object.entries(entry)) {
    if (value && typeof value === "string") {
      entry[key] = value.replaceAll(",", "");
    }
  }

  csv += `${entry.amount},${entry.name},${entry.card_type}\n`;
}

writeFileSync("public/trunk.csv", csv, { encoding: "utf8" });
