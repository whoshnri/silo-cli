import { Command } from "@cliffy/command";
import process from "node:process";
import { createAccount } from "./helpers/initAccount.ts";
import { createNewBucket } from "./helpers/createBucket.ts";
import { listBuckets } from "./helpers/listBuckets.ts";
import { rotateKeys } from "./helpers/rotate.ts";
import { updateBucket } from "./helpers/updateBucket.ts";
import { getAccount } from "./helpers/getAccount.ts";
import { openDocs } from "./helpers/openDocs.ts";


export type InputType = string | null;

// create a new bucket
const bucket = new Command()

  .command("new", "Create a new bucket")
  .option("--name <name:string>", "The name of your bucket")
  .option("--d <d:string>", "Short description of your bucket for reference")
  .action((options: any) => {
    let name = options.name as InputType;
    if (!name) name = (globalThis as any).prompt("\nWhat shoud we call this bucket?");
    createNewBucket(name as string, options.d);
  })

  // List all buckets under this account
  .command("list", "List all your buckets")
  .action(() => {
    listBuckets();
  })

  .command("rotate", "Rotate the keys for the app (bucket)")
  .action(() => {
    rotateKeys();
  })

  .command("edit", "Update the details of your bucket")
  .option("--name <name:string>", "New name for bucket")
  .option("--d <d:string>", "New bucket description")
  .action((options: any) => {
    let name = options.name as InputType;
    let desc = options.d as InputType;

    if (!name) name = (globalThis as any).prompt("\nEnter the new name of this bucket");
    !options.d && (() => {
        const res = () => {
            return (globalThis as any).confirm("Add a description");
        };
        if (res()) {
            desc = (globalThis as any).prompt("Add the new description");
        }
    })()
    updateBucket(name as string, desc as string); 
});


async function runCli() {
  await new Command()
    .name("silo")
    .version("0.1.0")
    .description("Self-hosted key-value cache CLI")

    // initialise app on main machine
    .command("init", "Initialize our instance")
    .argument("<url:string>", "The URL of the instance")
    .action((_: any, url: string) => {
      createAccount(url);
    })

    // view account info
    .command("account", "View your account details")
    .action(() => {
      getAccount();
    })

    // open docs in browser
    .command("docs", "Open the API docs in your browser")
    .action(() => {
      openDocs();
    })

    // bucket commands
    .command("bucket", bucket)

    .parse(typeof Deno !== "undefined" ? Deno.args : process.argv.slice(2));
}

runCli();
