import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { getProblemBank } from "../src/lib/problems/catalog.mjs";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your local environment before seeding.");
}

const client = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
const bank = getProblemBank();
const batchSize = 50;
for (let start = 0; start < bank.length; start += batchSize) {
  const { data, error } = await client.rpc("seed_problem_bank_batch", { batch: bank.slice(start, start + batchSize) });
  if (error) throw new Error(`Could not seed batch ${Math.floor(start / batchSize) + 1}: ${error.message}`);
  if (data !== Math.min(batchSize, bank.length - start)) {
    throw new Error(`Supabase reported ${data} rows for batch starting at ${start}.`);
  }
  if ((start / batchSize + 1) % 10 === 0 || start + batchSize >= bank.length) {
    process.stdout.write(`Stored ${Math.min(start + batchSize, bank.length)} of ${bank.length} problems.\n`);
  }
}
