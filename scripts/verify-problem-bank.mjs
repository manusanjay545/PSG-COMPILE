import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { getProblemBank } from "../src/lib/problems/catalog.mjs";

const bank = getProblemBank();
const counts = { easy: 0, medium: 0, hard: 0, very_hard: 0 };
const slugs = new Set();
const grouped = new Map();
for (const problem of bank) {
  counts[problem.difficulty]++;
  assert(!slugs.has(problem.slug), `duplicate slug: ${problem.slug}`);
  slugs.add(problem.slug);
  assert(problem.title && problem.description && problem.input_format && problem.output_format && problem.constraints, `incomplete statement: ${problem.slug}`);
  assert(problem.diagram?.trim(), `missing diagram: ${problem.slug}`);
  assert(problem.solution_code?.python, `missing Python reference: ${problem.slug}`);
  assert.equal(problem.test_cases.length, 5, `expected 5 cases: ${problem.slug}`);
  assert.equal(problem.test_cases.filter((test) => test.is_sample).length, 2, `expected 2 samples: ${problem.slug}`);
  assert.equal(problem.test_cases.filter((test) => test.is_hidden).length, 3, `expected 3 hidden cases: ${problem.slug}`);
  const familyKey = problem.slug.replace(/-\d{4}$/, "");
  if (!grouped.has(familyKey)) grouped.set(familyKey, { source: problem.solution_code.python, cases: [] });
  for (const test of problem.test_cases) grouped.get(familyKey).cases.push({ input: test.input, expected: test.expected_output, slug: problem.slug });
}

assert.equal(bank.length, 5000);
assert.deepEqual(counts, { easy: 2500, medium: 1500, hard: 500, very_hard: 500 });

let verified = 0;
for (const [family, group] of grouped) {
  const program = `import json,sys\npayload=json.loads(sys.stdin.read())\nenv={"__name__":"reference"}\nexec(payload["source"],env)\nprint(json.dumps([env["solve"](job["input"].split()) for job in payload["cases"]]))`;
  const input = JSON.stringify(group);
  let run = spawnSync(process.env.PYTHON || "python", ["-c", program], { input, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (run.error?.code === "ENOENT") run = spawnSync("py", ["-3", "-c", program], { input, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (run.error) throw run.error;
  assert.equal(run.status, 0, `${family} reference failed: ${run.stderr}`);
  const actual = JSON.parse(run.stdout.trim());
  assert.equal(actual.length, group.cases.length, `${family} produced the wrong output count`);
  actual.forEach((output, index) => {
    assert.equal(String(output).trim(), String(group.cases[index].expected).trim(), `${group.cases[index].slug} generated a failing testcase`);
    verified++;
  });
}

process.stdout.write(`${JSON.stringify({ total: bank.length, counts, unique_slugs: slugs.size, verified_testcases: verified, python_solutions: bank.length, diagrams: bank.length }, null, 2)}\n`);
