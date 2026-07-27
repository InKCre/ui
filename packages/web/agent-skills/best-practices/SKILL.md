---
name: best-practices
description: Best practices for developing with @inkcre/ui-web including coding guidelines and accessibility.
---

# Best Practices

Use this skill for guidance on developing with @inkcre/ui-web.

## Component Development

1. **Single Responsibility**: Each component does one thing well
2. **High Cohesion, Low Coupling**: Keep related code together, minimize dependencies
3. **Clear API**: Props and events should be intuitive
4. **Avoid Prop Drilling**: Use provide/inject for deeply nested data
5. **Testable**: Write components that are easy to test

## Naming Conventions

- **Components**: `camelCase` (e.g., `inkButton`)
- **CSS Classes**: `kebab-case` (e.g., `ink-button`)
- **Props/Variables**: `camelCase` (e.g., `isLoading`)
- **Events**: `kebab-case` (e.g., `update:modelValue`)

## Error Handling

- Use graceful degradation
- Provide user-friendly error messages
- Log errors appropriately
- Validate inputs and provide defaults

## Accessibility

- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

## Performance

- Use `v-if` vs `v-show` appropriately
- Avoid unnecessary watchers
- Use `computed` for derived state
- Lazy load components when possible
- Optimize large lists with virtual scrolling

## Code for Human Brains

Write code that's easy to understand:

- **Keep it simple**: Prefer straightforward solutions
- **Limit cognitive load**: Keep functions simple (≤4 concepts to hold in memory)
- **Use meaningful names**: Variables should be self-documenting
- **Prefer early returns**: Avoid deeply nested conditions
- **Comment the "why"**: Explain motivation, not just what

### Example

❌ Hard to understand:
```typescript
if (val > someConstant && (condition2 || condition3) && (condition4 && !condition5)) {
  // What are we checking?
}
```

✅ Easy to understand:
```typescript
const isValid = val > someConstant;
const isAllowed = condition2 || condition3;
const isSecure = condition4 && !condition5;

if (isValid && isAllowed && isSecure) {
  // Clear what each condition means
}
```
