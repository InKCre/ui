# inkScrim

InkScrim 是全屏模态内容容器，`v-model:open` 管理打开状态。原生 dialog 负责背景不可操作、焦点进入与恢复以及嵌套层级。给容器提供 aria-label 或 aria-labelledby。

closeOnScrim 和 closeOnEscape 默认允许遮罩或 Escape 关闭。showCloseButton 可显示关闭按钮，默认槽也获得 close 方法。点击槽内容不会当作遮罩点击。用户关闭会发出 close；遮罩点击另发 scrim-click。消费者主动设置 open=false 不表示一次用户关闭动作。

使用 InkPopup、InkDialog 或 InkImage 时通常不需要再套一个 Scrim，因为它们已经拥有浮层责任。

背景读取根级 overlay.scrim，与 Popup 的遮罩保持相同透明度。局部 wrapper 的变量不会自动跟随 Teleport。
