# inkDropdown

InkDropdown 从字符串或数字值的选项中选择，发出 `update:modelValue` 和 `change`。静态 options 由父级拥有；refresher 可以异步提供选项。省略 options 时组件内部保存加载结果；传入 options 时应接收 `update:options`，例如使用 `v-model:options`。

聚焦触发按钮后，Enter、Space 或方向键打开列表；上下方向键移动，Home/End 到边界，Enter 选择。直接输入字符会进入搜索框，支持按标签和 description 过滤。Escape、Tab、焦点离开或点击外部关闭；选择和 Escape 后焦点回到触发按钮。

加载失败显示提示并发出 error，不伪装成空列表成功。过期加载结果和卸载后的结果不会写回。disabled 或 editable=false 禁止选择和刷新；加载期间禁止选择和步进。

label 自动关联按钮，name 提供隐藏表单值。required 表达 aria-required，应用仍需验证必选值；它不是原生 select 的 required 校验。

带框触发器最小高度 36px，长标签和选项说明允许换行。选中项的标签与描述都使用 on-primary；鼠标和键盘高亮使用同一选中 hover 配色。
