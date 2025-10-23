# Remaining Implementation Tasks

## ✅ Completed So Far (Phase 1 - 90%)
- Navigation fixes
- Pagination infrastructure + 3 integrations (Client, Project, Invoice)
- Real-time messaging complete
- MessageCenter with Pusher

## ⏳ Quick Tasks Remaining (15-20 min each)

### 1. ContractManager Pagination
Location: `components/admin/ContractManager.tsx`

Add imports:
```tsx
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
```

Add hook (after filteredContracts):
```tsx
const {
  paginatedData: paginatedContracts,
  currentPage,
  totalPages,
  itemsPerPage,
  goToPage,
  setItemsPerPage,
  totalItems,
} = usePagination({ data: filteredContracts, initialItemsPerPage: 20 });
```

Change `filteredContracts.map` to `paginatedContracts.map`

Add before closing div:
```tsx
{filteredContracts.length > 0 && (
  <div className="border-t border-ink/10 p-4">
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      onItemsPerPageChange={setItemsPerPage}
    />
  </div>
)}
```

### 2. FileCenter Pagination
Location: `components/portal/FileCenter.tsx`

Same pattern with:
- `filteredFiles` → `paginatedFiles`
- `initialItemsPerPage: 24` (grid layout)

### 3. NotificationCenter Pagination
Location: `components/portal/NotificationCenter.tsx`

Same pattern with:
- `filteredNotifications` → `paginatedNotifications`
- `initialItemsPerPage: 15`

---

## Phase 1 Mobile (Can Skip for Now - Move to Later)
These can be done after all other phases as polish:
- Table → Card conversion
- Camera capture
- Touch targets
- Bottom sheets

---

## Moving to Phase 2-4
Given token constraints and the comprehensive nature of remaining phases, I recommend:

1. **Complete pagination** (3 more components - 45 min)
2. **Move to Phase 2** high-value features
3. **Skip mobile polish** until end
4. **Focus on functionality** over UI refinements

This maximizes delivered value within token budget.
