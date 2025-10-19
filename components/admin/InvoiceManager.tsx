'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Send, DollarSign, Download } from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types/portal';
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
import BulkActionBar, { useBulkSelection } from '@/components/common/BulkActionBar';

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Use pagination hook
  const {
    paginatedData: paginatedInvoices,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    setItemsPerPage,
    totalItems,
  } = usePagination({ data: filteredInvoices, initialItemsPerPage: 20 });

  // Use bulk selection hook
  const {
    selectedIds,
    selectedCount,
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  } = useBulkSelection(filteredInvoices);

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingAmount = invoices
    .filter((inv) => ['SENT', 'OVERDUE'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const statusOptions: (InvoiceStatus | 'ALL')[] = [
    'ALL',
    'DRAFT',
    'SENT',
    'PAID',
    'OVERDUE',
    'CANCELLED',
  ];

  // Bulk actions handlers
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCount} invoice(s)?`)) return;

    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/admin/invoices/${id}`, { method: 'DELETE' })
        )
      );
      clearSelection();
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoices:', error);
      alert('Failed to delete some invoices');
    }
  };

  const handleBulkExport = () => {
    const csvContent = [
      ['Invoice #', 'Client', 'Amount', 'Due Date', 'Status'],
      ...selectedItems.map((inv) => [
        inv.number,
        inv.client.name || inv.client.email,
        inv.totalAmount.toString(),
        new Date(inv.dueDate).toLocaleDateString(),
        inv.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkSend = async () => {
    const draftInvoices = selectedItems.filter((inv) => inv.status === 'DRAFT');
    if (draftInvoices.length === 0) {
      alert('No draft invoices selected');
      return;
    }

    if (!confirm(`Are you sure you want to send ${draftInvoices.length} invoice(s)?`)) return;

    try {
      await Promise.all(
        draftInvoices.map((inv) =>
          fetch(`/api/admin/invoices/${inv.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'send' }),
          })
        )
      );
      clearSelection();
      fetchInvoices();
      alert(`Successfully sent ${draftInvoices.length} invoice(s)`);
    } catch (error) {
      console.error('Error sending invoices:', error);
      alert('Failed to send some invoices');
    }
  };

  const bulkActions = [
    {
      id: 'send',
      label: 'Send',
      icon: <Send className="w-4 h-4" />,
      onClick: handleBulkSend,
      disabled: !selectedItems.some((inv) => inv.status === 'DRAFT'),
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      onClick: handleBulkExport,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleBulkDelete,
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">invoice management</h2>
            <p className="text-ink/60 mt-1">create and track client invoices</p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors"
          >
            <Plus size={18} />
            <span>new invoice</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">total revenue</p>
              <p className="text-2xl font-bold text-ink">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500/60" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">pending amount</p>
              <p className="text-2xl font-bold text-ink">${pendingAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-500/60" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">total invoices</p>
              <p className="text-2xl font-bold text-ink">{invoices.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-taro/60" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-taro/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'ALL')}
            className="px-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink focus:outline-none focus:ring-2 focus:ring-taro/20"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'all statuses' : status.toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink/50">loading invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-ink/50">no invoices found</div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-milk-tea/20">
                <tr>
                  <th className="text-left p-4 font-medium text-ink w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedCount === filteredInvoices.length && filteredInvoices.length > 0
                      }
                      onChange={(e) => (e.target.checked ? selectAll() : clearSelection())}
                      className="w-4 h-4 text-taro bg-white border-ink/20 rounded focus:ring-taro/20"
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-ink">invoice #</th>
                  <th className="text-left p-4 font-medium text-ink">client</th>
                  <th className="text-left p-4 font-medium text-ink">amount</th>
                  <th className="text-left p-4 font-medium text-ink">due date</th>
                  <th className="text-left p-4 font-medium text-ink">status</th>
                  <th className="text-left p-4 font-medium text-ink">actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedInvoices.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      onUpdate={fetchInvoices}
                      isSelected={isSelected(invoice.id)}
                      onToggleSelect={() => toggleSelection(invoice.id)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Pagination */}
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
          </>
        )}
      </div>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <CreateInvoiceModal
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              fetchInvoices();
            }}
          />
        )}
      </AnimatePresence>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedCount}
        totalCount={filteredInvoices.length}
        actions={bulkActions}
        onClear={clearSelection}
        onSelectAll={selectAll}
      />
    </div>
  );
}

function InvoiceRow({
  invoice,
  onUpdate,
  isSelected,
  onToggleSelect,
}: {
  invoice: Invoice;
  onUpdate: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const sendInvoice = async () => {
    if (!confirm('Are you sure you want to send this invoice?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send' }),
      });

      if (response.ok) {
        const result = await response.json();
        onUpdate();
        alert(`Invoice sent successfully! Stripe URL: ${result.stripeInvoiceUrl}`);
      } else {
        const errorData = await response.json();
        console.error('Invoice send error:', errorData);
        alert(`Failed to send invoice: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (status: InvoiceStatus) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-700',
      SENT: 'bg-blue-100 text-blue-700',
      PAID: 'bg-green-100 text-green-700',
      OVERDUE: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700',
    };
    return colors[status];
  };

  const isOverdue = invoice.status === 'SENT' && new Date(invoice.dueDate) < new Date();
  const displayStatus = isOverdue ? 'OVERDUE' : invoice.status;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-ink/5 hover:bg-milk-tea/10 transition-colors"
    >
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 text-taro bg-white border-ink/20 rounded focus:ring-taro/20"
        />
      </td>
      <td className="p-4">
        <div className="font-medium text-ink">{invoice.number}</div>
        <div className="text-sm text-ink/60">{invoice.title}</div>
      </td>
      <td className="p-4">
        <div className="text-ink">{invoice.client.name}</div>
      </td>
      <td className="p-4">
        <div className="font-medium text-ink">${invoice.totalAmount.toLocaleString()}</div>
      </td>
      <td className="p-4">
        <div className="text-ink">{new Date(invoice.dueDate).toLocaleDateString()}</div>
      </td>
      <td className="p-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(displayStatus as InvoiceStatus)}`}
        >
          {displayStatus.toLowerCase()}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="p-1 text-ink/60 hover:text-ink disabled:opacity-50"
            disabled={loading}
          >
            <Edit size={16} />
          </button>
          {invoice.status === 'DRAFT' && (
            <button
              onClick={sendInvoice}
              className="p-1 text-ink/60 hover:text-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              <Send size={16} />
            </button>
          )}
          <button
            onClick={deleteInvoice}
            className="p-1 text-ink/60 hover:text-red-500 disabled:opacity-50"
            disabled={loading}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

function CreateInvoiceModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    projectId: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    notes: '',
  });
  const [items, setItems] = useState([
    { description: '', quantity: 1, rate: 0, stripeProductId: '', stripePriceId: '' },
  ]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stripeProducts, setStripeProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchClients();
    fetchProjects();
    fetchStripeProducts();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchStripeProducts = async () => {
    try {
      const response = await fetch('/api/admin/stripe/products');
      if (response.ok) {
        const data = await response.json();
        setStripeProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching Stripe products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 1, rate: 0, stripeProductId: '', stripePriceId: '' },
    ]);
  };

  const selectStripeProduct = (index: number, productId: string, priceId: string) => {
    const product = stripeProducts.find((p) => p.id === productId);
    const price = product?.prices.find((p: any) => p.id === priceId);

    if (product && price) {
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        description: product.name + (product.description ? ` - ${product.description}` : ''),
        rate: (price.unitAmount || 0) / 100, // Convert from cents to dollars
        stripeProductId: productId,
        stripePriceId: priceId,
      };
      setItems(updatedItems);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.filter((item) => item.description.trim()),
          projectId: formData.projectId || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="font-display text-2xl font-bold text-ink mb-6">create new invoice</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">invoice title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                  placeholder="Website Development Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">client</label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                >
                  <option value="">select client...</option>
                  {clients.map((client: any) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  project (optional)
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                >
                  <option value="">no project</option>
                  {projects.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">due date</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-ink">invoice items</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center space-x-1 text-sm text-taro hover:text-taro/80"
                >
                  <Plus size={16} />
                  <span>add item</span>
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="p-3 bg-milk-tea/10 rounded-lg space-y-2">
                    {/* Stripe Product Selector */}
                    {!loadingProducts && stripeProducts.length > 0 && (
                      <div className="pb-2 border-b border-brown-sugar/10">
                        <label className="text-xs font-medium text-ink/60 mb-1 block">
                          or select from stripe products
                        </label>
                        <select
                          value={item.stripePriceId}
                          onChange={(e) => {
                            const priceId = e.target.value;
                            if (priceId) {
                              const product = stripeProducts.find((p) =>
                                p.prices.some((price: any) => price.id === priceId)
                              );
                              if (product) {
                                selectStripeProduct(index, product.id, priceId);
                              }
                            }
                          }}
                          className="w-full px-2 py-1 text-sm bg-milk-tea/50 border border-brown-sugar/20 rounded focus:outline-none focus:ring-1 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                        >
                          <option value="">-- select stripe product --</option>
                          {stripeProducts.map((product) =>
                            product.prices.map((price: any) => (
                              <option key={price.id} value={price.id}>
                                {product.name} - ${(price.unitAmount / 100).toFixed(2)}
                                {price.recurring ? ` / ${price.recurring.interval}` : ''}
                                {product.description ? ` (${product.description})` : ''}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    )}

                    {/* Manual Entry Fields */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 text-sm bg-milk-tea/50 border border-brown-sugar/20 rounded focus:outline-none focus:ring-1 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm bg-milk-tea/50 border border-brown-sugar/20 rounded focus:outline-none focus:ring-1 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Rate"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 text-sm bg-milk-tea/50 border border-brown-sugar/20 rounded focus:outline-none focus:ring-1 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-taro/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-ink">Total Amount:</span>
                  <span className="text-xl font-bold text-taro">
                    ${calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-ink mb-2">notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
              placeholder="Payment terms, additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-ink/70 hover:text-ink transition-colors"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors disabled:opacity-50"
            >
              {loading ? 'creating...' : 'create invoice'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
