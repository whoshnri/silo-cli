import { getBucketKeys } from "./getKeys.ts";
import process from "node:process";
import { useDynamicSpinner } from "./reusableSpinner.ts";
import { success, credential, separator, fail, dim } from "./branding.ts";

// Rotates the bucket key — generates a new one server-side and displays it
const rotateKeys = async () => {
  const keys = getBucketKeys();
  // Fixed: old spinner referenced undefined `name` variable
  const spinner = useDynamicSpinner("Rotating bucket keys...");

  try {
    spinner.start();
    const res = await fetch(
      `${keys.url}/admin/buckets/${keys.bucketId}/rotate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keys.apiKey}`,
        },
      },
    );

    // Read body once — the old code consumed res.json() twice
    const data = await res.json() as any;
    spinner.stop();

    if (!res.ok) {
      fail(`Key rotation failed: ${data.error ?? res.statusText}`);
      process.exit(1);
    }

    success("Keys rotated!");
    console.log();

    // Display the new key so the user can update their .env
    credential("BUCKET_KEY", data.bucketKey);

    separator();
    console.log(dim("  Update BUCKET_KEY in your .env file.\n"));
  } catch (err) {
    spinner.stop();
    fail(
      `Could not rotate bucket key at ${keys.url}: ${(err as Error).message}`,
    );
    process.exit(1);
  }
};

export { rotateKeys };