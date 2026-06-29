import { getApiKeys } from "./getKeys.ts";
import process from "node:process";
import { useDynamicSpinner } from "./reusableSpinner.ts";
import { success, fail, dim, bold } from "./branding.ts";

type AccountInfo = {
  accountId: string;
  accountName: string;
  accountEmail: string;
};

const getAccount = async () => {
  const spinner = useDynamicSpinner("Fetching account info...");
  const { url, apiKey } = getApiKeys();

  try {
    spinner.start();
    const res = await fetch(`${url}/admin/account`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = await res.json() as any;
    spinner.stop();

    if (!res.ok) {
      fail(`Could not fetch account: ${data.error ?? res.statusText}`);
      process.exit(1);
    }

    const account = data as AccountInfo;

    success("Account info\n");
    console.log(`     ${dim("Name:")}    ${bold(account.accountName)}`);
    console.log(`     ${dim("Email:")}   ${account.accountEmail}`);
    console.log(`     ${dim("ID:")}      ${account.accountId}`);
    console.log();
  } catch (err) {
    spinner.stop();
    fail(`Could not reach ${url}: ${(err as Error).message}`);
    process.exit(1);
  }
};

export { getAccount };
