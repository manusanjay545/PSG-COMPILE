import { readFileSync } from "node:fs";

const index = Number(process.argv[2] ?? 0);
const size = Number(process.argv[3] ?? 20);
const bank = JSON.parse(readFileSync(".problem-bank-cache.json", "utf8"));
process.stdout.write(JSON.stringify(bank.slice(index * size, (index + 1) * size)));
