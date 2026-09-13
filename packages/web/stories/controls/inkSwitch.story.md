# inkSwitch

InkSwitch 用于布尔状态，渲染 type="button"、role="switch" 和 aria-checked。Space/Enter 和点击都请求切换；不会提交所在表单。用 label 对应的 for/id 或 aria-label 提供稳定名称。

modelValue 可以是 boolean 或 Promise<boolean>。Promise 期间保留上一显示值并禁用操作；只应用最新模型对应的结果。拒绝时保留上一值、结束等待并发出 `error(unknown)`，消费者负责展示业务失败。推荐布尔模型配合显式 isSwitching；disabled 也阻止操作。

受控模型仍由父级接受 `update:modelValue`，组件不会绕过父级拒绝的更新。

轨道由两个等宽区域组成，两种状态文案共同参与尺寸计算，切换与 pending 不改变宽度。xs/sm/md/lg 最小尺寸为 60×24、80×24、100×36、120×48px，字体放大或长文案可增大尺寸。检查“长状态文案保持轨道尺寸”中的英文、中文和等待状态。
