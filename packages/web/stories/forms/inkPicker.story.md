# inkPicker

InkPicker 用按钮展示值并打开选择弹层。内置 type=date/time/datetime 的模型必须是有效 Date，null/undefined 表示尚未选择；字符串应由消费者在数据边界转换。打开空值会创建当前日期草稿，不立即更新模型。

选择仅修改草稿；Confirm 发出新的 Date 并关闭，Cancel、Escape 和遮罩关闭丢弃草稿。打开期间替换外部模型或日期范围会重新初始化草稿。minDate/maxDate 限制时间戳，越界值在草稿中夹取到边界；无效 Date 或倒置范围会显示错误并禁用确认。外部值不会仅因显示而自动改写。

showPopup 省略时内部管理，也可用 `v-model:showPopup` 受控管理。label 自动关联触发按钮，editable=false 或 disabled 禁止打开。内置操作文案使用可选 i18n。

省略 type 时保留自定义默认槽，槽参数 modelValue 与 closePopup 供业务选择器使用；自定义内容的草稿与提交由消费者负责。

box 模式最小高度 36px，文字可换行并增高；inline-text 不增加盒式最小高度。确认／取消操作允许换行，日期列在空间不足时局部横向滚动。
