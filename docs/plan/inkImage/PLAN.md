# InkImage Component - Implementation Plan

## Overview

Add a new `InkImage` component to the web-design package that supports click-to-expand image viewing with a modal overlay.

## Project Understanding

### Existing Patterns

1. **Component Structure**: Each component consists of:
   - `compName.ts`: Props, emits, types, constants
   - `compName.vue`: Template and logic
   - `compName.scss`: Styles
   - `compName.story.md`: Documentation
   - `compName.test.ts`: Unit tests
   - `compName.story.vue`: Storybook stories

2. **Modal/Overlay Pattern**: InkPopup component provides:
   - Teleport to body for rendering modal content
   - Overlay scrim with click-to-close
   - Smooth transitions (fade for overlay, slide for content)
   - Customizable positioning
   - Works with `defineModel` for `v-model:open` binding

3. **Coding Standards**:
   - Vue 3 Composition API with `<script setup>`
   - Prop definitions extracted to `.ts` file using `makeBooleanProp`, `makeStringProp`
   - SCSS scoped styles
   - I18n for user-facing text
   - UnoCSS for utility classes
   - Type-safe with no `any` types

## Design Specification for InkImage

### Component Purpose

Display an image with the ability to click it to expand to full-screen view in a modal. The expanded view should show:

- Full-resolution image (or max-sized)
- Close button
- Optional caption/description
- Optional image metadata (alt text, title)

### Props

- `src` (string, required): Image source URL
- `alt` (string): Alternative text for accessibility
- `title` (string): Image title/caption
- `maxWidth` (string, default: "100%"): Max width in thumbnail mode
- `maxHeight` (string): Max height in thumbnail mode
- `lazy` (boolean, default: true): Lazy load image
- `expandPosition` (PopupPosition, default: "center"): Expanded view position

### Emits

- `expand`: When image is clicked to expand
- `close`: When expanded view is closed
- `error`: When image fails to load

### Slots

- Default: Custom thumbnail rendering
- `expanded-header`: Custom header in expanded view
- `expanded-footer`: Custom footer in expanded view

### Model

- `v-model:expanded` (boolean): Whether the image is in expanded view

## Implementation Steps

### Step 1: Create Component Files

- Create `inkImage/` directory
- Create `inkImage.ts` with props, emits, types
- Create `inkImage.vue` with template and logic
- Create `inkImage.scss` with styles
- Create `inkImage.test.ts` with basic tests
- Create `inkImage.story.md` with documentation
- Create `inkImage.story.vue` with story examples

### Step 2: Implement Core Functionality

- Display thumbnail image
- Handle click to expand
- Show modal with full-size image
- Close button functionality
- Keyboard shortcuts (ESC to close)
- Lazy loading support

### Step 3: Add Styling

- Thumbnail styles (border, padding, cursor)
- Expanded view styles (centered, responsive)
- Close button styling
- Animations/transitions
- Responsive design

### Step 4: Add Tests

- Test prop rendering
- Test expand/close functionality
- Test image error handling
- Test accessibility features

### Step 5: Register Component

- Add import to `src/index.ts`
- Add global registration
- Ensure it's exported in the main entry point

### Step 6: Documentation

- Document props and slots in story.md
- Provide usage examples
- Document rationale and design semantics
- List best practices

## Key Considerations

### UX/Interactions

- Click thumbnail → modal opens with full image
- Click close button → modal closes
- Click overlay/scrim → modal closes (closeOnScrim)
- ESC key → modal closes
- Mobile: Ensure touch-friendly expand/close

### Accessibility

- Proper `alt` text support
- ARIA labels for interactive elements
- Keyboard navigation (ESC key)
- Focus management

### Styling

- Follow InkCre design tokens
- Use UnoCSS for utilities
- SCSS for component-specific styles
- Responsive design for all screen sizes

### Testing

- Use `data-testid` attributes throughout component for easier testing
- Test IDs: `ink-image`, `ink-image-thumbnail`, `ink-image-expanded`, `ink-image-close-btn`, etc.

### Performance

- Lazy loading option for initial render
- Optional image optimization support
- Efficient modal rendering using Teleport

## File Structure

```
packages/web/
├── src/components/inkImage/
│   ├── inkImage.ts           # Props, emits, types
│   ├── inkImage.vue          # Component template and logic
│   ├── inkImage.scss         # Component styles
│   └── inkImage.test.ts      # Unit tests
└── stories/media/
    ├── inkImage.story.md     # Documentation
    └── inkImage.story.vue    # Histoire story
```

## Dependencies

- Uses existing InkPopup component for modal
- Uses Vue 3 built-in features (defineModel, Teleport)
- UnoCSS for styling
- No external image libraries required (native img element)

## Next Steps

1. Get user approval on this plan
2. Implement component files
3. Create comprehensive tests
4. Document usage and design rationale
5. Register in global plugin
