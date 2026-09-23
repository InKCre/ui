# inkLoading

InkLoading 表示正在处理。默认 variant="blocks" 的三个方块用于内容区、图谱和预览的独立等待；variant="spinner" 用于字段附近或日志尾部的紧凑行内等待。size 和 density 调整图形尺寸与间距，宿主安排居中和外部留白。

label 同时提供可见状态说明和 role="status" 的 aria-label 名称。图形和重复的可见文字节点对辅助技术隐藏，使状态名称只出现一次；status 不会自动以子内容计算名称。没有 label 时可透传 aria-label 替换默认 Loading 名称。不要在外层重复增加相同的 live region。减少动态效果偏好会停止动画，保留图形和文字。

它不管理请求，也不禁用旁边的按钮；业务组件仍需用 pending 或 disabled 阻止重复操作。

Story 的 Content waiting 展示默认三方块，Inline spinner 展示字段提示和无可见标签的紧凑状态。切换浅深主题、20px 根字号和 prefers-reduced-motion，检查颜色、间距、文字及静止图形；等待结束后应由宿主换成内容、空态或错误。

在浏览器可访问性树中检查 Content waiting 的 status 名称为“正在读取预览”，Inline spinner 的两个名称分别为“正在读取类型”和“正在追加日志”，没有额外的同文 StaticText。显式 label 优先于透传 aria-label，保证可见说明与状态名称一致。
