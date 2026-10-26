import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repository = "InKCre/ui";
const packageName = "@inkcre/ui-web";

export function ensureAsset(
  original: Buffer,
  existing: Buffer | undefined,
  upload: () => void,
): void {
  if (existing !== undefined) {
    assert.ok(
      existing.equals(original),
      "Existing release asset differs; refusing to overwrite it",
    );
    return;
  }
  upload();
}

async function download(url: string): Promise<Buffer> {
  // This intentionally sends no GitHub credential: consumers must be able to do the same.
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  assert.ok(response.ok, `Anonymous download failed: ${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main(): Promise<void> {
  const [version, mode] = process.argv.slice(2);
  assert.ok(
    version && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version),
    "Usage: pnpm release:public <exact-version> [--publish] (default: read-only preparation)",
  );
  assert.ok(mode === undefined || mode === "--publish", "Only --publish is supported");
  assert.ok(process.argv.length <= 4, "Unexpected arguments");
  const tag = `${packageName}@${version}`;
  const filename = `inkcre-ui-web-${version}.tgz`;
  const url = `https://github.com/${repository}/releases/download/${encodeURIComponent(tag)}/${filename}`;
  const release = JSON.parse(
    execFileSync("gh", ["release", "view", tag, "--repo", repository, "--json", "isDraft,assets"], {
      encoding: "utf8",
    }),
  ) as { isDraft: boolean; assets: { name: string; url: string }[] };
  assert.ok(!release.isDraft, "The corresponding published GitHub Release must already exist");

  const directory = mkdtempSync(join(tmpdir(), "inkcre-public-package-"));
  try {
    const registry = "--registry=https://npm.pkg.github.com";
    const integrity = JSON.parse(
      execFileSync("npm", ["view", tag, "dist.integrity", "--json", registry], {
        encoding: "utf8",
      }),
    ) as string;
    execFileSync(
      "npm",
      ["pack", tag, "--ignore-scripts", "--pack-destination", directory, "--json", registry],
      { stdio: ["ignore", "pipe", "inherit"] },
    );
    const tarball = join(directory, filename);
    const original = readFileSync(tarball);
    assert.equal(`sha512-${createHash("sha512").update(original).digest("base64")}`, integrity);
    const manifest = JSON.parse(
      execFileSync("tar", ["-xOf", tarball, "package/package.json"], { encoding: "utf8" }),
    ) as { name: string; version: string };
    assert.equal(manifest.name, packageName);
    assert.equal(manifest.version, version);

    const asset = release.assets.find((item) => item.name === filename);
    const existing = asset ? await download(url) : undefined;
    ensureAsset(original, existing, () => {
      if (mode !== "--publish") return;
      // Never clobber: concurrent or conflicting publication must stop for inspection.
      execFileSync("gh", ["release", "upload", tag, tarball, "--repo", repository], {
        stdio: "inherit",
      });
    });
    if (mode === "--publish") {
      assert.ok(
        (await download(url)).equals(original),
        "Public asset does not match registry bytes",
      );
    }
    console.log(
      JSON.stringify({
        version,
        integrity,
        url,
        published: mode === "--publish",
        existing: !!asset,
      }),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await main();
}
