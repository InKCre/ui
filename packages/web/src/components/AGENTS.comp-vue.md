# Vue 组件指南

使用 `<script setup lang="ts">`，从同目录的 `./compName` 导入 props 和 emits。组件样式沿用 `<style lang="scss" scoped src="./compName.scss" />`。按照真实逻辑组织代码，不保留没有内容的生命周期、watcher 或方法分区。

先明确状态归父级、组件还是编辑草稿所有，再决定模型、computed、ref 和 watcher。使用 `defineModel` 或现有模型 helper 时说明受控更新与内部状态的边界；不能仅为写法统一改变消费者接口。

模板选择符合语义的原生元素，并明确按钮用途、控件标签和键盘行为。使用 span 表示行内文本，段落使用 p，不按视觉外形替换语义。

优先使用 Vue 和已有依赖能直接表达的逻辑。模板确有重复且只在本组件使用时，可以复用已安装 VueUse 的 `createReusableTemplate`；简单重复不要求额外抽象。

面向用户的默认文案应沿用库的 i18n 适配边界，消费者自定义内容可由 props 或 slots 提供。不要为了国际化直接引入应用级 router 或 i18n 实例。

事件处理函数使用能表达动作的名称。异步操作应区分 pending、成功和失败，涉及可重入操作时检查旧结果是否能覆盖新状态；具体策略由该组件行为决定。
