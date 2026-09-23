# inkDialog

InkDialog 在 InkPopup 上提供标题、内容和确认取消。modelValue 支持 boolean 或 Promise<boolean>；推荐布尔模型配合显式 isLoading。Promise 期间保留已有开关状态，只接受最新结果；拒绝时保留已有状态并发出 error，消费者负责业务错误提示。

等待期间禁用内部 InkButton，并阻止确认、取消、Escape 和遮罩关闭。默认 Confirm 显示等待图标，Cancel 仅禁用，不显示正在执行。用户确认仅发出 confirm，父级决定何时关闭；取消、Escape 和允许的遮罩关闭发出 cancel，再请求 update:modelValue(false)。程序替换模型仍可关闭或中止等待。

title 自动用作弹层名称。自定义 header 或无标题时，提供 aria-label/aria-labelledby。默认槽与 footer 槽均获得 cancel、confirm、isLoading；自定义 footer 将 isLoading 传给正在执行的 InkButton，其他按钮只继承交互禁用。业务有多个独立动作时，由业务选择实际执行动作的 loading。原生按钮不参与 InkButton 的注入约束，须显式 disabled 并使用受保护的槽回调。

Story 的 Async 用 Promise 模型验证默认确认动画和关闭锁。开启模拟失败后确认，等待两秒，Dialog 应保留并显示错误，取消与重试恢复可用。Custom footer failure and retry 默认先失败：保存期间只有保存按钮转圈，取消 disabled；Escape 和遮罩都不能关闭。失败后输入保持，取消恢复；取消勾选模拟失败再保存即可成功关闭。减少动态效果偏好下确认图形静止，状态文字仍保留。

标题使用 title-sm，副标题使用 body-md。长标题与底部操作允许换行；Popup 统一承担内边距；默认宽度上限 640px，窄视口两侧各留 16px。
