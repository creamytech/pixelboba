# Pomegranate Design System - Transformation Patterns

## Core Principles
1. **Bold Borders**: 3-5px borders on all interactive elements
2. **Hard Shadows**: No blur, solid offset shadows (e.g., `shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]`)
3. **Vibrant Colors**: Use Tailwind boba tea palette (taro, matcha, thai-tea, etc.)
4. **Black Typography**: font-black for headings, font-bold for body
5. **Uppercase Labels**: All small labels/badges in uppercase

## Pattern Replacements

### Cards
**Old:**
```tsx
className="bg-white/70 backdrop-blur-sm border-2 border-brown-sugar/10 rounded-3xl shadow-sm hover:shadow-xl"
```

**New:**
```tsx
className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
```

### Buttons
**Old:**
```tsx
className="px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80"
```

**New:**
```tsx
className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase"
```

### Status Badges
**Old:**
```tsx
className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
```

**New:**
```tsx
className="px-3 py-1.5 bg-matcha text-ink font-black text-xs rounded-full border-2 border-ink uppercase"
```

### Icon Circles
**Old:**
```tsx
className="w-10 h-10 bg-gradient-to-br from-taro to-purple-500 rounded-xl flex items-center justify-center"
```

**New:**
```tsx
className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center"
```

### Progress Bars
**Old:**
```tsx
<div className="h-2 bg-brown-sugar/10 rounded-full">
  <div className="h-full bg-green-500 rounded-full" style={{width: '75%'}} />
</div>
```

**New:**
```tsx
<div className="h-3 bg-cream rounded-full border-2 border-ink overflow-hidden">
  <div className="h-full bg-matcha" style={{width: '75%'}} />
</div>
```

### Input Fields
**Old:**
```tsx
className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:ring-2 focus:ring-taro/20"
```

**New:**
```tsx
className="w-full px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
```

### Tables
**Old:**
```tsx
<thead className="bg-milk-tea/20 border-b border-ink/10">
```

**New:**
```tsx
<div className="rounded-xl border-4 border-ink overflow-hidden">
  <thead className="bg-gradient-to-r from-milk-tea to-cream border-b-4 border-ink">
    <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
  </thead>
  <tbody className="bg-white">
    <tr className="border-b-2 border-ink/10 hover:bg-cream/30">
      <td className="px-4 py-4 font-bold text-ink">
</div>
```

## Files to Update (35 remaining)

### Admin Components (15 files)
- app/admin/AdminDashboardClient.tsx
- components/admin/ClientManager.tsx
- components/admin/ProjectManager.tsx
- components/admin/ContractManager.tsx
- components/admin/InvoiceManager.tsx
- components/admin/AnalyticsDashboard.tsx
- components/admin/AdminSettings.tsx
- components/admin/AdminMessageCenter.tsx
- components/admin/ClientProfileView.tsx
- components/admin/InviteManager.tsx
- components/layout/Sidebar.tsx
- components/layout/PortalLayout.tsx (if used by admin)
- components/kanban/ProjectTaskBoard.tsx
- components/kanban/TaskCard.tsx
- components/kanban/TaskModal.tsx

### Portal Components (15 files)
- app/portal/ClientPortalClient.tsx
- components/portal/ContractCenter.tsx
- components/portal/InvoiceCenter.tsx
- components/portal/MessageCenter.tsx
- components/portal/FileCenter.tsx
- components/portal/NotificationCenter.tsx
- components/portal/MilestoneTracker.tsx
- components/portal/NotificationPreferences.tsx
- components/portal/BobaProgressIndicator.tsx
- components/portal/WebsitePreview.tsx
- components/portal/OnboardingTour.tsx
- components/layout/PortalSidebar.tsx
- components/layout/PortalLayout.tsx

### Common Components (5 files)
- components/common/Pagination.tsx
- components/common/OnlineStatusIndicator.tsx
- components/kanban/ListView.tsx

## Color Mapping

**Status Colors:**
- Success/On Track: `bg-matcha` (green)
- Warning/At Risk: `bg-thai-tea` (orange)
- Error/Delayed: `bg-strawberry` (pink/red)
- Info/Default: `bg-taro` (purple)
- Neutral: `bg-cream` or `bg-milk-tea`

**Gradient Combos:**
- Primary: `from-taro to-deep-taro`
- Success: `from-matcha to-matcha/80`
- Warning: `from-thai-tea to-thai-tea/80`
- Error: `from-strawberry to-strawberry/80`
- Accent: `from-[#FDB97A] to-thai-tea`
