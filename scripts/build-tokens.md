# Token 生成与导入

[build-tokens.ts](build-tokens.ts) 使用 Style Dictionary 将[规范源](../tokens/inkcre.tokens.json)生成 Web Sass 映射和 UnoCSS preset。角色及维护责任见 [Token 指南](../tokens/tokens.md)。

从仓库根运行 `pnpm build-tokens`；正式变更之后运行 `pnpm generate` 同步其他生成物。也可以指定源文件：

```bash
pnpm build-tokens /absolute/path/to/custom.tokens.json
```

该命令仍写入本仓库。隔离实验必须指定临时根目录，并事先在其中放好输入：

```bash
pnpm exec tsx scripts/build-tokens.ts --root /absolute/path/to/temporary-root tokens/inkcre.tokens.json
```

## 输出与求值

| 输出                                    | 内容                                        |
| --------------------------------------- | ------------------------------------------- |
| `packages/web/styles/tokens/_ref.scss`  | ref、typography、effect 的分类映射及 `$all` |
| `packages/web/styles/tokens/_sys.scss`  | 主题颜色映射及非颜色 `$base`                |
| `packages/web/styles/tokens/_comp.scss` | 组件主题值及 `$all`                         |
| `packages/web/styles/uno/preset-ink.ts` | UnoCSS preset                               |

检查器只接受仓库支持的类型／值形状，检查引用目标类型、必要入口、文本角色属性和浅深主题路径配对；Style Dictionary 负责解析别名及拒绝悬空、循环引用。名称统一为 kebab-case。数值 dimension 转为 px，已有 rem/em 等长度保留；number（比例行高、字重、透明度）保持无量纲。八位 hex 和 RGBA 的 alpha 保留，阴影的数值长度转为 px。

Sass map 保存构建结果。CSS 初始化同一组系统变量；apply-font 与 Uno 字体规则读取四个文本属性变量和独立的家族变量，并明确输出装饰，包括 none 和零字距。Uno 的空间、圆角和语义颜色保留系统变量读取；尺寸、图标、断点和阴影工具类使用构建值。它们不是任意 ref 覆盖的动态依赖图。

`pnpm check:generated` 会重新生成后比较文件，过期时失败。`pnpm check:package` 从 tarball 验证公开 CSS/Sass/Uno 入口；这些检查不代替浏览器字体、主题和控件状态复核。目前只生成 Web 代码。

## Figma 值更新

[update-tokens.yml](../.github/workflows/update-tokens.yml) 接收 `update-tokens` 类型的 repository_dispatch。维护者须显式选择 releaseType；没有自动 patch 或语义版本推断。下面是**接收端契约示例**，不是已抓取的真实发送端报文：

```json
{
  "event_type": "update-tokens",
  "client_payload": {
    "filename": "inkcre.tokens.json",
    "releaseType": "minor",
    "commitMessage": "调整字段组间距",
    "tokens": {
      "ref": { "space": { "md": { "type": "dimension", "value": 24 } } }
    }
  }
}
```

`tokens` 接受对象或其 JSON 字符串，必须包含至少一个已知路径。`pnpm tokens:update` 由工作流映射的 `INKCRE_TOKEN_FILENAME`、`INKCRE_TOKEN_JSON`、`INKCRE_CHANGESET_ID`、`INKCRE_CHANGESET_SUMMARY`、`INKCRE_CHANGESET_RELEASE` 驱动。

导入只替换叶节点的 value，保留遗漏角色及仓库元数据；提供的非空 description 必须与仓库一致。未知／已删除路径、类型、组结构或别名变化直接失败。发布分类只能为 patch/minor/major，由维护者根据可观察影响选择：命名、类型、用途、默认字体和尺寸变化不能仅因为由 Figma 发起就视为 patch。需要改契约时直接修改规范源、实现和迁移说明。

候选在临时目录验证并生成，成功后才更新源、四份输出和 Changeset；文件写入失败会恢复已写文件。Changeset 不覆盖已有文件；没有值变化时不创建 Changeset。工作流随后提出 PR，合并与发布沿用仓库治理。

`pnpm check:token-workflow` 在临时目录验证部分导入、元数据保留、alpha、复合阴影更新、无变化和失败不残留；其中循环引用失败是预期检查。旧的整份导出包含已删除角色时会明确拒绝，发送端应只提交已知路径的值提议。该 fixture 证明接收端行为，发送端适配仍需其代码或真实 payload 核对。
