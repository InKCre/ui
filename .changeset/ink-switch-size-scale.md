---
"@inkcre/ui-web": minor
---

Remap the InkSwitch size scale so `md` matches the previous `sm` dimensions (80x24), `lg` matches the previous `md` (100x36), and `sm` gets smaller (64x24). The base/xs tier shrinks to 48x20. This is a visual change for consumers relying on the old `md`/`lg` rendered sizes; the `md` default was oversized relative to the label font and surrounding form controls.
