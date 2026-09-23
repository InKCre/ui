# inkButton

InkButton 发起一个动作，`type="default|square"` 控制外形，`nativeType="button|submit|reset"` 控制原生表单行为。默认是 `button`；提交按钮必须显式写 `nativeType="submit"`。

`click` 传出原生 MouseEvent。`disabled`、自身 `isLoading` 或 Dialog 注入的 pending 状态都会禁用按钮，阻止重复动作。图标按钮应直接提供 `aria-label`；Tooltip 只补充说明，不替代可访问名称。

只有自身 isLoading 显示 spinner 与 aria-busy，Dialog 的交互锁不会让取消等非执行动作转圈。减少动态效果偏好下 spinner 静止，保留按钮文字与禁用约束。默认 Dialog 确认按钮自动绑定 loading；自定义 footer 的执行按钮须显式绑定。

Story 的“Explicit form submission”可检查普通动作不提交、提交按钮仍触发原生校验和 submit。

默认主题是 subtle，主动作显式设置 primary。md/sm 最小高度为 36/24px，文本可换行，图标随字号为 1em。hover 与 pressed 使用对应 hover 表面；focus 独立描边。pending 保留原配色、标签和相邻 spinner，停止 hover；普通 disabled 使用次要文字和表面。
