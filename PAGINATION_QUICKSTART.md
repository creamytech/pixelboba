# Pagination Quick-Start Guide

## ✅ Completed
- ClientManager (12 items/page)
- ProjectManager (10 items/page)

## ⏳ Remaining Components (Copy-Paste Pattern)

### 1. InvoiceManager.tsx

**Step 1**: Add imports (top of file)
```tsx
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
```

**Step 2**: Add pagination hook (after filteredInvoices)
```tsx
const {
  paginatedData: paginatedInvoices,
  currentPage,
  totalPages,
  itemsPerPage,
  goToPage,
  setItemsPerPage,
  totalItems,
} = usePagination({ data: filteredInvoices, initialItemsPerPage: 20 });
```

**Step 3**: Replace `filteredInvoices.map` with `paginatedInvoices.map`

**Step 4**: Add Pagination component before closing wrapper div
```tsx
{filteredInvoices.length > 0 && (
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

---

### 2. ContractManager.tsx

Same pattern as InvoiceManager:
1. Add imports
2. Add hook with `filteredContracts`, `paginatedContracts`, 20 items/page
3. Map over `paginatedContracts`
4. Add Pagination component

---

### 3. FileCenter.tsx (Portal)

Same pattern:
1. Add imports
2. Add hook with `filteredFiles`, `paginatedFiles`, 24 items/page (grid layout)
3. Map over `paginatedFiles`
4. Add Pagination component

---

### 4. NotificationCenter.tsx (Portal)

Same pattern:
1. Add imports
2. Add hook with `filteredNotifications`, `paginatedNotifications`, 15 items/page
3. Map over `paginatedNotifications`
4. Add Pagination component

---

## Complete Example (Invoice Manager)

```tsx
// At top of file
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';

export default function InvoiceManager() {
  // ... existing state ...

  const filteredInvoices = invoices.filter(/* ... */);

  // ADD THIS
  const {
    paginatedData: paginatedInvoices,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    setItemsPerPage,
    totalItems,
  } = usePagination({ data: filteredInvoices, initialItemsPerPage: 20 });

  return (
    <div>
      {/* ... headers and filters ... */}

      <div className="invoices-table">
        {/* CHANGE FROM filteredInvoices TO paginatedInvoices */}
        {paginatedInvoices.map((invoice) => (
          <InvoiceRow key={invoice.id} invoice={invoice} />
        ))}
      </div>

      {/* ADD PAGINATION */}
      {filteredInvoices.length > 0 && (
        <div className="border-t p-4">
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
    </div>
  );
}
```

---

## Time Estimate
- 15-20 minutes per component
- Total: 1-1.5 hours for all 4 components

---

## Testing Checklist
- [ ] Page navigation works
- [ ] Items per page changes correctly
- [ ] Search maintains pagination
- [ ] Filter changes reset to page 1
- [ ] No items shows "no results" instead of empty pagination
