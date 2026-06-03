#!/usr/bin/env node
/**
 * Installs registry blocks listed in manifest.yaml via the official shadcn CLI.
 * Loads .env.local then .env; maps Shadcn Studio creds to EMAIL / LICENSE_KEY for CLI compatibility.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import YAML from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const p = join(root, name);
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf8");
    for (let line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined || process.env[key] === "") {
        process.env[key] = val;
      }
    }
  }

  if (process.env.SHADCNSTUDIO_EMAIL) {
    process.env.EMAIL = process.env.SHADCNSTUDIO_EMAIL;
  }
  if (process.env.SHADCNSTUDIO_LICENSE_KEY) {
    process.env.LICENSE_KEY = process.env.SHADCNSTUDIO_LICENSE_KEY;
  }
}

function runShadcn(args) {
  // Call the local binary directly to avoid `pnpm exec` leaking npm_config_*
  // env vars into the child pnpm that shadcn spawns. Also pin
  // npm_config_use_node_version to whatever Node the script is running under:
  // pnpm 10's manage-package-manager-versions check otherwise reads a blank
  // nodeVersion (the repo's .nvmrc is "20", not an exact semver) and bails
  // with ERR_PNPM_INVALID_NODE_VERSION.
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith("npm_config_") || key === "npm_package_json") {
      delete env[key];
    }
  }
  env.npm_config_use_node_version = process.version.replace(/^v/, "");
  const res = spawnSync(join(root, "node_modules/.bin/shadcn"), args, {
    stdio: "inherit",
    cwd: root,
    env,
    shell: false,
  });
  if (res.error) {
    console.error(res.error);
    process.exit(1);
  }
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

/**
 * Append a new block entry to the END of manifest.yaml's `blocks:` list,
 * preserving the file's existing 2-space list indentation. Text-appended (not
 * YAML.stringify of the whole doc) so the human-authored comments + grouping
 * are left untouched. Returns the entry it wrote.
 */
function appendManifestEntry(manifestPath, { id, registry, note }) {
  let raw = readFileSync(manifestPath, "utf8");
  if (!raw.endsWith("\n")) raw += "\n";
  const lines = [
    `  - id: ${id}`,
    `    registry: "${registry}"`,
    `    note: ${JSON.stringify(note)}`,
    "",
  ].join("\n");
  writeFileSync(manifestPath, raw + lines, "utf8");
  return { id, registry, note };
}

function main() {
  loadEnvFiles();
  let argv = process.argv.slice(2).filter((a) => a !== "--");

  // `--registry @ss-components` (or `-r`) overrides the registry used when
  // AUTO-APPENDING a brand-new id under `only`. `--dry-run` prints what would
  // be vendored (incl. any manifest append) WITHOUT touching disk or the CLI —
  // so the flow is testable with zero side effects.
  let registryFlag;
  let dryRun = false;
  argv = argv.filter((a) => {
    if (a === "--dry-run") {
      dryRun = true;
      return false;
    }
    const m = a.match(/^(?:--registry|-r)=(.+)$/);
    if (m) {
      registryFlag = m[1];
      return false;
    }
    return true;
  });
  // also accept the space-separated form: --registry @ss-components
  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === "--registry" || argv[i] === "-r") && argv[i + 1]) {
      registryFlag = argv[i + 1];
      argv.splice(i, 2);
      i -= 1;
    }
  }
  if (registryFlag && !registryFlag.startsWith("@")) {
    registryFlag = `@${registryFlag}`;
  }

  if (argv[0] === "search") {
    const registry = argv[1] || "@shadcnblocks";
    const query = argv.slice(2).join(" ").trim();
    const args = ["search", registry, "-l", "50"];
    if (query) {
      args.push("-q", query);
    }
    runShadcn(args);
    return;
  }

  const manifestPath = join(__dirname, "manifest.yaml");
  if (!existsSync(manifestPath)) {
    console.error("Missing manifest:", manifestPath);
    process.exit(1);
  }

  const doc = YAML.parse(readFileSync(manifestPath, "utf8"));
  const blocks = doc.blocks ?? [];

  if (!Array.isArray(blocks) || blocks.length === 0) {
    console.error("manifest.yaml has no blocks array or it is empty.");
    process.exit(1);
  }

  // `only <id...>` — vendor just the named blocks instead of the whole manifest.
  // Lets the component-library workflow pull one new block without re-pulling
  // (and `--overwrite`-ing) every already-vendored file. A NEW id (not yet in
  // the manifest) is AUTO-APPENDED as a stub entry first — so a single
  // `vendor:blocks -- only <id> [--registry @ss-components]` both records the
  // provenance and fetches, with no manual manifest edit. Pass an id prefixed
  // with its registry (`@ss-components/avatar-15`) and the registry is inferred.
  let selected = blocks;
  if (argv[0] === "only") {
    const requested = argv.slice(1);
    if (requested.length === 0) {
      console.error(
        "Usage: vendor:blocks only <id> [<id>...] [--registry @ss-components] [--dry-run]",
      );
      process.exit(1);
    }
    const byId = new Map(blocks.map((e) => [String(e.id).trim(), e]));
    selected = [];
    for (const rawReq of requested) {
      // Allow `@registry/id` to carry the registry inline.
      const prefixMatch = rawReq.match(/^(@[^/]+)\/(.+)$/);
      const inlineRegistry = prefixMatch ? prefixMatch[1] : undefined;
      const id = (prefixMatch ? prefixMatch[2] : rawReq).trim();

      let entry = byId.get(id);
      if (!entry) {
        // New id → append a stub so it's recorded (and re-pullable) before fetch.
        const registry = inlineRegistry || registryFlag || "@shadcnblocks";
        const note = `auto-added ${new Date().toISOString().slice(0, 10)} — TODO: describe + map to a SectionType`;
        if (dryRun) {
          console.error(
            `[dry-run] would append to manifest.yaml: { id: ${id}, registry: "${registry}" }`,
          );
          entry = { id, registry, note };
        } else {
          entry = appendManifestEntry(manifestPath, { id, registry, note });
          console.error(
            `+ manifest.yaml: added { id: ${id}, registry: "${registry}" } (fill in the note + SectionType mapping after)`,
          );
        }
        byId.set(id, entry);
      } else if (inlineRegistry && String(entry.registry).trim() !== inlineRegistry) {
        console.warn(
          `⚠ ${id} is in the manifest as ${entry.registry}, ignoring inline ${inlineRegistry}`,
        );
      }
      selected.push(entry);
    }
  }

  for (const entry of selected) {
    if (entry.skip === true) continue;
    const id = String(entry.id).trim();
    if (!id) {
      console.warn("Skipping entry without id:", entry);
      continue;
    }
    const registryRaw = String(entry.registry || "@shadcnblocks").trim();
    const reg = registryRaw.startsWith("@") ? registryRaw : `@${registryRaw}`;
    const normalized = `${reg}/${id}`;
    if (dryRun) {
      console.error(`[dry-run] → shadcn add ${normalized} -y --overwrite`);
      continue;
    }
    console.error(`\n→ shadcn add ${normalized} -y --overwrite\n`);
    runShadcn(["add", normalized, "-y", "--overwrite"]);
  }
}

main();
