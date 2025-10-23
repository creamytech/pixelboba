'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, CreditCard, Calendar, DollarSign, Clock, Check, X } from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types/portal';

const statusConfig: Record<InvoiceStatus, { color: string; bg: string; label: string; icon: any }> =
  {
    DRAFT: { color: 'text-ink', bg: 'bg-cream', label: 'DRAFT', icon: Clock },
    SENT: { color: 'text-ink', bg: 'bg-taro', label: 'SENT', icon: Calendar },
    PAID: { color: 'text-ink', bg: 'bg-matcha', label: 'PAID', icon: Check },
    OVERDUE: { color: 'text-ink', bg: 'bg-strawberry', label: 'OVERDUE', icon: Clock },
    CANCELLED: { color: 'text-ink', bg: 'bg-cream', label: 'CANCELLED', icon: Clock },
  };

export default function InvoiceCenter() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

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
      setPaymentLoading(invoiceId);
      setError('');

      const response = await fetch('/api/portal/invoices/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe checkout
        } else {
          setError('Payment session created but no URL received');
        }
      } else {
        setError(data.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('Network error: Unable to connect to payment service');
    } finally {
      setPaymentLoading(null);
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
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-8">
        <div className="flex items-center justify-center">
          <div className="text-ink/50 font-bold uppercase">loading invoices...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-strawberry border-3 border-ink rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
          <div className="flex items-center">
            <X className="w-5 h-5 text-ink mr-2" />
            <span className="text-ink text-sm font-bold">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-ink hover:text-ink/70">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <SummaryCard title="total invoiced" amount={totalAmount} icon={DollarSign} color="taro" />
        <SummaryCard title="paid" amount={paidAmount} icon={Check} color="green-500" />
        <SummaryCard title="pending" amount={pendingAmount} icon={Clock} color="orange-500" />
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b-4 border-ink">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-black text-ink uppercase">invoices</h3>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | 'ALL')}
              className="px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20 uppercase"
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
            <div className="p-12 text-center text-ink/50 font-bold">no invoices found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-milk-tea to-cream border-b-4 border-ink">
                <tr>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    invoice
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    project
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    amount
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    due date
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    status
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    actions
                  </th>
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
                      paymentLoading={paymentLoading === invoice.id}
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
  const bgColor =
    color === 'taro'
      ? 'from-taro to-deep-taro'
      : color === 'green-500'
        ? 'from-matcha to-matcha'
        : 'from-thai-tea to-thai-tea';

  return (
    <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ink/60 text-sm font-bold uppercase">{title}</p>
          <p className="text-2xl font-black text-ink">${amount.toLocaleString()}</p>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
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
  paymentLoading = false,
}: {
  invoice: Invoice;
  onPay: () => void;
  onDownload: () => void;
  onView: () => void;
  paymentLoading?: boolean;
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
      className="border-b-2 border-ink/10 hover:bg-cream/30 transition-colors bg-white"
    >
      <td className="px-4 py-4 font-bold text-ink">
        <div>
          <div className="font-black text-ink">{invoice.number}</div>
          <div className="text-sm text-ink/60 font-bold">{invoice.title}</div>
        </div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="text-ink">{invoice.project?.name || 'General'}</div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="font-black text-ink">${invoice.totalAmount.toLocaleString()}</div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="text-ink">{new Date(invoice.dueDate).toLocaleDateString()}</div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <span
          className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-black rounded-full border-2 border-ink uppercase ${actualConfig.color} ${actualConfig.bg}`}
        >
          <ActualStatusIcon size={12} />
          <span>{actualConfig.label}</span>
        </span>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
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
              disabled={paymentLoading}
              className="px-4 py-2 bg-matcha text-ink text-xs font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              {paymentLoading ? (
                <>
                  <div className="w-3 h-3 border border-ink border-t-transparent rounded-full animate-spin"></div>
                  <span>processing...</span>
                </>
              ) : (
                <span>pay now</span>
              )}
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-black text-ink uppercase">
              {invoice.number}
            </h2>
            <button onClick={onClose} className="text-ink/60 hover:text-ink">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-black text-ink mb-2 uppercase">{invoice.title}</h3>
              {invoice.description && (
                <p className="text-ink/70 font-bold">{invoice.description}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-ink/60 font-bold uppercase">Issue Date:</span>
                <span className="ml-2 text-ink font-bold">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-ink/60 font-bold uppercase">Due Date:</span>
                <span className="ml-2 text-ink font-bold">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h4 className="font-black text-ink mb-3 uppercase">Items</h4>
              <div className="rounded-xl border-4 border-ink overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-milk-tea to-cream border-b-4 border-ink">
                    <tr>
                      <th className="text-left p-3 font-black text-ink uppercase">Description</th>
                      <th className="text-left p-3 font-black text-ink uppercase">Qty</th>
                      <th className="text-left p-3 font-black text-ink uppercase">Rate</th>
                      <th className="text-left p-3 font-black text-ink uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className="border-b-2 border-ink/10 last:border-b-0">
                        <td className="p-3 font-bold text-ink">{item.description}</td>
                        <td className="p-3 font-bold text-ink">{item.quantity}</td>
                        <td className="p-3 font-bold text-ink">${item.rate}</td>
                        <td className="p-3 font-bold text-ink">${item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t-4 border-ink pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/60 font-bold uppercase">Subtotal:</span>
                    <span className="text-ink font-bold">${invoice.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60 font-bold uppercase">Tax:</span>
                    <span className="text-ink font-bold">${invoice.taxAmount}</span>
                  </div>
                  <div className="flex justify-between font-black text-lg">
                    <span className="text-ink uppercase">Total:</span>
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
                  className="flex items-center space-x-2 px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all"
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
