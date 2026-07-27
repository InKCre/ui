# InkImage Component - Style Alignment Plan

## Overview

Align the `inkImage` component's expand variant styles with the Figma Design, using design tokens instead of hardcoded values.

## Design Analysis

### Figma Design Specifications

**Expand Variant (371:8)**:

- Container: Full viewport coverage
- Background: `color/scrim/base` (#c6c6c6 - semi-transparent overlay)
- Padding: `space/lg` (32px) horizontal, `space/xl` (56px) vertical
- Layout: Flex container centered, fills available space
- Image: Object-fit contain, maintains aspect ratio, fills space
- Annotation: "takes up the whole viewport"

**Thumbnail Variant (371:6)**:

- Dimensions: 370px width × 240px height
- Layout: Block button element
- Image: Object-fit cover (fills the space)
- Background: White

### Design Tokens to Use

From Figma:

- `color/scrim/base`: #c6c6c6 (overlay background)
- `space/lg`: 32px (horizontal padding)
- `space/xl`: 56px (vertical padding)

From InKCre Token System:

- `sys-var(color, surface, base)`: Background colors
- `sys-var(elevation, *)`: Shadow elevation tokens
- `sys-var(opacity, *)`: Opacity values

## Current Issues

1. **Hardcoded values**: Colors not using design tokens
2. **Expand container**:
   - Uses fixed dimensions (90vw, 90vh, max 1200px × 800px) - should stretch to viewport
   - Background: white instead of scrim overlay
   - Positioned absolutely instead of fixed full viewport
3. **Overlay/Scrim**:
   - Currently separate component, should be integrated with proper scrim color token
4. **Missing layout consistency**:
   - Padding should use design tokens
   - Border radius should use design tokens

## Implementation Strategy

### 1. Update `inkImage.scss`

**Key Changes**:

- Replace hardcoded colors with `sys-var()` calls
- Use design tokens for spacing (padding, margin)
- Use design tokens for elevation (shadows)
- Update expand container to full viewport layout
- Update scrim background to use proper token
- Ensure thumbnail matches 370×240px design

### 2. Update `inkImage.vue`

**Key Changes**:

- Adjust template structure to match Figma layout
- Remove fixed positioning constraints
- Ensure proper flex layout for expand view
- Keep slots and functionality intact

### 3. Update `inkImage.ts`

**Changes** (if needed):

- No prop changes needed
- Update documentation to reflect design token usage

## Design Token Mapping

| Design Value | Token Path | Current Value | Token Type |
|---|---|---|---|
| Scrim background | `color/scrim/base` | #c6c6c6 | Color |
| Padding (horizontal) | `space/lg` | 32px | Space |
| Padding (vertical) | `space/xl` | 56px | Space |
| Surface background | `sys-var(color, surface, base)` | - | System |
| Border divider | `sys-var(color, border, base)` | - | System |
| Text | `sys-var(color, text, base)` | - | System |
| Elevation | `sys-var(elevation, raised, *)` | - | System |

## Expected Outcomes

✅ Expand variant fills entire viewport  
✅ Scrim overlay uses proper color token (#c6c6c6)  
✅ Padding uses space tokens (32px/56px)  
✅ All colors use `sys-var()` for theme consistency  
✅ Thumbnail dimensions match design (370×240)  
✅ Image object-fit properly (contain for expand, cover for thumbnail)  
✅ No hardcoded colors in SCSS  
✅ Design token compliance  

## Files to Modify

1. `packages/web/src/components/inkImage/inkImage.scss`
2. `packages/web/src/components/inkImage/inkImage.vue`
3. `packages/web/src/components/inkImage/inkImage.ts` (documentation only)
