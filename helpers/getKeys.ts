import console from "node:console";
import process from "node:process";
import fs from "node:fs";

// Load .env file programmatically from the current working directory if present
try {
  const content = fs.readFileSync("./.env", "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex > 0) {
      const key = trimmed.slice(0, eqIndex).trim();
      let val = trimmed.slice(eqIndex + 1).trim();
      // Strip quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
} catch (_) {
  // Ignore if .env is missing or unreadable
}

const url = process.env.SILO_URL;
const apiKey = process.env.SILO_API_KEY;
const bucketId = process.env.BUCKET_ID;
const bucketKey = process.env.BUCKET_KEY;

function getApiKeys() {
  if (!url) {
    console.log("SILO_URL not set!");
    process.exit(1);
  }
  if (!apiKey) {
    console.log("SILO_API_KEY not set!");
    process.exit(1);
  }

  return { url, apiKey };
}

function getBucketKeys() {
  if (!url) {
    console.log("SILO_URL not set!");
    process.exit(1);
  }
  if (!apiKey) {
    console.log("SILO_API_KEY not set!");
    process.exit(1);
  }
  if (!bucketId) {
    console.log("BUCKET_ID not set!");
    process.exit(1);
  } 
  if (!bucketKey) {
    console.log("BUCKET_KEY not set!");
    process.exit(1);
  }

  return { url, apiKey, bucketId, bucketKey };
}

export { getApiKeys, getBucketKeys };
