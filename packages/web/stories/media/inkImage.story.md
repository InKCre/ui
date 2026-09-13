# inkImage

InkImage 用原生按钮展示缩略图，Enter/Space 或点击打开全屏预览；名称优先使用 alt，其次是 title。请提供描述图片用途的 alt。

`v-model:expanded` 控制预览，省略时内部管理状态。预览由 InkScrim 提供模态、Escape、关闭按钮和焦点恢复；点击图片或扩展内容不会误关闭。expand、close 反映用户打开和关闭动作；图片加载失败发出带 error 与 src 的载荷。

thumbnail、expanded-header、expanded-footer 可以补充内容，但缩略图槽内部不要嵌套另一个按钮。

“Custom Thumbnail Slot”在缩略图下方持续显示查看提示，可用键盘打开；“With Expanded Footer”提供实际 SVG 文件的下载链接。标题、提示和下载链接各自使用有明确前景配对的底板，在浅深主题和图片背景上保持可读。

展开标题可以完整换行，并使用固定深色底板和浅色文字，避免明亮或复杂图片降低可读性。预览区保持图片比例，超长内容可在局部滚动。
