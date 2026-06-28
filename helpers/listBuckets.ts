import { getApiKeys } from "./getKeys.ts";
import { useDynamicSpinner } from "./reusableSpinner.ts";
import { fail, dim, bold } from "./branding.ts";

type BucketListItem = {
  bucketId: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt?: number;
};

type ListBucketsResponse = {
  buckets: BucketListItem[];
};

const listBuckets = async () => {
  const spinner = useDynamicSpinner("Fetching buckets...");
  const { url, apiKey } = getApiKeys();

  try {
    spinner.start();
    const res = await fetch(`${url}/admin/buckets`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = (await res.json()) as ListBucketsResponse;
    spinner.stop();

    if (!res.ok) {
      fail(
        `Failed to list buckets: ${(data as Record<string, unknown>).error ?? res.statusText}`,
      );
      Deno.exit(1);
    }

    if (data.buckets.length === 0) {
      console.log("\n  No buckets found. Create one with: silo bucket new\n");
      return;
    }

    const formatDate = (ts?: number) =>
      ts ? new Date(ts).toLocaleString() : "—";

    console.log(`\n  ${data.buckets.length} bucket(s) found:\n`);

    data.buckets.forEach((b, i) => {
      console.log(`  ${bold(`${i + 1}. ${b.name}`)}`);
      console.log(`     ${dim("ID:")}          ${b.bucketId}`);
      if (b.description) {
        console.log(`     ${dim("Description:")} ${b.description}`);
      }
      console.log(`     ${dim("Created:")}     ${formatDate(b.createdAt)}`);
      console.log(`     ${dim("Updated:")}     ${formatDate(b.updatedAt)}`);
      console.log();
    });
  } catch (err) {
    spinner.stop();
    fail(`Could not fetch buckets from ${url}: ${(err as Error).message}`);
    Deno.exit(1);
  }
};

export { listBuckets };
