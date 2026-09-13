# inkPopup

InkPopup 是定位内容容器，使用 `v-model:open` 控制打开状态。默认 scrim=true，以原生 dialog.showModal 打开：背景不可操作，浏览器约束焦点并管理嵌套模态层级。关闭后恢复打开前的焦点。为弹层传 aria-label 或 aria-labelledby，内容可以用 autofocus 指定初始焦点。

scrim=false 使用非模态 dialog.show，背景仍可操作，不限制背景焦点。position 继续支持 center、四个边和四元组像素定位。

closeOnScrim 控制点击遮罩关闭，closeOnEscape 控制 Escape 关闭。scrim-click 报告遮罩点击；业务待处理时应关闭这两个关闭入口。程序更新 open=false 始终可以关闭。组件没有内置关闭按钮，自定义内容应提供可见的关闭动作。

需要标准标题、确认取消和异步等待时使用 InkDialog；全屏图片预览使用 InkScrim。浏览器需要支持原生 dialog，不附带 polyfill。

遮罩读取根级 overlay.scrim。内容受视口最大尺寸约束并在弹层内滚动，盒尺寸包含内边距；Teleport 到 body，只保证根级主题／字体覆盖。
