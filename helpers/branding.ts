// Shared CLI branding — logo, colors, and formatted output helpers

// ANSI escape codes for colored terminal output
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

// Compact 3-line ASCII logo using box-drawing characters
const LOGO = [
  "  ┌─┐┬┬  ┌─┐",
  "  └─┐││  │ │",
  "  └─┘┴┴─┘└─┘",
].join("\n");

// Full banner — shown on major entry points like init
function printBanner() {
  console.log();
  console.log(cyan(LOGO));
  console.log(dim("  self-hosted kv cache • v0.1.0"));
  console.log();
}

// Consistent status prefixes across all commands
function success(msg: string) {
  console.log(`\n  ${green("✓")} ${msg}`);
}

function warn(msg: string) {
  console.log(`  ${yellow("⚠")} ${msg}`);
}

function fail(msg: string) {
  console.error(`\n  ${red("✗")} ${msg}`);
}

// Prints a labeled credential (label + value) with indentation
function credential(label: string, value: string) {
  console.log(`     ${dim(label)}`);
  console.log(`     ${bold(value)}`);
  console.log();
}

// Thin visual divider between sections
function separator() {
  console.log(dim("  ────────────────────────────────────────"));
}

export {
  cyan,
  green,
  yellow,
  red,
  bold,
  dim,
  printBanner,
  success,
  warn,
  fail,
  credential,
  separator,
};
