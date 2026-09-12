# Token 生成器

[build-tokens.ts](build-tokens.ts) 使用 Style Dictionary 将 [Token 源](../tokens/inkcre.tokens.json) 转成 Web 的 Sass 映射和 UnoCSS preset。输入格式及维护责任见 [Token 指南](../tokens/tokens.md)。

## 命令与路径

从仓库根执行：

```bash
pnpm build-tokens
```

默认输入是仓库根下的 `tokens/inkcre.tokens.json`。也可传入自定义文件路径：

```bash
pnpm build-tokens /absolute/path/to/custom.tokens.json
```

自定义输入仍会写入本仓库的生成目录。隔离实验可用 `--root` 指定临时根目录；输入的相对路径和输出路径都以该目录解析：

```bash
pnpm exec tsx scripts/build-tokens.ts --root /absolute/path/to/temporary-root tokens/inkcre.tokens.json
```

临时根目录必须已有指定输入文件。生成器只创建输出，不复制 Token 源，也不生成 Changeset。

## 当前输出

| 输出文件                                | 内容                                                                             |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| `packages/web/styles/tokens/_ref.scss`  | ref 层，以及 effect.elevation 和 typography；导出分类映射与 `$all`               |
| `packages/web/styles/tokens/_sys.scss`  | sys.light/dark.color 对应 `$color-light`／`$color-dark`，以及引用 ref 的 `$base` |
| `packages/web/styles/tokens/_comp.scss` | comp.light/dark 对应 `$light`／`$dark` 和聚合 `$all`                             |
| `packages/web/styles/uno/preset-ink.ts` | Web UnoCSS 的 Token preset                                                       |

当前转换会规范化输出键名，将数值 dimension 转成 px，并剥离独立八位十六进制 color 值的 alpha 通道。这是现有实现描述，不是颜色保真保证；更改输入格式或转换规则前应检查受影响的输出和消费者。

当前生成器只配置 Web 输出。不要把源文件替换成另一种 Token 格式后，假定生成器会自动迁移结构或支持非 Web 平台。

## 维护与验证

修改正式 Token 源后运行 `pnpm generate`，检查生成差异与实际视觉效果，并为发布影响记录 Changeset。`pnpm check:generated` 会在工作区重新生成后比较内容，发现过期文件时失败；它不是只读检查。

Figma 更新由 [update-tokens.yml](../.github/workflows/update-tokens.yml) 调用 `pnpm tokens:update`，负责写入源、生成输出和创建 patch Changeset。这个入口依赖工作流传入的环境变量，不是普通本地生成命令。`pnpm check:token-workflow` 在临时目录验证该准备流程，不提交或发布结果。
