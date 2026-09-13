# inkDatetimePickerView

InkDatetimePickerView 编辑一个有效 Date，通过 `update:modelValue(Date)` 请求更新，永不原地修改传入对象。它只负责选择视图，确认取消由 InkPicker 管理。

日期和时间列使用可键盘操作的原生 select。12 小时制只有 1—12，AM/PM 区分午夜和正午。年或月变化时将日期限制到新月份的最后一天。weekday 系列模式显示星期列，选择同一周内对应日期；带 date/datetime 后缀时同时显示相关列。

minDate/maxDate 比较完整时间戳并夹取候选值，避免显示已选但模型拒绝的越界状态。外部模型或范围更新会更新显示；不因显示而主动发出模型事件。无效 Date 或倒置范围显示错误。没有边界时年份默认覆盖当前年份前后 100 年，并包含当前值的年份。

locale 或注入 i18n.locale 决定月份和星期名称；列标题使用可选 i18n 的 datetime 文案。编辑保留未修改的秒和毫秒。

日期列使用 label-lg，原生 select 保留必要边界和独立焦点轮廓；窄容器使用列区域内横向滚动。
