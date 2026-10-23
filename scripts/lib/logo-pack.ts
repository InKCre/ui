import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";

interface FileRecord {
  path: string;
  bytes: number;
  sha256: string;
}

/** Validate the supplied inventory before copying it into a consumer artifact. */
export function verifyLogoPack(root: string) {
  const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf8")) as {
    edition: string;
    assets: FileRecord[];
    supporting_files: FileRecord[];
    counts: { all_asset_files: number };
  };
  assert.match(manifest.edition, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(manifest.assets.length, manifest.counts.all_asset_files);
  const records = [...manifest.assets, ...manifest.supporting_files];
  const files = [...records.map((record) => record.path), "manifest.json"].sort();
  assert.equal(new Set(files).size, files.length, "Logo inventory contains duplicate files");
  const actual = readdirSync(root, { recursive: true, withFileTypes: true });
  assert.ok(
    actual.every((entry) => !entry.isSymbolicLink()),
    "Logo assets must not be symlinks",
  );
  assert.deepEqual(
    actual
      .filter((entry) => entry.isFile())
      .map((entry) => relative(root, resolve(entry.parentPath, entry.name)).split("\\").join("/"))
      .sort(),
    files,
    "Logo pack must contain exactly the inventoried files",
  );
  for (const record of records) {
    const contents = readFileSync(resolve(root, record.path));
    assert.equal(contents.length, record.bytes, `Logo size differs: ${record.path}`);
    assert.equal(
      createHash("sha256").update(contents).digest("hex"),
      record.sha256,
      `Logo hash differs: ${record.path}`,
    );
  }
  const provenance = JSON.parse(readFileSync(resolve(root, "PROVENANCE.json"), "utf8")) as {
    sources: { local_path: string; git_blob_sha: string }[];
  };
  for (const source of provenance.sources) {
    assert.ok(files.includes(source.local_path), "Logo source must be part of the inventory");
    const contents = readFileSync(resolve(root, source.local_path));
    assert.equal(
      createHash("sha1").update(`blob ${contents.length}\0`).update(contents).digest("hex"),
      source.git_blob_sha,
      `Logo source differs: ${source.local_path}`,
    );
  }
  return { files, archiveName: `InKCre-logo-pack-${manifest.edition.replaceAll("-", "")}.zip` };
}
