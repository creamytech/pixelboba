'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, CreditCard, Calendar, DollarSign, Clock, Check, X } from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types/portal';

const statusConfig: Record<InvoiceStatus, { color: string; bg: string; label: string; icon: any }> =
  {
    DRAFT: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'draft', icon: Clock },
    SENT: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'sent', icon: Calendar },
    PAID: { color: 'text-green-600', bg: 'bg-green-100', label: 'paid', icon: Check },
    OVERDUE: { color: 'text-red-600', bg: 'bg-red-100', label: 'overdue', icon: Clock },
    CANCELLED: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'cancelled', icon: Clock },
  };

export default function InvoiceCenter() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/portal/invoices');
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

  const handlePayInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch('/api/portal/invoices/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url; // Redirect to Stripe checkout
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/portal/invoices/${invoiceId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const filteredInvoices =
    filterStatus === 'ALL' ? invoices : invoices.filter((inv) => inv.status === filterStatus);

  const totalAmount = invoices
    .filter((inv) => inv.status !== 'CANCELLED')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const paidAmount = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingAmount = invoices
    .filter((inv) => ['SENT', 'OVERDUE'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 p-8">
        <div className="flex items-center justify-center">
          <div className="text-ink/50">loading invoices...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <SummaryCard title="total invoiced" amount={totalAmount} icon={DollarSign} color="taro" />
        <SummaryCard title="paid" amount={paidAmount} icon={Check} color="green-500" />
        <SummaryCard title="pending" amount={pendingAmount} icon={Clock} color="orange-500" />
      </div>

      {/* Invoice List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-ink/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold text-ink">invoices</h3>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | 'ALL')}
              className="px-3 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink focus:outline-none focus:ring-2 focus:ring-taro/20"
            >
              <option value="ALL">all statuses</option>
              <option value="SENT">sent</option>
              <option value="PAID">paid</option>
              <option value="OVERDUE">overdue</option>
              <option value="CANCELLED">cancelled</option>
            </select>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center text-ink/50">no invoices found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-milk-tea/20">
                <tr>
                  <th className="text-left p-4 font-medium text-ink">invoice</th>
                  <th className="text-left p-4 font-medium text-ink">project</th>
                  <th className="text-left p-4 font-medium text-ink">amount</th>
                  <th className="text-left p-4 font-medium text-ink">due date</th>
                  <th className="text-left p-4 font-medium text-ink">status</th>
                  <th className="text-left p-4 font-medium text-ink">actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredInvoices.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      onPay={() => handlePayInvoice(invoice.id)}
                      onDownload={() => downloadInvoice(invoice.id)}
                      onView={() => setSelectedInvoice(invoice)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceDetailModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            onPay={() => handlePayInvoice(selectedInvoice.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({
  title,
  amount,
  icon: Icon,
  color,
}: {
  title: string;
  amount: number;
  icon: any;
  color: string;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ink/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-ink">${amount.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </div>
  );
}

function InvoiceRow({
  invoice,
  onPay,
  onDownload,
  onView,
}: {
  invoice: Invoice;
  onPay: () => void;
  onDownload: () => void;
  onView: () => void;
}) {
  const config = statusConfig[invoice.status];
  const StatusIcon = config.icon;

  const isOverdue = invoice.status === 'SENT' && new Date(invoice.dueDate) < new Date();
  const actualStatus = isOverdue ? 'OVERDUE' : invoice.status;
  const actualConfig = statusConfig[actualStatus];
  const ActualStatusIcon = actualConfig.icon;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-ink/5 hover:bg-milk-tea/10 transition-colors"
    >
      <td className="p-4">
        <div>
          <div className="font-medium text-ink">{invoice.number}</div>
          <div className="text-sm text-ink/60">{invoice.title}</div>
        </div>
      </td>
      <td className="p-4">
        <div className="text-ink">{invoice.project?.name || 'General'}</div>
      </td>
      <td className="p-4">
        <div className="font-medium text-ink">${invoice.totalAmount.toLocaleString()}</div>
      </td>
      <td className="p-4">
        <div className="text-ink">{new Date(invoice.dueDate).toLocaleDateString()}</div>
      </td>
      <td className="p-4">
        <span
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${actualConfig.color} ${actualConfig.bg}`}
        >
          <ActualStatusIcon size={12} />
          <span>{actualConfig.label}</span>
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="p-1 text-ink/60 hover:text-ink transition-colors"
            title="View Invoice"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onDownload}
            className="p-1 text-ink/60 hover:text-ink transition-colors"
            title="Download PDF"
          >
            <Download size={16} />
          </button>
          {['SENT', 'OVERDUE'].includes(actualStatus) && (
            <button
              onClick={onPay}
              className="px-3 py-1 bg-taro text-white text-xs rounded-lg hover:bg-taro/80 transition-colors"
            >
              pay now
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

function InvoiceDetailModal({
  invoice,
  onClose,
  onPay,
}: {
  invoice: Invoice;
  onClose: () => void;
  onPay: () => void;
}) {
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
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-ink">{invoice.number}</h2>
            <button onClick={onClose} className="text-ink/60 hover:text-ink">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-ink mb-2">{invoice.title}</h3>
              {invoice.description && <p className="text-ink/70">{invoice.description}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-ink/60">Issue Date:</span>
                <span className="ml-2 text-ink">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-ink/60">Due Date:</span>
                <span className="ml-2 text-ink">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h4 className="font-medium text-ink mb-3">Items</h4>
              <div className="border border-ink/10 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-milk-tea/20">
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-left p-3">Qty</th>
                      <th className="text-left p-3">Rate</th>
                      <th className="text-left p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-ink/5 last:border-b-0">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">${item.rate}</td>
                        <td className="p-3">${item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-ink/10 pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/60">Subtotal:</span>
                    <span className="text-ink">${invoice.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Tax:</span>
                    <span className="text-ink">${invoice.taxAmount}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-ink">Total:</span>
                    <span className="text-ink">${invoice.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {['SENT', 'OVERDUE'].includes(invoice.status) && (
              <div className="flex justify-end">
                <button
                  onClick={onPay}
                  className="flex items-center space-x-2 px-6 py-3 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors"
                >
                  <CreditCard size={18} />
                  <span>pay ${invoice.totalAmount}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
