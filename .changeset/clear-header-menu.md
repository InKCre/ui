---
"@inkcre/ui-web": patch
---

修复 Header 默认菜单图标被按钮透明背景覆盖而不可见的问题。按钮与装饰图标分别负责交互和绘制，保留菜单名称、键盘操作及 menu-click 事件。
