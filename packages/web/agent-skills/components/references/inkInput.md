# InkInput

# inkInput

> 提供灵活的文本输入，支持标准输入和内联编辑模式。
> Provides flexible text input with standard and inline editing modes.

---

## Usage Intent

### Why this exists

- 统一文本输入的样式和交互
- 支持表单集成和独立使用两种模式
- 提供内联编辑能力，适合详情页快速修改

### When to use

- 表单中的文本输入字段
- 需要内联编辑功能的场景
- 需要与 InkForm 集成的输入

### When NOT to use

- 多行文本输入（使用 `InkTextarea`）
- 选择型输入（使用 `InkDropdown` 或 `InkPicker`）

---

## Design Semantics

### Concepts

- `type`: 输入模式 / Input mode
  - `default`: 标准输入框，带边框 / Standard input with border
  - `inline`: 内联编辑，点击后显示输入框 / Inline edit, shows input on click
- `layout`: 与标签的布局关系（仅在表单中有效）/ Layout with label (only in forms)

### Visual / UX Meaning

- **Default Type**: 明确的输入区域，适合表单填写
- **Inline Type**: 低干扰的编辑体验，适合详情页修改

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。


  
    <InkInput
      modelValue=""
      label="Full Name"
      placeholder="Enter your name"
      layout="col"
    />
  

  
    <InkInput
      modelValue=""
      label="Email"
      placeholder="email@example.com"
      layout="inline"
    />
  



  
    <InkInput
      modelValue=""
      label="Nickname"
      placeholder="Optional field"
      :required="false"
      layout="col"
    />
  

  
    <InkInput
      modelValue=""
      label="Email Address"
      placeholder="email@example.com"
      :required="true"
      layout="col"
    />
  


---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 当 `type="default"` 时：
  - ✅ 始终显示输入框
  - ✅ 实时触发 `update:modelValue` 事件
- 当 `type="inline"` 时：
  - ✅ 默认显示纯文本
  - ✅ 点击后切换为输入框
  - ✅ 按 Enter 保存，按 Esc 取消
  - ✅ 失焦时退出编辑但不保存
- 与 InkForm 集成时：
  - ✅ 自动继承表单的 layout 配置
  - ✅ 自动使用 InkField 包装

---

## Public API

### Props

- `modelValue`: 输入值（支持 v-model）/ Input value (supports v-model)
- `type`: 输入类型 (`default` | `inline`) / Input type
- `label`: 字段标签（启用 InkField 包装）/ Field label (enables InkField wrapper)
- `layout`: 布局模式（仅在有 label 时）/ Layout mode (only with label)
- `placeholder`: 占位符文本 / Placeholder text
- `required`: 是否必填 / Whether required
- `editable`: 是否可编辑 / Whether editable

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

### Events

- `update:modelValue(value: string)`: 输入值变化时触发 / Emitted when input value changes

---

## Extension & Composition

- 可独立使用或集成在 InkForm 中
- 支持 v-model 双向绑定
- 内联模式适合与 InkField 组合使用

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不提供输入验证（应由表单层处理）
- 不处理密码显示/隐藏（使用专门的密码组件）
- 不支持多行文本（使用 InkTextarea）

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 使用 `@vueuse/core` 的 `createReusableTemplate` 实现模板复用
- 内联模式通过 ref 管理编辑状态
- 依赖 InkForm 的 provide/inject 机制自动集成

### Slots

- `default`: Customize the display value in inline mode. If not provided, displays the `modelValue` by default.

### Inline Type Behavior

When `type="inline"`:

- Displays as plain text by default
- Clicking the text enters edit mode
- Shows a bordered input field in edit mode (same as default type)
- **Pressing Enter saves the edit and exits edit mode**
- **Pressing Esc or clicking outside exits edit mode without saving changes**
- Use the default slot to customize how the value is displayed

## Props

```typescript
export const inkInputProps = {
  ...formControlCommonProps,
  modelValue: makeStringProp<string | null>(""),
  placeholder: makeStringProp(""),
  type: makeStringProp<InkInputType>("default"),
} as const;
```

## Events

```typescript
export const inkInputEmits = {
  "update:modelValue": (value: string) => true,
} as const;
```

## Types

```typescript
type InkInputType = "default" | "inline";

// --- Props ---
export const inkInputProps = {
  ...formControlCommonProps,
  modelValue: makeStringProp<string | null>(""),
  placeholder: makeStringProp(""),
  type: makeStringProp<InkInputType>("default"),
}
```

## Import

```typescript
import { InkInput } from '@inkcre/ui-web';
```
