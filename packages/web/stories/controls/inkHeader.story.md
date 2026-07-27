# InkHeader

A header component for application navigation and branding.

## Rationale

InkHeader exists to provide a consistent top navigation bar with logo, title, and menu options.

Use it for app headers where branding and navigation are needed; avoid using it for content headers or footers.

## Design Semantics

### Concepts

- `title`: main app or page title.
- `pageTitle`: current page or section title.
- `logoSrc`: image for branding.

### Visual / UX Meaning

- Logo and title on the left for branding.
- Page title and menu on the right for context and actions.

## Canonical Examples

- Basic header: With title and menu.

  ```vue
  <InkHeader title="My App" />
  ```

- With logo: For branded apps.

  ```vue
  <InkHeader title="InKCre" logoSrc="/logo.png" />
  ```

- With page title: Showing current section.

  ```vue
  <InkHeader title="Dashboard" pageTitle="Overview" />
  ```

## Behavioral Contract

- Clicking title or logo emits 'title-click'.
- Clicking menu emits 'menu-click'.
- Page title displays current route name if available.

## Extension & Composition

- Supports slot for custom right icon.
- Integrates with vue-router for automatic page titles.

## Non-Goals

- Handling routing or menu logic.
- Footer or sidebar functionality.

## Implementation Notes

- Uses vue-router if available for page title.
- Emits events for parent handling.
