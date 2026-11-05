import { writeFileSync } from "node:fs";
import { getProblemBank } from "../src/lib/problems/catalog.mjs";

const bank = getProblemBank();
writeFileSync(".problem-bank-cache.json", JSON.stringify(bank));
const counts = Object.fromEntries(["easy", "medium", "hard", "very_hard"].map((level) => [level, bank.filter((problem) => problem.difficulty === level).length]));
process.stdout.write(`${JSON.stringify({ total: bank.length, counts, testcases: bank.reduce((sum, problem) => sum + problem.test_cases.length, 0), cache: ".problem-bank-cache.json" }, null, 2)}\n`);
