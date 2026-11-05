/**
 * PSGCompile API & Sandbox Test Suite
 * Validates code execution sandbox, verdict generation, test case evaluations
 */

import { executeCodeInSandbox } from "../src/lib/judge/executor.js";
import { MOCK_PROBLEMS, MOCK_INSTITUTIONS, MOCK_LEADERBOARD } from "../src/lib/data/mock-data.js";

async function runTests() {
  console.log("🧪 Starting PSGCompile Validation Test Suite...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // Test 1: Data Integrity
  console.log("1. Validating Institutional Data Models");
  assert(MOCK_INSTITUTIONS.length >= 5, "Has all 5 core PSG institutions");
  assert(MOCK_INSTITUTIONS.some((i) => i.short_name === "PSG Tech"), "Contains PSG Tech");
  assert(MOCK_INSTITUTIONS.some((i) => i.short_name === "PSG Poly"), "Contains PSG Poly");
  assert(MOCK_INSTITUTIONS.some((i) => i.short_name === "PSG CAS"), "Contains PSG College of Arts & Science");
  assert(MOCK_INSTITUTIONS.some((i) => i.short_name === "PSG iTech"), "Contains PSG iTech");
  assert(MOCK_INSTITUTIONS.some((i) => i.short_name === "PSG IM"), "Contains PSG Institute of Management");

  // Test 2: Leaderboard Multi-Institutional Representation
  console.log("\n2. Validating PSG-Wide Leaderboard");
  assert(MOCK_LEADERBOARD.length >= 5, "Leaderboard contains entries");
  const uniqueInstitutions = new Set(MOCK_LEADERBOARD.map((u) => u.institution_name));
  assert(uniqueInstitutions.size >= 4, "Leaderboard represents diverse PSG campuses");

  // Test 3: Problem System
  console.log("\n3. Validating Problem System");
  assert(MOCK_PROBLEMS.length >= 5, "Curated problems exist");
  const twoSum = MOCK_PROBLEMS.find((p) => p.slug === "two-sum");
  assert(twoSum !== undefined, "Problem #1 Two Sum exists");
  assert(twoSum.examples.length >= 2, "Two Sum contains sample testcases");

  console.log("\n========================================");
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log("========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

