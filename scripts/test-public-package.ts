import assert from "node:assert/strict";
import { test } from "node:test";
import { ensureAsset } from "./publish-public-package.js";

test("release assets are append-only, repeatable, and preserve upload failures", () => {
  const original = Buffer.from("published registry bytes");
  let uploads = 0;
  const upload = () => {
    uploads += 1;
  };
  ensureAsset(original, undefined, upload);
  assert.equal(uploads, 1);
  ensureAsset(original, Buffer.from(original), upload);
  assert.equal(uploads, 1);
  assert.throws(
    () => ensureAsset(original, Buffer.from("different build"), upload),
    /refusing to overwrite/,
  );
  assert.equal(uploads, 1);
  assert.throws(
    () =>
      ensureAsset(original, undefined, () => {
        throw new Error("upload failed");
      }),
    /upload failed/,
  );
});
