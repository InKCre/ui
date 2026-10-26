# InKCre Logo Pack

UI 维护源与导出，npm／SwiftPM 管理工程消费，版本 ZIP 供人工和设计工具使用。

## 快速选择

- 浅色界面：`original-transparent`，黑色主体 + #808080 灰色方块。
- 深色界面：`reverse-transparent`，白色主体 + #808080 灰色方块。
- 单色应用：`black-transparent` 或 `white-transparent`。
- 需要自带纯色画布：`original-white`、`reverse-black`、`black-white`、`white-black`。
- 没有加入黑标黑底、白标白底等不可见组合。

人工维护 `masters/inkcre-original-transparent-optical-32.svg` 和 `masters/inkcre-original-transparent-standard-256.svg`。其 `data-inkcre-color="ink"`／`"accent"` 标记主体与灰块；原色取自 SVG，其他变体由生成器转换。`svg/`、其余配色母版及 `png/` 均为生成物，不手改。

## 尺寸与小图标

常规 SVG 和 PNG 均提供 16、20、24、32、48、64、128、256、512、1024 px。

| 逻辑显示尺寸 | 使用的几何 |
| --- | --- |
| 16 / 20 / 24 / 32 px | 仓库现有的 32 × 32 小尺寸几何 |
| 48 / 64 / 128 / 256 / 512 / 1024 px | 仓库现有的 256 × 256 标准几何 |

这两套源文件不是简单倍数缩放：32 版占画布比例更大，连接线和内部细节相对更粗。
上述切换阈值是此资产包的导出约定，不声称是项目既有的正式品牌规范。没有为 16、20、24 等尺寸再改变形状；它们保留现有 32 版比例，由渲染器进行正常抗锯齿。1x 小尺寸会有子像素抗锯齿，优先在高 DPI 显示器使用 SVG 或对应的 2x/3x PNG。

`png/2x/` 和 `png/3x/` 为 16–64 px 的六种逻辑尺寸分别提供高 DPI 导出。
例如 `inkcre-original-transparent-32px@2x.png` 是 64 × 64 物理像素，但应显示为 32 × 32 px，仍然采用小尺寸几何。它与常规 64 px 文件用途不同。

请不要根据图片的物理像素宽度选错几何，也不要把 32 版无限放大作为展示母版。
SVG 可以缩放，但选择母版时仍应考虑实际显示尺寸。

## 透明度与配色

- 原色：#000000 主体、#808080 灰块。
- 反白双色：#FFFFFF 主体、#808080 灰块。
- 纯黑：全部可见形状为 #000000。
- 纯白：全部可见形状为 #FFFFFF。

嵌套方框内部使用 even-odd 路径真正挖空，不是白色覆盖。
透明版本没有底板；方框内部和画布空白均可透出下方背景。灰色块是不透明 #808080，不是半透明黑色。
纯黑/纯白版将灰块同样转为单色；其位置与大小不变。
背景版使用全尺寸纯白或纯黑画布，不新增圆角容器、描边、阴影或装饰。
没有新增文字标、横向组合或品牌规范。

## 工程消费与交付

Web 通过 `@inkcre/ui-web/logo/svg/original-transparent/inkcre-original-transparent-32.svg?url` 取 32px 原色透明 SVG；暗色替换为 `reverse-transparent`。也可从 `/logo/png/…` 导入对应 PNG。npm 包只包含 SVG、PNG、这份说明和清单，不安装渲染器或解压 ZIP。

Swift 在 Package.swift 声明 UI 仓库依赖，并添加 `.product(name: "InKCreLogoAssets", package: "ui")`。正式版本使用本仓库裸 SemVer tag；发布前验收固定完整 Git revision。代码可访问：

```swift
import InKCreLogoAssets
let url = InKCreLogoAssets.bundle.url(
    forResource: "inkcre-original-transparent-24px@2x", withExtension: "png",
    subdirectory: "png/2x/original-transparent")
```

资源逻辑尺寸、主题选择和 template 设置属于宿主。Xcode／标准 SwiftPM 消费使用资源 bundle；自行组装 `.app` 的消费者须将 `InKCreUI_InKCreLogoAssets.bundle` 嵌入 `Contents/Resources` 并从该目录定位，验收不能依赖本机构建目录回退。

交付仍包含 264 个 SVG／PNG（88 SVG、176 PNG）；`manifest.json` 记录文件与生成输入摘要。ZIP 与 npm 使用相同资源，在对应 UI GitHub Release 下载。App Icon 由消费者根据 Logo 制作，UI 不提供平台画布、圆角、ICNS 或 AppIcon catalog。

仓库额外保留 `sources/`、`PROVENANCE.json`、日期 ZIP 和历史 `QA-report.json` 作为输入与验收记录；它们不是持续生成的权威源，也不表示新版已经人工验收。

## 来源及修改边界

初始标准几何来自 InKCre/impl-ts Web 应用的 `apps/client-web/public/logo/256.svg`。
小尺寸几何来自 InKCre/ui 的 `packages/web/src/logo.svg`；该文件与 Web 应用的 `logo/32.svg` 具有相同的 Git blob SHA。
InKCre/docs 网站的 `inkcre-mark.svg` 也使用相同的三方块标志，连接线写法有所简化。
所有具体链接与固定版本见 `PROVENANCE.json`。

初始导入批次只改造了透明度表达、配色、画布背景和导出尺寸。该批次标准版和小尺寸版的原色白底在 256 px 与 32 px 下，分别与原始源文件渲染结果逐像素一致。
浏览器扩展中的旧式描摹 SVG 带有近白圆角底板和孤立灰点，未用于制作。旧仓库或图标缓存不作为本包的母版。
包内没有另行授予商标或品牌使用权限。

## 重建与验证

仅在图形输入或生成规则改变时执行完整重建，要求 Inkscape 1.4、Pillow 12.3.0、Python 3.10+：

```sh
python3 assets/logo/build_pack.py
```

生成器读取两份源 SVG，生成导出并更新 manifest；最多同时运行两个渲染进程。自动报告只声明自动检查。维护者另行核对常规与小尺寸、浅深色和透明孔洞；不能自动声称人工验收完成。

Web 本地迭代可使用 `python3 assets/logo/build_pack.py --svg-only`，不加载渲染工具、不更新 PNG 或清单；发布前仍必须完成相关产物重建。普通构建只校验已提交产物，不重新渲染。
