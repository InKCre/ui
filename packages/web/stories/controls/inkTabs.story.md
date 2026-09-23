# InkTabs

受控的选项切换。传入 `tabs`、当前 `modelValue` 和描述这组选项的 `label`；组件发出 `update:modelValue`，不管理页面路由或内容。左右箭头、Home、End 移动并激活选项。

如果选项指向不同路由，在项中提供 `to`，并通过 `linkComponent` 传入宿主的 `RouterLink`。这样链接仍由宿主路由处理，浏览器前进、后退和链接操作保持可用；UI 包不依赖 vue-router。
