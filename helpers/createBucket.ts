import { useDynamicSpinner } from "./reusableSpinner.ts";
import process from "node:process";
import { InputType } from "../main.ts";
import { getApiKeys } from "./getKeys.ts";
import { success, credential, separator, fail, dim } from "./branding.ts";

export type BucketDetails = {
  bucketId: string;
  name: string;
  createdAt: number;
  bucketKey: string;
  description?: string | undefined;
  updatedAt?: number | undefined;
};

async function createNewBucket(name: string, description: string | undefined) {
  const spinner = useDynamicSpinner(`Creating bucket: ${name}`);
  let desc = description as InputType;

  // Prompt for an optional description if one wasn't passed via --d flag
  if (!desc) {
    const res = (globalThis as any).confirm("\nDo you want to add a description for your bucket?");
    if (res) {
      desc = (globalThis as any).prompt("\nDescribe your new bucket:");
    } else {
      desc = "";
    }
  }

  const { url, apiKey } = getApiKeys();

  try {
    spinner.start();
    const res = await fetch(`${url}/admin/buckets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ name, description: desc }),
    });

    // Read body once — the old code consumed res.json() twice which
    // would throw on the error path since the stream is already read
    const data = (await res.json()) as any;
    spinner.stop();

    if (!res.ok) {
      fail(
        `Bucket creation failed: ${data.error ?? res.statusText}`,
      );
      process.exit(1);
    }

    success(`Bucket created: ${name}`);
    console.log();

    // Show the credentials the user needs for this bucket
    credential("BUCKET_ID", data.bucketId);
    credential("BUCKET_KEY", data.bucketKey);

    separator();
    console.log(dim("  Add these to your .env to access this bucket."));
    console.log(dim("  That's all the setup you need.\n"));
  } catch (err) {
    spinner.stop();
    fail(`Could not create bucket at ${url}: ${(err as Error).message}`);
    process.exit(1);
  }
}

export { createNewBucket };
