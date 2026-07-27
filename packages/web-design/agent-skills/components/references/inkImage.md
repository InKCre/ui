# inkImage

````markdown
# InkImage

An image display component with click-to-expand modal viewing capability. Perfect for showcasing images with easy full-screen viewing experience.

## Rationale

InkImage exists to provide a consistent and intuitive image viewing experience across the product. It enables users to view thumbnails in compact layouts while offering seamless expansion to full-screen view for detailed inspection. The component handles common image viewing patterns like lazy loading, error states, and keyboard navigation out of the box.

Use it for:
- Image galleries where click-to-expand is desired
- Product images that benefit from full-screen viewing
- Any scenario where an image needs both thumbnail and expanded views
- Content with supporting imagery that might require closer inspection

Avoid using it for:
- Background images or purely decorative images
- Images that should not be expanded (use `<img>` directly)
- Image carousels with multiple images (use dedicated carousel component)

## Design Semantics

### Concepts

- `src`: Image source URL (required for loading the image)
- `alt`: Alternative text for accessibility (required for semantic HTML)
- `title`: Caption or descriptive text displayed in expanded view
- `maxWidth` / `maxHeight`: Thumbnail sizing constraints
- `lazy`: Lazy loading optimization for performance
- `expanded`: Boolean state controlling whether image is displayed in expanded view
- `thumbnail` slot: Customizable thumbnail rendering
- `expanded-header` slot: Custom header in modal view
- `expanded-footer` slot: Custom footer in modal view

### Visual / UX Meaning

- **Thumbnail**: Compact preview with hover effects indicating interactivity
- **Expanded View**: Full-screen modal with:
  - Close button (top-right)
  - Optional title/caption
  - Centered, responsive image display
  - Click-outside-to-close (scrim click)
  - ESC key support for closing
  - Optional footer for additional controls
- **Hover State**: Subtle scale and shadow effects to emphasize clickability
- **Loading**: Lazy loading by default for performance

## Canonical Examples

- Basic usage with image URL:

  ```vue
  <InkImage
    src="https://example.com/photo.jpg"
    alt="Beautiful sunset"
  />
  ```

- With title and custom sizing:

  ```vue
  <InkImage
    src="https://example.com/photo.jpg"
    alt="Product showcase"
    title="Product View"
    max-width="300px"
    max-height="200px"
  />
  ```

- With custom thumbnail:

  ```vue
  <InkImage
    src="https://example.com/photo.jpg"
    alt="Gallery item"
  >
    <template #thumbnail>
      <div class="custom-thumbnail">
        <img src="https://example.com/photo.jpg" alt="Gallery item" />
        <span class="badge">View</span>
      </div>
    </template>
  </InkImage>
  ```

- With expanded footer (e.g., for additional actions):

  ```vue
  <InkImage
    src="https://example.com/photo.jpg"
    alt="Image"
    title="Details"
  >
    <template #expanded-footer>
      <div class="flex gap-2">
        <InkButton text="Download" />
        <InkButton text="Share" />
      </div>
    </template>
  </InkImage>
  ```

- Programmatic expand control:

  ```vue
  <InkImage
    v-model:expanded="isExpanded"
    src="https://example.com/photo.jpg"
    alt="Image"
    @expand="onImageExpanded"
    @close="onImageClosed"
    @error="onImageError"
  />
  ```

## Behavioral Contract

- Clicking the thumbnail expands the image in a modal overlay
- The expanded modal can be closed by:
  - Clicking the close button (top-right)
  - Clicking the scrim (overlay background)
  - Pressing the ESC key
- Images load lazily by default (performance optimization)
- If image fails to load, an `error` event is emitted with error details
- All content in expanded view respects provided slots and props
- The component is fully keyboard accessible with focus management
- ARIA labels ensure screen reader compatibility

## Extension & Composition

- Can be used in galleries, image collections, or any layout requiring image expansion
- Fully customizable via named slots (thumbnail, expanded-header, expanded-footer)
- Works well with InkButton for expanded footer actions
- Responsive design adapts to all screen sizes
- Integrates with InkPopup for modal rendering (no need to import separately)

## Non-Goals

- Image optimization or compression (use image CDN for that)
- Multi-image carousel/gallery (use dedicated component)
- Image editor or manipulation tools
- Image loading progress indicators (use InkLoading separately if needed)
- Automatic image sourcing or metadata fetching

## Implementation Notes

- Props: `src` (required), `alt` (recommended), `title`, `maxWidth`, `maxHeight`, `lazy`
- Emits: `expand`, `close`, `error`
- Model: `v-model:expanded` for state control
- Slots: `thumbnail`, `expanded-header`, `expanded-footer`
- Test IDs: `ink-image`, `ink-image-thumbnail`, `ink-image-img`, `ink-image-expanded`, `ink-image-img-expanded`, `ink-image-close-btn`
- Keyboard support: ESC to close expanded view
- Uses InkScrim internally for overlay rendering with Teleport to body for expanded view
- Responsive: Works on mobile, tablet, desktop with appropriate sizing
- Accessibility: Full ARIA labels, semantic HTML, focus management

````

## Props

```typescript
export const inkImageProps = {
  /** Image source URL */
  src: makeStringProp(),
  /** Alternative text for accessibility */
  alt: makeStringProp(),
  /** Image title or caption */
  title: makeStringProp(""),
  /** Whether to lazy load the image */
  lazy: makeBooleanProp(true),
  /** Whether the image is expanded */
  expanded: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
} as const;
```

## Events

```typescript
export const inkImageEmits = {
  /** Triggered when image is clicked to expand */
  expand: () => true,
  /** Triggered when expanded view is closed */
  close: () => true,
  /** Triggered when image fails to load */
  error: (payload: InkImageErrorPayload) => true,
  /** Triggered when expanded state changes */
  "update:expanded": (value: boolean) => true,
} as const;
```

## Types

```typescript
interface InkImageErrorPayload {
  error: Event;
  src: string;
}
```

## Import

```typescript
import { inkImage } from '@inkcre/web-design';
```
