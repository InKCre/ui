import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

interface FileRecord {
  path: string;
  bytes: number;
  sha256: string;
}

export function verifyLogoPack(root: string) {
  const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf8")) as {
    assets: FileRecord[];
    supporting_files: FileRecord[];
    counts: { all_asset_files: number };
  };
  assert.equal(manifest.assets.length, manifest.counts.all_asset_files);
  const records = [...manifest.assets, ...manifest.supporting_files];
  const files = [...records.map((record) => record.path), "manifest.json"].sort();
  assert.equal(new Set(files).size, files.length, "Logo inventory contains duplicate files");
  for (const record of records) {
    assert.ok(!record.path.startsWith("/") && !record.path.split("/").includes(".."));
    assert.ok(
      !lstatSync(resolve(root, record.path)).isSymbolicLink(),
      "Logo assets must not be symlinks",
    );
    const contents = readFileSync(resolve(root, record.path));
    assert.equal(contents.length, record.bytes, `Logo size differs: ${record.path}`);
    assert.equal(
      createHash("sha256").update(contents).digest("hex"),
      record.sha256,
      `Logo hash differs: ${record.path}`,
    );
  }
  return { files };
}

/** Publishing checks committed resources; it never installs a renderer. */
export function verifyLogoInputs(root: string) {
  const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf8"));
  const paths = [
    "build_pack.py",
    "masters/inkcre-original-transparent-optical-32.svg",
    "masters/inkcre-original-transparent-standard-256.svg",
  ];
  assert.deepEqual(Object.keys(manifest.generation_inputs).sort(), paths.sort());
  for (const path of paths) {
    assert.equal(
      createHash("sha256")
        .update(readFileSync(resolve(root, path)))
        .digest("hex"),
      manifest.generation_inputs[path],
      `Logo generation input changed; regenerate assets: ${path}`,
    );
  }
}
