# @inkcre/ui-web

## 1.2.2

### Patch Changes

- e74f929: Add InkImage and InkScrim

## 1.2.1

### Patch Changes

- 1856fb9: Update InkDropdown: add stepping
- 582944b: Update InkDropdown: support arrow up/down navigation
- ebd2b76: Fix: InkDialog open issue
- 7d445ad: upd(InkButton): support prop `icon` and rename `icon` type to `square`
- dd9e768: Update style: add UnoCSS preset
- 60abffb: Update InkDropdown: support incremental search

## 1.2.0

### Minor Changes

- 31b01fd: Add internationalization support with vue-i18n. Library now supports en and zh-CN locales, with consumers able to provide their own i18n instance.

### Patch Changes

- 6506b64: Update InkDropdown: load lazy options if modelValue is set
- f51bdf6: Fix InkButton size style lost
- f9c5d5d: Fix: InkButton make breaking changes to prop `type`

## 1.1.6

### Patch Changes

- 8ebafb5: InkButton: move `type` to `theme`, add `type` icon
- 926f109: Fix inkLoading size not work
- 4b2e070: Add inkAutoForm
- aa19a81: Add inkPagination component with page buttons and prev/next navigation
- a42627f: Fix InkDropdown: display description

## 1.1.5

### Patch Changes

- 7882d27: Optimize histoire DX by adding necessary highlights back

## 1.1.4

### Patch Changes

- 083700b: Update InkDropdown: separate loader from options
- 89ef855: InkJsonEditor ensures modelValue is valid JSON string

## 1.1.3

### Patch Changes

- 467753c: Optimize histoire build size of web-design package (33mb -> 1.2mb)
- c663933: Add inkPlaceholder component for empty and error states

## 1.1.2

### Patch Changes

- 9aa3cae: Fix inkJsonEditor to react to schema changes. Added a watcher for the schema prop to reconfigure JSON validation and autocomplete when the schema updates.

## 1.1.1

### Patch Changes

- e0614a1: make InkHeader load page title from router automatically
- 52e5ce6: Fix inkJsonEditor collapse in popup
- 4fb87ce: Move styles to root.
- aaf60e8: Fix InkLoading flashing
- fca79fd: ref InkDialog to reuse InkPopup

## 1.1.0

### Minor Changes

- c4801e8: InkJsonEditor supports JsonSchema

### Patch Changes

- adea8b8: Add inkDialog component and loading state support for inkButton
- 32c8290: Add UnoCSS + mdi icons
