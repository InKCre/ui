// 一次性 L3 声明兼容演练；不修改消费者依赖或源码，不等同实际升级。
import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const client = resolve(process.argv[2]);
const packed = realpathSync(resolve(process.argv[3]));
const output = dirname(fileURLToPath(import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), "inkcre-l3-types-"));
const report = [];
try {
  for (const [name, directory, config] of [
    ["web", "apps/client-web", "tsconfig.app.json"],
    ["mail", "extensions/mail", "tsconfig.json"],
    ["twitter", "extensions/twitter", "tsconfig.json"],
  ]) {
    const app = resolve(client, directory);
    const paths = {
      "@/*": [resolve(client, "apps/client-web/src/*")],
      "@inkcre/core": [resolve(client, "packages/core/src/index.ts")],
      "@inkcre/core/*": [resolve(client, "packages/core/src/*")],
      vue: [resolve(app, "node_modules/vue")],
    };
    for (const [entry, file] of [
      ["@inkcre/ui-web", "index.d.ts"],
      ["@inkcre/ui-web/utils", "utils/index.d.ts"],
      ["@inkcre/ui-web/locales", "locales/index.d.ts"],
      ["@inkcre/ui-web/uno", "uno/preset-ink.d.ts"],
    ])
      paths[entry] = [resolve(packed, "dist", file)];
    const include = [resolve(app, "src/**/*"), resolve(packed, "dist/components.d.ts")];
    if (name === "web") include.push(resolve(app, "env.d.ts"));
    const configuration = resolve(temporary, `${name}.json`);
    writeFileSync(
      configuration,
      JSON.stringify(
        {
          extends: resolve(app, config),
          compilerOptions: { composite: false, incremental: false, paths, types: [] },
          include,
        },
        null,
        2,
      ),
    );
    const result = spawnSync("pnpm", ["exec", "vue-tsc", "--noEmit", "-p", configuration], {
      cwd: app,
      encoding: "utf8",
    });
    const log = result.stdout + result.stderr;
    writeFileSync(resolve(output, `consumer-${name}.log`), log);
    report.push({
      name,
      directory,
      exit: result.status,
      vue: JSON.parse(readFileSync(resolve(app, "node_modules/vue/package.json"))).version,
      errors: log.split("\n").filter((line) => line.includes("error TS")),
    });
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
writeFileSync(resolve(output, "consumer-types.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report));
if (report.some((entry) => entry.exit !== 0)) process.exitCode = 1;
