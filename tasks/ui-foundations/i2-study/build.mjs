import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const require = createRequire(resolve(root, "packages/web/package.json"));
const { build } = await import(require.resolve("vite"));
const { default: vue } = await import(require.resolve("@vitejs/plugin-vue"));
if (!process.argv[2]) throw new Error("Pass the local UI tarball used as the comparison baseline.");
if (process.argv[3] && process.argv[3] !== "--delivery") throw new Error("Unknown build mode.");
const delivery = process.argv[3] === "--delivery";
const destination = delivery ? resolve(here, "../i2-evidence") : here;
mkdirSync(destination, { recursive: true });
const tarball = resolve(process.argv[2]);
const archive = readFileSync(tarball);
const scratchRoot = resolve(root, "packages/web/tmp");
mkdirSync(scratchRoot, { recursive: true });
const scratch = mkdtempSync(resolve(scratchRoot, "i2-study-"));
try {
  execFileSync("tar", ["-xzf", tarball, "-C", scratch]);
  const packageRoot = resolve(scratch, "package");
  const manifest = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8"));
  let probeCss = "";
  if (delivery) {
    const sass = require("sass");
    probeCss = sass.compileString(
      `
      @use "mixins" as ink;
      @each $level in low, md, high {
        .sass-shadow-#{$level} { @include ink.apply-elevation($level); }
      }
    `,
      { loadPaths: [resolve(packageRoot, "styles")] },
    ).css;
    const { createGenerator, presetWind3 } = await import(require.resolve("unocss"));
    const { presetInk } = await import(
      pathToFileURL(resolve(packageRoot, "dist/uno/preset-ink.js")).href
    );
    const uno = await createGenerator({ presets: [presetWind3(), presetInk()] });
    probeCss += (
      await uno.generate(
        "shadow-low shadow-md shadow-high bg-surface-primary text-text-on-primary",
        { preflights: true },
      )
    ).css;
  }
  const result = await build({
    configFile: false,
    root: here,
    plugins: [vue()],
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    resolve: {
      alias: [
        { find: /^vue$/, replacement: require.resolve("vue/dist/vue.runtime.esm-bundler.js") },
        { find: /^@inkcre\/ui-web$/, replacement: resolve(packageRoot, "dist/index.js") },
        { find: /^@inkcre\/ui-web\/styles$/, replacement: resolve(packageRoot, "dist/index.css") },
      ],
      dedupe: ["vue"],
    },
    build: {
      write: false,
      lib: {
        entry: resolve(here, delivery ? "delivery.js" : "main.js"),
        formats: ["iife"],
        name: "InkcreColorStudy",
      },
      minify: true,
      sourcemap: false,
      cssCodeSplit: false,
    },
  });
  const output = (Array.isArray(result) ? result : [result]).flatMap((bundle) => bundle.output);
  const js = output.find((item) => item.type === "chunk").code.replaceAll("</script", "<\\/script");
  const css = output
    .filter((item) => item.type === "asset" && item.fileName.endsWith(".css"))
    .map((item) => item.source)
    .join("\n");
  writeFileSync(
    resolve(destination, "index.html"),
    `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>InKCre · I2 ${delivery ? "交付验收" : "色彩与阴影"}</title><style>${probeCss}\n${css}</style></head><body><div id="app"></div><script>${js}</script></body></html>\n`,
  );
  writeFileSync(
    resolve(destination, "artifact.json"),
    JSON.stringify(
      {
        source: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
        package: `${manifest.name}@${manifest.version}`,
        tarballSha256: createHash("sha256").update(archive).digest("hex"),
        ...(delivery
          ? {
              tokensSha256: createHash("sha256")
                .update(readFileSync(resolve(root, "tokens/inkcre.tokens.json")))
                .digest("hex"),
              cssSha256: createHash("sha256")
                .update(readFileSync(resolve(packageRoot, "dist/index.css")))
                .digest("hex"),
            }
          : {}),
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
