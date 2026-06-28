import { Spinner } from "@std/cli/unstable-spinner";
import {
  printBanner,
  success,
  credential,
  separator,
  warn,
  fail,
  dim,
} from "./branding.ts";

function verifyEmail(email: string): boolean {
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null;
}

export async function createAccount(url: string) {
  // Show the full SILO banner — this is the first thing a new user sees
  printBanner();
  console.log(dim(`  Setting up your instance at ${url}\n`));

  let name = prompt("  What is your name?");
  let nameRetries = 0;

  while (!name && nameRetries < 2) {
    console.error("  A name is required.");
    const newName = prompt("  What is your name?");
    if (!newName) {
      fail("A name is required.");
      Deno.exit(1);
    }
    name = newName;
    nameRetries++;
  }

  if (!name) {
    fail("Too many invalid name attempts.");
    Deno.exit(1);
  }

  let email = prompt("  What is your email?");
  if (!email) {
    fail("An email is required.");
    Deno.exit(1);
  }

  let emailRetries = 0;

  while (!verifyEmail(email) && emailRetries < 2) {
    console.error("  Please provide a valid email address.");
    const newEmail = prompt("  What is your email?");
    if (!newEmail) {
      fail("An email is required.");
      Deno.exit(1);
    }
    email = newEmail;
    emailRetries++;
  }

  if (!verifyEmail(email)) {
    fail("Too many invalid email attempts.");
    Deno.exit(1);
  }

  // const wantsChangelogs = confirm(
  //   `\nCan we send you changelogs via email, ${name}?`,
  // );

  const spinner = new Spinner({ message: "  Creating account..." });
  spinner.start();

  try {
    const res = await fetch(`${url}/admin/initialise-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountName: name, accountEmail: email }),
    });

    // Read body once — response can only be consumed a single time
    const data = await res.json();

    if (!res.ok) {
      spinner.stop();
      fail(`Account creation failed: ${data.error ?? res.statusText}`);
      Deno.exit(1);
    }

    spinner.stop();

    success(`Account created for ${name}`);
    console.log();

    // Display the credentials the user needs to save
    credential("SILO_API_KEY", data?.apiKey);
    credential("SILO_URL", url);

    separator();
    console.log(dim("  Add these to your .env to access your instance."));
    warn("Shown once — store it somewhere safe.\n");
  } catch (err) {
    spinner.stop();
    fail(`Could not reach ${url}: ${(err as Error).message}`);
    Deno.exit(1);
  }
}
