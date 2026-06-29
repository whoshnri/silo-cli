# @whoshnri/silo CLI

The command-line interface (CLI) for managing **Silo** — a self-hosted, lightweight key-value cache. 

Use this CLI to initialize accounts, manage buckets, rotate API keys, and view account configurations.

---

## Installation

### Node.js (Global Installation)

```bash
npm install -g @whoshnri/silo
```

Once installed, the `silo` command will be available globally.

### Deno

Install directly from JSR:

```bash
deno install --allow-net --allow-read --allow-write --allow-env -n silo jsr:@whoshnri/silo
```

---

## Configuration

Silo CLI configures itself using environment variables. You can add these variables directly to your system environment or save them in a `.env` file in the directory where you run the CLI.

Required variables for admin operations:
- `SILO_URL`: The URL of your self-hosted Silo instance (e.g. `http://localhost:8000`).
- `SILO_API_KEY`: Your root administrator API key (given during `silo init`).

Required variables for bucket management (e.g., editing/rotating bucket keys):
- `BUCKET_ID`: The unique UUID of the target bucket.
- `BUCKET_KEY`: The access key of the target bucket.

---

## Command Reference

### Initialization & Account Setup

#### `silo init <url>`
Initialize your self-hosted Silo server profile at the specified URL. This command will prompt you for your name and email, register your administrator account, and return your root `SILO_API_KEY`.
*Note: An account can only be initialized once per server instance.*

```bash
silo init http://localhost:8000
```

#### `silo account`
View details about the initialized admin account.
*Note: Requires `SILO_URL` and `SILO_API_KEY` to be set.*

```bash
silo account
```

---

### Bucket Management

All bucket operations require a configured admin environment (`SILO_URL` and `SILO_API_KEY`).

#### `silo bucket new`
Create a new KV cache bucket. Prompts for a name and optional description.
Returns the `BUCKET_ID` and `BUCKET_KEY`.

```bash
silo bucket new --name "user-cache" --d "Caches user profile objects"
```

#### `silo bucket list`
List all active buckets under your admin account.

```bash
silo bucket list
```

#### `silo bucket edit`
Update the name and/or description of an existing bucket.
*Note: Requires `BUCKET_ID` env variable to target the correct bucket.*

```bash
silo bucket edit --name "user-cache-v2"
```

#### `silo bucket rotate`
Rotates the access key for an existing bucket. Deauthorizes the old `BUCKET_KEY` and returns a new `BUCKET_KEY`.
*Note: Requires `BUCKET_ID` env variable.*

```bash
silo bucket rotate
```

---

### Offline API Documentation

#### `silo docs`
Spins up a lightweight local server and opens the comprehensive API documentation page in your default web browser.

```bash
silo docs
```

---

## License

MIT
