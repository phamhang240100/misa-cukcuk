# Application Design & Logic Guidelines

This document serves as the source of truth for design consistency, layout patterns, and business logic for the application. All future modifications must adhere to these rules.

## 1. Visual Identity & Colors
- **Brand Color**: `#076EFF` (Tailwind `brand`). Used for primary actions, confirmation buttons, and active states.
- **Background**: `#EEF0F4` (Tailwind `background`). Applied to the main application body.
- **Borders & Dividers**: `slate-100` for subtle separators, `slate-200` for defined borders.
- **Status Colors**:
  - **Success (Green)**: `#10B981`. Used for "Lưu tạm tính", "Đã hoàn thành".
  - **Warning (Orange)**: `#F59E0B`. Used for "Chờ thanh toán", "Chờ xác nhận".
  - **Info (Blue/Brand)**: `#076EFF`. Used for "Đang phục vụ", "Đã phát hành".
  - **Danger (Red)**: `#EF4444`. Used for "Hủy món", "Món hết".

## 2. Typography (Standard: 14px)
- **Font Family**: **Inter** (weights: 400 to 900).
- **Core Font Size**: 
  - Base: `14px` (buttons, inputs, main content).
  - Small: `12px` (badges, secondary labels).
- **Font Weights**:
  - `font-black` (900): Totals, currency, critical headings.
  - `font-bold` (700): Dish names, customer names.
  - `font-normal` (400): Descriptions, notes.

## 3. UI Component Standards
- **UI Component Standards (Buttons & Footers)**:
  - **Height**: Minimum standard `40px` (`h-10`) for all action buttons and interactive elements (Inputs, Selects, Combos) to ensure touch target accuracy on POS systems.
  - **Layout**: All buttons in dialog/drawer/modal footers must be right-aligned using `justify-end` with a spacing of `gap-3` (12px).
  - **Equal Size**: Adjacent buttons in the same footer group must have the same width. Use a minimum width (e.g., `min-w-[120px]`) and consistent horizontal padding of `px-8` (32px).
  - **No Full-Width**: Buttons should not span the full width of the container; they should be compact and pushed to the right.
- **Quantity Selection Dialog (Keypad)**:
  - Width: Fixed `320px` to `350px`.
  - Display Area: Large `text-4xl`, `font-black` (900) value, flanked by large (`h-12 w-12`) circular +/- buttons.
  - Num Pad Grid: 3 columns (`grid-cols-3`) with `gap-px` bg-slate-100 to create thin lines.
  - Key Styling: `bg-white`, `text-xl`, `font-bold`, `active:bg-slate-100`.
  - Function Keys: `C` (Clear) in blue, `Delete` in red.
  - Footer Action: Right-aligned button, `px-8`, `h-10`, `bg-brand`, `font-bold`.

- **Cart Item & Promotion Display**:
  - **Vertical Alignment**: All action buttons (Trash, MoreActions) in the cart must be perfectly vertically aligned. Use a consistent Grid structure for both main item rows and sub-rows (Promotions, Addons).
  - **Promotion Styling**: Promotions must be visually "light". Avoid heavy red borders or backgrounds. Use `bg-slate-50` or very soft red, with italic red text and a small `Tag` icon. Use dashed lines for visual connection to the main item.
  - **Touch Targets**: Every icon button in the cart (Delete, Note, History, Remove Promo) must have a `40x40px` touch target area, even if the icon itself is smaller.

## 4. Spacing & Layout
- **Global Spacing**:
  - **Page Padding**: `12px` (`p-3`).
  - **Component Gaps**: `12px` (`gap-3`) for major sections.
  - **Card/Block Padding**: `16px` (`p-4`) for headers, `10px-12px` (`p-2.5` to `p-3`) for internal content.
  - **Table Cells**: `px-6 py-4` (24px horizontal, 16px vertical).
- **Borders & Layouts**:
  - **Full-Screen Constraint**: The app must fit within `h-screen`, `overflow-hidden`. Only specific areas should scroll.
  - **Order Screen 3-Column Structure**:
    - Sidebar Left: `80px` (`w-20`).
    - Order Details (Center): Fixed width `420px`.
    - Menu Grid (Right): `flex-1`.
  - **Menu Grid**: 5 columns (`grid-cols-5`) with `8px` (`gap-2`) spacing.
  - **Action Bars**: Fixed/sticky at the bottom with specific heights (e.g., `h-24` for large bottom buttons).

## 5. Domain-Specific Logic
- **Order Item Merging**: 
  - **Adding from Menu/Other Item**: 
    - Food items: ALWAYS creates a new line (no auto-merge) to allow for individual customization.
    - Beverages (Alcohol & Bottled drinks): MERGES immediately into an existing identical draft line.
  - **Automatic Merging triggers**: Only if items become identical after customization (same ID, Round 0, identical Addons, and identical Note) or during a "Clone" action that results in an identical draft item.
- **New Item Highlight**: Apply blue highlight + pulse border. Clear automatically after 3 seconds or when a new item is added following it.
- **Beverage Handling**: Alcohol ("Bia & Rượu") and Bottled Drinks ("Đồ uống đóng chai") bypass the immediate customization drawer when added to speed up ordering.
- **Currency**: Always use the `formatCurrency` helper for price display.
- **Menu Badges**: Display a quantity badge on menu items in the grid if they are already in the current order.

## 6. Order Information Dialog ("Thông tin Order")
- **Header**: Title "Thông tin Order" (Font Black 900, size 18px). No sub-titles or descriptions.
- **Dashboard Summary**: 2 cards (Món ăn / Đồ uống) displayed as a **single line** (Icon + Label: + Quantity). 
- **Item List**: 
  - **Layout**: Flat list with a single border separator (`border-b slate-100`) between items. No individual item shadows or borders.
  - **Item Details (2-Line)**: 
    - Line 1: `SL x Tên món` (Left) and `Thành tiền` (Right).
    - Line 2: Customizations/Notes in italic, smaller font.
- **Footer**: Single right-aligned "ĐÓNG" button (h-10, px-8, min-w-[120px], background brand, font-bold). No total group amount labels.
