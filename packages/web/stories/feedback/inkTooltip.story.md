import { Story, Variant } from '@histoire/plugin-vue'
import InkTooltip from './inkTooltip.vue'

# inkTooltip

> 在 hover 时显示上下文提示信息，帮助用户理解功能或内容。
> Shows contextual hints on hover to help users understand features or content.

---

## Usage Intent

### Why this exists

- 提供非侵入式的额外信息展示
- 避免界面过度拥挤
- 统一提示信息的交互和样式

### When to use

- 图标或缩写需要解释时
- 提供操作的额外说明
- 显示截断文本的完整内容

### When NOT to use

- 关键信息（应直接显示）
- 移动端（hover 不可用，使用其他方式）
- 长篇帮助文本（使用帮助面板）

---

## Design Semantics

### Concepts

- `position`: 提示框位置，避免遮挡内容 / Tooltip position to avoid blocking content
- `content`: 提示文本，简洁明了 / Hint text, clear and concise

### Visual / UX Meaning

- **Hover 触发**: 鼠标悬停时显示，移开时隐藏
- **位置选择**: 根据触发元素位置自动避免溢出视口

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。

<Story title="Feedback/Tooltip/[Semantic] Positions">
  <Variant title="Top">
    <InkTooltip content="Tooltip on top" position="top">
      <button style="padding: 8px 16px; cursor: pointer;">
        Hover (Top)
      </button>
    </InkTooltip>
  </Variant>

  <Variant title="Bottom">
    <InkTooltip content="Tooltip on bottom" position="bottom">
      <button style="padding: 8px 16px; cursor: pointer;">
        Hover (Bottom)
      </button>
    </InkTooltip>
  </Variant>

  <Variant title="Left">
    <InkTooltip content="Tooltip on left" position="left">
      <button style="padding: 8px 16px; cursor: pointer;">
        Hover (Left)
      </button>
    </InkTooltip>
  </Variant>

  <Variant title="Right">
    <InkTooltip content="Tooltip on right" position="right">
      <button style="padding: 8px 16px; cursor: pointer;">
        Hover (Right)
      </button>
    </InkTooltip>
  </Variant>
</Story>

---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 鼠标悬停时：
  - ✅ 显示提示框
  - ✅ 提示框定位在指定方向
- 鼠标移开时：
  - ✅ 隐藏提示框
- 提示框：
  - ❌ 不会阻挡鼠标事件
  - ❌ 不会影响页面布局

---

## Public API

### Props

- `content`: 提示文本内容 / Tooltip text content
- `position`: 提示框位置 (`top` | `bottom` | `left` | `right`) / Tooltip position

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

---

## Slots

### default

触发提示的元素，通常是图标、按钮或文本。
Trigger element, usually an icon, button, or text.

---

## Extension & Composition

- 可包裹任何需要提示的元素
- 建议提示文本不超过一行
- 不要嵌套使用多个 tooltip

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不支持富文本内容（使用 Popover 组件）
- 不处理移动端点击显示（移动端应使用其他方式）
- 不提供箭头指示器（保持简洁）

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 使用 absolute 定位实现位置控制
- hover 状态通过 ref 管理
- CSS transition 实现显示/隐藏动画
- 依赖父元素的 relative 定位
