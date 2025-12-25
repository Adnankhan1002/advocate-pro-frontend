# Advocate Pro - Design System

## Overview

Advocate Pro features a modern, premium, and professional design system tailored for legal-tech SaaS platforms. The design emphasizes trust, clarity, and efficiency while maintaining a sophisticated aesthetic inspired by industry leaders like Stripe, Linear, Vercel, and Notion.

---

## 🎨 Color Palette

### Primary Colors
- **Deep Navy/Slate**: `#0F172A` (slate-900)
  - Used for primary buttons, sidebar, and key UI elements
  - Conveys trust, professionalism, and authority

### Secondary Colors
- **Cool Gray/Slate**: Various slate tones (100-700)
  - Used for text, borders, and backgrounds
  - Creates visual hierarchy without distraction

### Accent Colors
- **Muted Gold**: `#E6B84A` (amber-400 to amber-600)
  - Used sparingly for highlights and branding
  - Suggests prestige and premium quality
  
- **Emerald**: `#10B981` (emerald-500)
  - Alternative accent for success states
  - Clean and professional

### Backgrounds
- **Off-White**: `#F8FAFC` (slate-50)
  - Primary background color
  - Soft and easy on the eyes
  
- **Pure White**: `#FFFFFF`
  - Card backgrounds
  - Creates depth through layering

### Status Colors
- **Success**: Emerald green
- **Warning**: Amber
- **Error**: Red
- **Info**: Blue

---

## 📐 Typography

### Font Family
- **Primary**: Inter (loaded via Google Fonts)
- **Fallback**: System sans-serif fonts

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings

### Type Scale
```css
h1: 2.5rem / 3rem (40px / 48px) - Page titles
h2: 2rem / 2.5rem (32px / 40px) - Section headers
h3: 1.5rem / 2rem (24px / 32px) - Card titles
h4: 1.25rem / 1.5rem (20px / 24px) - Subsections
h5: 1.125rem / 1.25rem (18px / 20px)
h6: 1rem / 1.125rem (16px / 18px)
body: 0.875rem / 1rem (14px / 16px)
small: 0.75rem / 0.875rem (12px / 14px)
```

### Text Colors
- Primary: `slate-900`
- Secondary: `slate-600`
- Muted: `slate-500`
- Disabled: `slate-400`

---

## 🧱 Layout Structure

### Global Layout

#### Navigation Bar (Top)
- **Height**: 64px (4rem)
- **Background**: White with backdrop blur (glass effect)
- **Border**: Bottom border in slate-200
- **Position**: Sticky top
- **Contains**:
  - Search bar (center-left)
  - Notification bell
  - User profile dropdown

#### Sidebar (Left)
- **Width**: 288px (18rem)
- **Background**: Deep slate-900 (dark navy)
- **Contains**:
  - Logo with brand icon (Scale icon + Advocate Pro)
  - Navigation menu with icons
  - User profile at bottom
- **Mobile**: Overlay with backdrop blur

#### Main Content Area
- **Max Width**: 1600px
- **Padding**: 1.5rem to 2rem
- **Background**: Gradient from slate-50 via white to slate-50

---

## 🎯 Component Design Principles

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Common Spacing**:
  - xs: 8px
  - sm: 12px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - 2xl: 48px

### Border Radius
- **Small**: 0.5rem (8px) - Buttons, badges
- **Medium**: 0.75rem (12px) - Inputs
- **Large**: 1rem (16px) - Cards, modals
- **XL**: 1.5rem (24px) - Large cards
- **2XL**: 2rem (32px) - Featured sections

### Shadows
```css
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
```

---

## 📦 Core Components

### Button
**Variants**:
- `default`: Slate-900 background, white text
- `outline`: White background, slate border
- `ghost`: Transparent, hover background
- `destructive`: Red background

**Sizes**:
- `sm`: h-9, px-3
- `default`: h-10, px-5
- `lg`: h-12, px-8
- `icon`: h-10, w-10

**Features**:
- Rounded corners (xl)
- Active state scale animation
- Smooth transitions

### Card
- Rounded corners: 2xl (32px)
- Border: 1px slate-200
- Shadow: Soft shadow on hover
- Background: Pure white
- Padding: 1.5rem (24px)

### Input
- Height: 40px (10)
- Border: 2px slate-200
- Rounded: xl (24px)
- Focus: Ring with slate-900
- Padding: 0 1rem

### Badge
- Border: 2px
- Padding: 0.25rem 0.75rem
- Rounded: Full
- Font: Semibold, xs

---

## 🎭 Page-Specific Design

### Dashboard
**Layout**: 
- KPI cards in 4-column grid
- Main content: 2/3 for hearings, 1/3 for quick stats
- Card-based sections with gradient accents

**KPI Cards**:
- Gradient icon backgrounds
- Large numbers (4xl font)
- Trend indicators with icons
- Hover effect: Subtle lift

### Cases Page
**Layout**:
- Search and filter bar at top
- Toggle between grid and list view
- Card-based case display (3-column grid)

**Case Cards**:
- Status indicator bar at top
- Case number with briefcase icon
- Client name with user icon
- Status and priority badges
- Hover: Shadow and translate effect

### Auth Pages (Login/Signup)
**Layout**:
- Centered card on gradient dark background
- Logo with brand icon above card
- Decorative gradient orbs in background

**Card Design**:
- Max width: 28rem (448px)
- White background with slight transparency
- Input fields with icons
- Large, prominent CTA button

---

## ✨ Animations & Micro-interactions

### Page Transitions
```javascript
// Fade and slide up
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4 }
```

### List Items
- Staggered children with 30-50ms delay
- Fade in with slight Y-axis movement

### Interactive Elements
- **Buttons**: Active state scale (0.98)
- **Cards**: Hover lift and shadow increase
- **Links**: Smooth color transition
- **Icons**: Subtle scale or translate on hover

### Navigation
- Active indicator with layoutId for smooth transitions
- Sidebar items fade in sequentially on mount

---

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile Adaptations
- Sidebar becomes overlay
- Navigation bar shows menu icon
- Grid layouts collapse to single column
- Reduced padding and font sizes
- Hide secondary information

---

## ♿ Accessibility

### Standards
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Focus visible states
- Semantic HTML
- ARIA labels where needed

### Focus States
- 2px ring in slate-900
- High contrast visible focus

### Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear hover/focus states

---

## 🎨 Design Tokens (CSS Variables)

Located in `globals.css`:

```css
--primary: 222 47% 11%
--background: 210 20% 98%
--foreground: 222 47% 11%
--accent: 45 76% 60%
--border: 214 32% 91%
--radius-xl: 1.5rem
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

---

## 🚀 Usage Examples

### Creating a New Page
```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
  <div className="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-8">
    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
      Page Title
    </h1>
    {/* Content */}
  </div>
</div>
```

### Creating a KPI Card
```tsx
<Card className="border-0 shadow-lg hover:shadow-xl transition-all">
  <CardContent className="p-6">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-4xl font-bold text-slate-900">{value}</h3>
  </CardContent>
</Card>
```

---

## 📚 Additional Resources

- **Figma Design Files**: (To be added)
- **Component Storybook**: (To be added)
- **Brand Guidelines**: (To be added)

---

## 🔄 Version History

- **v1.0.0** (December 2025) - Initial design system implementation
  - Premium design overhaul
  - New color palette
  - Modern component library
  - Responsive layouts
  - Animation system

---

**Designed with ❤️ for legal professionals**
