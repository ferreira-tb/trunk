import { readFileSync, writeFileSync } from "node:fs";

const trunk = readFileSync("src/assets/trunk.json", { encoding: "utf8" });
const trunkJson: TrunkEntry[] = JSON.parse(trunk);

let csv = "name,amount\n";

for (const entry of trunkJson) {
  const name = entry.name.replaceAll(",", "");
  csv += `${name},${entry.amount}\n`;
}

writeFileSync("public/trunk.csv", csv, { encoding: "utf8" });
