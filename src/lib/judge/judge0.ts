const DEFAULT_JUDGE0_URL = "https://ce.judge0.com";

export function judge0BaseUrl() {
  return (process.env.JUDGE0_API_URL || DEFAULT_JUDGE0_URL).replace(/\/+$/, "");
}

export function judge0Headers() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const apiKey = process.env.JUDGE0_API_KEY;
  if (apiKey) {
    headers["X-RapidAPI-Key"] = apiKey;
    headers["X-RapidAPI-Host"] = new URL(judge0BaseUrl()).host;
  }
  return headers;
}
