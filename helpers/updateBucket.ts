import { getBucketKeys } from "./getKeys.ts";
import process from "node:process";
import { useDynamicSpinner } from "./reusableSpinner.ts";
import { success, fail } from "./branding.ts";

const updateBucket = async (
  name: string | undefined,
  description: string | undefined,
) => {
  // Fixed spinner message — the old one incorrectly said "Rotating"
  const spinner = useDynamicSpinner("Updating bucket details...");
  const keys = getBucketKeys();

  try {
    spinner.start();
    const res = await fetch(`${keys.url}/admin/buckets/${keys.bucketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keys.apiKey}`,
      },
      body: JSON.stringify({ name, description }),
    });

    // Read body once — avoids the double-consume crash on error paths
    const data = await res.json() as any;
    spinner.stop();

    if (!res.ok) {
       fail(`Bucket update failed: ${data.error ?? res.statusText}`);
       process.exit(1);
     }

    success("Bucket details updated!\n");
  } catch (err) {
    spinner.stop();
    fail(
      `Could not update bucket at ${keys.url}: ${(err as Error).message}`,
    );
    process.exit(1);
  }
};

export { updateBucket };
