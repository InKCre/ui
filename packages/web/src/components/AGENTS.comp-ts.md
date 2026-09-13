# 组件 TypeScript 指南

`compName.ts` 维护 props、emits、公开类型和与该组件内聚的必要辅助逻辑。`defineModel` 若在 Vue 文件中声明，也是 API 的一部分；修改模型时必须同时检查这两个文件和消费者说明。

复用已有 prop helper 时，从实际存在的 `../../utils/vue-props` 导入。下面展示声明形式，不要求为每个组件复制空的类型、常量或工具分区：

```typescript
import { makeStringProp } from "../../utils/vue-props";

export const compNameProps = {
  text: makeStringProp(""),
} as const;

export const compNameEmits = {
  "update:text": (_value: string) => true,
} as const;
```

明确可选值、默认值与事件载荷；props 类型必须匹配真实运行时值。对象和数组也可以参与模型契约，是否使用模型取决于状态所有权，而不是是否为可变类型。不要直接修改父级拥有的对象。

外部未知数据先用 `unknown`，经过验证后再使用。源码定义新增公开类型时检查包入口是否需要导出；内部 helper 不因存在于组件文件中就自动成为公开 API。
