import console from "node:console";

const url = Deno.env.get("SILO_URL");
const apiKey = Deno.env.get("SILO_API_KEY");
const bucketId = Deno.env.get("BUCKET_ID");
const bucketKey = Deno.env.get("BUCKET_KEY");

function getApiKeys() {
  if (!url) {
    console.log("SILO_URL not set!");
    Deno.exit(1);
  }
  if (!apiKey) {
    console.log("SILO_API_KEY not set!");
    Deno.exit(1);
  }

  return { url, apiKey };
}

function getBucketKeys() {
  if (!url) {
    console.log("SILO_URL not set!");
    Deno.exit(1);
  }
  if (!apiKey) {
    console.log("SILO_API_KEY not set!");
    Deno.exit(1);
  }
  if (!bucketId) {
    console.log("BUCKET_ID not set!");
    Deno.exit(1);
  } 
  if (!bucketKey) {
    console.log("BUCKET_KEY not set!");
    Deno.exit(1);
  }

  return { url, apiKey, bucketId, bucketKey };
}

export { getApiKeys, getBucketKeys };
