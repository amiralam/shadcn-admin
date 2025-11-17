# Component Audit & Categorization

**Date:** November 2024
**Project:** shadcn-admin AI-Ready Component System
**Total Components:** 60 TSX files

## Component Categorization

### ATOMS (Basic Building Blocks - 26 components)
Single-purpose, indivisible UI elements

- ✅ `button.tsx` - Button component with variants
- ✅ `input.tsx` - Text input field
- ✅ `label.tsx` - Form label
- ✅ `badge.tsx` - Status badge
- ✅ `checkbox.tsx` - Checkbox input
- ✅ `switch.tsx` - Toggle switch
- ✅ `radio-group.tsx` - Radio button group
- ✅ `textarea.tsx` - Multi-line text input
- ✅ `separator.tsx` - Visual divider
- ✅ `skeleton.tsx` - Loading placeholder
- ✅ `avatar.tsx` - User avatar image
- ✅ `input-otp.tsx` - OTP input field
- ✅ `alert.tsx` - Alert/notification banner
- ✅ `sonner.tsx` - Toast notification wrapper
- ✅ `scroll-area.tsx` - Scrollable container
- ✅ `collapsible.tsx` - Collapsible container

### MOLECULES (Simple Component Combinations - 15 components)
Combinations of atoms serving a specific purpose

- ✅ `card.tsx` - Card container with header/body/footer
- ✅ `tooltip.tsx` - Tooltip overlay
- ✅ `popover.tsx` - Popover dialog
- ✅ `select.tsx` - Select dropdown
- ✅ `dropdown-menu.tsx` - Dropdown menu
- ✅ `tabs.tsx` - Tabbed interface
- ✅ `form.tsx` - Form wrapper with validation
- ✅ `calendar.tsx` - Date picker calendar
- ✅ `command.tsx` - Command palette
- ✅ `sheet.tsx` - Slide-out panel
- ✅ `select-dropdown.tsx` - Custom select dropdown
- ✅ `confirm-dialog.tsx` - Confirmation dialog
- ✅ `navigation-progress.tsx` - Progress indicator

### ORGANISMS (Complex UI Sections - 19 components)
Complex combinations serving larger purposes

**Layout Components:**
- ✅ `layout/authenticated-layout.tsx` - Main app layout
- ✅ `layout/header.tsx` - App header
- ✅ `layout/app-sidebar.tsx` - Sidebar navigation
- ✅ `layout/nav-group.tsx` - Navigation group
- ✅ `layout/nav-user.tsx` - User navigation menu
- ✅ `layout/team-switcher.tsx` - Team/workspace switcher
- ✅ `layout/top-nav.tsx` - Top navigation bar
- ✅ `layout/main.tsx` - Main content wrapper
- ✅ `layout/app-title.tsx` - App title component
- ✅ `sidebar.tsx` - Sidebar component (UI primitive)

**Data Components:**
- ✅ `data-table/index.ts` - Data table main component
- ✅ `data-table/column-header.tsx` - Sortable column header
- ✅ `data-table/pagination.tsx` - Table pagination
- ✅ `data-table/toolbar.tsx` - Table toolbar
- ✅ `data-table/faceted-filter.tsx` - Multi-select filter
- ✅ `data-table/bulk-actions.tsx` - Bulk action controls
- ✅ `data-table/view-options.tsx` - Column visibility toggle
- ✅ `table.tsx` - Table UI primitive

**Other Organisms:**
- ✅ `command-menu.tsx` - Global command menu
- ✅ `coming-soon.tsx` - Coming soon placeholder

### TEMPLATES (Page-level Layouts)
Currently using `routes/` directory for page templates

### PATTERNS (Common UI Patterns)
To be extracted from existing implementations

## Current File Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui primitives (atoms + molecules)
│   ├── layout/                  # Layout organisms
│   ├── data-table/              # Data table organisms
│   ├── select-dropdown.tsx
│   ├── coming-soon.tsx
│   ├── command-menu.tsx
│   ├── confirm-dialog.tsx
│   └── navigation-progress.tsx
├── lib/
│   └── utils.ts                 # Utility functions (cn helper)
├── hooks/                       # Custom React hooks
├── features/                    # Feature-based organization
└── routes/                      # Page routes

```

## Proposed New Structure

```
src/
├── components/
│   ├── atoms/                   # Basic building blocks
│   │   ├── button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.schema.json
│   │   │   ├── Button.md
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── input/
│   │   ├── label/
│   │   └── ...
│   ├── molecules/               # Simple combinations
│   │   ├── form-field/
│   │   ├── search-bar/
│   │   ├── card/
│   │   └── ...
│   ├── organisms/               # Complex sections
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── data-table/
│   │   └── ...
│   ├── templates/               # Page layouts
│   │   ├── dashboard-layout/
│   │   ├── auth-layout/
│   │   └── ...
│   └── patterns/                # Common UI patterns
│       ├── authentication/
│       ├── data-visualization/
│       └── forms/
├── registry/
│   ├── component-registry.ts    # Central component registry
│   ├── component-registry.json  # Machine-readable registry
│   └── schemas/                 # JSON schemas
├── tokens/
│   ├── colors.ts                # Color tokens
│   ├── spacing.ts               # Spacing tokens
│   ├── typography.ts            # Typography tokens
│   └── index.ts                 # Token exports
├── tools/
│   ├── cli/                     # Component CLI
│   ├── validators/              # Component validators
│   └── generators/              # Schema generators
├── docs/
│   ├── components/              # Component documentation
│   ├── ai-integration.md        # AI integration guide
│   └── design-system.md         # Design system guide
└── lib/
    └── utils.ts                 # Utility functions

```

## Migration Strategy

### Phase 1: Foundation (Current)
1. Create new directory structure
2. Set up design token system
3. Migrate 5 core atoms (Button, Input, Label, Badge, Checkbox)
4. Create component registry
5. Build schema templates
6. Set up testing infrastructure

### Phase 2: Core Migration
1. Migrate remaining atoms
2. Migrate molecules
3. Create organism compositions
4. Build CLI tools

### Phase 3: Advanced Features
1. AI context generation
2. Component validation
3. Documentation portal
4. Example projects

## Dependencies

**Core:**
- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS 4.1.14
- Radix UI (various packages)
- class-variance-authority 0.7.1

**Development:**
- Vite 7.1.11
- ESLint 9.37.0
- Prettier 3.6.2

**Testing (To be added):**
- Jest
- React Testing Library
- Playwright
- @testing-library/jest-dom
- @axe-core/react (accessibility testing)

## Next Steps

1. ✅ Complete component audit
2. 🔄 Create new directory structure
3. ⏳ Extract design tokens
4. ⏳ Create component schema specification
5. ⏳ Set up testing infrastructure
6. ⏳ Migrate first 5 components
7. ⏳ Build component registry
8. ⏳ Create CLI foundation
