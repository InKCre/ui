# inkDialog

InkDialog 在 InkPopup 上提供标题、内容和确认取消。modelValue 支持 boolean 或 Promise<boolean>；推荐布尔模型配合显式 isLoading。Promise 期间保留已有开关状态，只接受最新结果；拒绝时保留已有状态并发出 error，消费者负责业务错误提示。

等待期间禁用内部 InkButton，并阻止确认、取消、Escape 和遮罩关闭。用户确认仅发出 confirm，父级决定何时关闭；取消、Escape 和允许的遮罩关闭发出 cancel，再请求 update:modelValue(false)。程序替换模型仍可关闭或中止等待。

title 自动用作弹层名称。自定义 header 或无标题时，提供 aria-label/aria-labelledby。默认槽获得 cancel、confirm、isLoading；自定义 footer 使用相同状态约束，不要绕过等待保护。Story 的异步例子展示确认期间的关闭行为。

标题使用 title-sm，副标题使用 body-md。长标题与底部操作允许换行；Popup 统一承担内边距；默认宽度上限 640px，窄视口两侧各留 16px。
