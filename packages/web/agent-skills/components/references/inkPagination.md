# InkPagination

# InkPagination

A pagination component that provides a row of page buttons with outline on hover and prev/next navigation actions.

## Rationale

InkPagination exists to provide consistent navigation through paginated content across the product. It displays page numbers as buttons and provides previous/next navigation controls. It supports two types: default (with numbered buttons) and text (with text navigation and page info).

Use it when you need to navigate through multiple pages of content in a list or table view. Avoid using it when content should be loaded incrementally (use infinite scroll instead) or when there are very few items that fit on one page.

## Design Semantics

### Concepts

- `currentPage`: the currently active page number (1-indexed)
- `totalPages`: the total number of pages available
- `type`: the pagination type - "default" (numbered buttons) or "text" (text navigation with page info)
- `page-change` event: emitted when user clicks on a page button or prev/next navigation

### Visual / UX Meaning

**Default type:**

- Page buttons show transparent background with outline border on hover
- Active page button has primary color border and subtle background
- Prev/Next buttons show chevron icons and are disabled at boundaries
- Ellipsis (...) shows when there are many pages, indicating hidden pages

**Text type:**

- Shows "Previous" and "Next" text buttons
- Displays "x of y" page information in the center
- No numbered page buttons
- Navigation buttons are disabled at boundaries

## Canonical Examples

- Basic pagination with few pages:

  ```vue
  <InkPagination
    :current-page="currentPage"
    :total-pages="5"
    @page-change="(page) => (currentPage = page)"
  />
  ```

- Pagination with many pages (shows ellipsis):

  ```vue
  <InkPagination
    :current-page="currentPage"
    :total-pages="50"
    @page-change="(page) => (currentPage = page)"
  />
  ```

- Text type pagination:

  ```vue
  <InkPagination
    type="text"
    :current-page="currentPage"
    :total-pages="20"
    @page-change="(page) => (currentPage = page)"
  />
  ```

## Behavioral Contract

- Clicking a page button emits `page-change` event with the page number
- Clicking prev/next buttons navigates to adjacent pages
- Prev button is disabled on first page
- Next button is disabled on last page
- Active page button cannot be clicked again (default type only)
- When there are 7 or fewer pages, all pages are shown (default type only)
- When there are more than 7 pages, ellipsis (...) appears to indicate hidden pages (default type only)
- Pages are always 1-indexed (first page is 1, not 0)
- Text type displays "x of y" format for page information

## Extension & Composition

- The component is intentionally simple and designed for direct use
- Works well inside table footers or list containers
- Parent component should manage the current page state via v-model pattern or event handling

## Non-Goals

- Does not handle data fetching or loading states
- Does not provide per-page size selection (e.g., "10 per page" dropdown)
- Does not show total item count or "showing X-Y of Z" text
- Does not support custom page ranges or arbitrary page jumps via input field

## Implementation Notes

- Props: `currentPage` (number, default 1), `totalPages` (number, default 1), `type` (string, default "default")
- Emits: `page-change` (page: number) when user navigates to a different page
- Uses chevron icons from mdi icon set for prev/next navigation (default type)
- The ellipsis button is disabled and cannot be clicked (default type)
- Smart page number display: shows first, last, current, and adjacent pages with ellipsis for gaps (default type)
- Text type uses InkButton components with "subtle" theme

## Props

```typescript
export const inkPaginationProps = {
	currentPage: makeNumberProp(1),
	totalPages: makeNumberProp(1),
	type: makeStringProp<PaginationType>("default"),
} as const;
```

## Events

```typescript
export const inkPaginationEmits = {
	"page-change": (page: number) => true,
} as const;
```

## Types

```typescript
type PaginationType = "default" | "text";

// --- Props ---
export const inkPaginationProps = {
	currentPage: makeNumberProp(1),
	totalPages: makeNumberProp(1),
	type: makeStringProp<PaginationType>("default"),
}
```

## Import

```typescript
import { InkPagination } from '@inkcre/ui-web';
```
