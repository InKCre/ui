# InkPlaceholder

A component to communicate empty or error states and guide users to appropriate actions.

## Rationale

InkPlaceholder exists to provide consistent visual feedback when content is unavailable or an error occurs, reducing user confusion and providing clear next steps.

Use it when:

- A view has no data to display (empty state)
- An operation fails and the user needs guidance (error state)
- You need to suggest actions to resolve the empty/error condition

Avoid using it for:

- Loading states (use InkLoading instead)
- Inline validation errors (use form field validation)
- Temporary placeholder content during data fetching

## Design Semantics

### Concepts

- `state`: visual variant representing the reason for no content (`empty`, `error`)
- `illustration`: icon or custom visual representing the state
- `title`: primary message explaining the state
- `description`: secondary text providing context or guidance
- `actions`: suggested actions to resolve or navigate away from the state

### Visual / UX Meaning

- `empty`: neutral state indicating no data exists yet; uses subtle colors to avoid alarm
- `error`: critical state indicating something went wrong; uses danger colors to signal urgency

## Canonical Examples

- Empty state (default): Used when a list, table, or collection has no items.

  ```vue
  <InkPlaceholder state="empty" />
  ```

- Empty state with custom content and actions: Guide users to create their first item.

  ```vue
  <InkPlaceholder
    state="empty"
    title="No projects"
    description="Start by creating your first project."
  >
    <template #actions>
      <InkButton text="Create Project" theme="primary" />
    </template>
  </InkPlaceholder>
  ```

- Error state with retry: Used when an operation fails and can be retried.

  ```vue
  <InkPlaceholder
    state="error"
    title="Connection failed"
    description="Unable to connect to the server."
  >
    <template #actions>
      <InkButton text="Retry" theme="primary" />
    </template>
  </InkPlaceholder>
  ```

- Custom illustration via slot: Override the default icon with custom content.

  ```vue
  <InkPlaceholder state="empty" title="No files" description="Upload a file to get started.">
    <template #illustration>
      <span class="i-mdi-folder-outline" />
    </template>
  </InkPlaceholder>
  ```

## Behavioral Contract

- Default content is provided for both `empty` and `error` states:
  - Empty: "No data" title, "There's nothing here yet." description, inbox icon
  - Error: "Something went wrong" title, "An error occurred. Please try again." description, alert icon
- All content (illustration, title, description) can be overridden via props or slots
- Actions slot is only rendered when provided (does not show empty container)
- The component is presentational only; it does not handle action logic or state management

## Extension & Composition

- Can be used in any container requiring empty/error state feedback
- Supports full customization via named slots (illustration, title, description, actions)
- Works well with InkButton for action suggestions
- Not recommended for use within small containers (< 300px wide) due to centered layout

## Non-Goals

- Does not handle loading states or async operations
- Does not manage retry logic or error recovery (caller's responsibility)
- Does not provide built-in navigation or routing
- Does not enforce specific icon libraries (UnoCSS icons work by default)

## Implementation Notes

- Props: `state` (`empty` | `error`, default `empty`), `illustration` (string), `title` (string), `description` (string)
- Slots: `illustration`, `title`, `description`, `actions`
- Default icons use UnoCSS MDI icons: `i-mdi-inbox-outline` (empty), `i-mdi-alert-circle-outline` (error)
- Consumers should add default icons to UnoCSS safelist: `i-mdi-inbox-outline`, `i-mdi-alert-circle-outline`
- Layout uses flexbox with centered alignment; max-width on description (400px) for readability
