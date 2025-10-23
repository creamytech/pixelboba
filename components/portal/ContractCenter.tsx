'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, FileCheck, Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { Contract, ContractStatus } from '@/types/portal';

const statusConfig: Record<
  ContractStatus,
  { color: string; bg: string; label: string; icon: any }
> = {
  DRAFT: { color: 'text-ink', bg: 'bg-cream', label: 'DRAFT', icon: Clock },
  SENT: {
    color: 'text-ink',
    bg: 'bg-thai-tea',
    label: 'AWAITING SIGNATURE',
    icon: AlertCircle,
  },
  SIGNED: { color: 'text-ink', bg: 'bg-matcha', label: 'SIGNED', icon: CheckCircle2 },
  EXPIRED: { color: 'text-ink', bg: 'bg-strawberry', label: 'EXPIRED', icon: AlertCircle },
  CANCELLED: { color: 'text-ink', bg: 'bg-cream', label: 'CANCELLED', icon: X },
};

export default function ContractCenter() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/portal/contracts');
      if (response.ok) {
        const data = await response.json();
        setContracts(data.contracts);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadContract = async (contractId: string) => {
    try {
      const response = await fetch(`/api/portal/contracts/${contractId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract-${contractId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading contract:', error);
    }
  };

  const signContract = async (contractId: string, signature: string) => {
    setSigning(true);
    try {
      const response = await fetch('/api/portal/contracts/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, signature }),
      });

      if (response.ok) {
        setShowSigningModal(false);
        setSelectedContract(null);
        fetchContracts();
      }
    } catch (error) {
      console.error('Error signing contract:', error);
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-8">
        <div className="flex items-center justify-center">
          <div className="text-ink/50 font-bold uppercase">loading contracts...</div>
        </div>
      </div>
    );
  }

  const pendingContracts = contracts.filter((c) => c.status === 'SENT');
  const signedContracts = contracts.filter((c) => c.status === 'SIGNED');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-bold uppercase">total contracts</p>
              <p className="text-2xl font-black text-ink">{contracts.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-bold uppercase">pending signature</p>
              <p className="text-2xl font-black text-ink">{pendingContracts.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-thai-tea to-thai-tea rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-bold uppercase">signed</p>
              <p className="text-2xl font-black text-ink">{signedContracts.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-matcha to-matcha rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Contracts */}
      {pendingContracts.length > 0 && (
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
          <div className="p-6 border-b-4 border-ink bg-gradient-to-r from-thai-tea to-thai-tea">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-ink" />
              <h3 className="font-display text-lg font-black text-ink uppercase">
                contracts awaiting your signature
              </h3>
            </div>
          </div>

          <div className="divide-y divide-ink/5">
            {pendingContracts.map((contract) => (
              <ContractRow
                key={contract.id}
                contract={contract}
                onView={() => setSelectedContract(contract)}
                onDownload={() => downloadContract(contract.id)}
                onSign={() => {
                  setSelectedContract(contract);
                  setShowSigningModal(true);
                }}
                priority
              />
            ))}
          </div>
        </div>
      )}

      {/* All Contracts */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
        <div className="p-6 border-b-4 border-ink">
          <h3 className="font-display text-xl font-black text-ink uppercase">all contracts</h3>
        </div>

        <div className="overflow-x-auto">
          {contracts.length === 0 ? (
            <div className="p-12 text-center text-ink/50 font-bold">no contracts found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-milk-tea to-cream border-b-4 border-ink">
                <tr>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    contract
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    project
                  </th>
                  <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                    sent date
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
                  {contracts.map((contract) => (
                    <ContractRow
                      key={contract.id}
                      contract={contract}
                      onView={() => setSelectedContract(contract)}
                      onDownload={() => downloadContract(contract.id)}
                      onSign={
                        contract.status === 'SENT'
                          ? () => {
                              setSelectedContract(contract);
                              setShowSigningModal(true);
                            }
                          : undefined
                      }
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {selectedContract && !showSigningModal && (
          <ContractDetailModal
            contract={selectedContract}
            onClose={() => setSelectedContract(null)}
            onSign={
              selectedContract.status === 'SENT' ? () => setShowSigningModal(true) : undefined
            }
          />
        )}
      </AnimatePresence>

      {/* Digital Signing Modal */}
      <AnimatePresence>
        {showSigningModal && selectedContract && (
          <SigningModal
            contract={selectedContract}
            onClose={() => {
              setShowSigningModal(false);
              setSelectedContract(null);
            }}
            onSign={(signature) => signContract(selectedContract.id, signature)}
            loading={signing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ContractRow({
  contract,
  onView,
  onDownload,
  onSign,
  priority = false,
}: {
  contract: Contract;
  onView: () => void;
  onDownload: () => void;
  onSign?: () => void;
  priority?: boolean;
}) {
  const config = statusConfig[contract.status];
  const StatusIcon = config.icon;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border-b-2 border-ink/10 hover:bg-cream/30 transition-colors ${
        priority ? 'bg-thai-tea/20' : 'bg-white'
      }`}
    >
      <td className="px-4 py-4 font-bold text-ink">
        <div>
          <div className="font-black text-ink">{contract.title}</div>
          <div className="text-sm text-ink/60 line-clamp-1 font-bold">
            {contract.content.substring(0, 100)}...
          </div>
        </div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="text-ink">{contract.project?.name || 'General'}</div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="text-ink">
          {contract.sentAt ? new Date(contract.sentAt).toLocaleDateString() : 'Not sent'}
        </div>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <span
          className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-black rounded-full border-2 border-ink uppercase ${config.color} ${config.bg}`}
        >
          <StatusIcon size={12} />
          <span>{config.label}</span>
        </span>
      </td>
      <td className="px-4 py-4 font-bold text-ink">
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="p-1 text-ink/60 hover:text-ink transition-colors"
            title="View Contract"
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
          {onSign && (
            <button
              onClick={onSign}
              className="px-4 py-2 bg-matcha text-ink text-xs font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all"
            >
              sign now
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

function ContractDetailModal({
  contract,
  onClose,
  onSign,
}: {
  contract: Contract;
  onClose: () => void;
  onSign?: () => void;
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
        className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b-4 border-ink">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-black text-ink uppercase">
              {contract.title}
            </h2>
            <button onClick={onClose} className="text-ink/60 hover:text-ink">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: contract.content.replace(/\n/g, '<br />') }}
              className="text-ink leading-relaxed font-bold"
            />
          </div>
        </div>

        {onSign && (
          <div className="p-6 border-t-4 border-ink bg-cream">
            <div className="flex justify-end">
              <button
                onClick={onSign}
                className="flex items-center space-x-2 px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all"
              >
                <FileCheck size={18} />
                <span>sign contract</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function SigningModal({
  contract,
  onClose,
  onSign,
  loading,
}: {
  contract: Contract;
  onClose: () => void;
  onSign: (signature: string) => void;
  loading: boolean;
}) {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [agreed, setAgreed] = useState(false);

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSign = () => {
    if (!agreed) return;

    const signature = signatureRef.current?.toDataURL();
    if (signature) {
      onSign(signature);
    }
  };

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
        className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-black text-ink uppercase">
              digital signature
            </h2>
            <button onClick={onClose} className="text-ink/60 hover:text-ink">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-black text-ink mb-2 uppercase">{contract.title}</h3>
              <p className="text-sm text-ink/70 font-bold">
                by signing below, you agree to the terms and conditions of this contract.
              </p>
            </div>

            {/* Signature Pad */}
            <div>
              <label className="block text-sm font-black text-ink mb-2 uppercase">
                your signature
              </label>
              <div className="border-3 border-dashed border-ink rounded-lg p-4">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-canvas w-full h-full border rounded',
                  }}
                  backgroundColor="rgba(255,255,255,1)"
                />
              </div>
              <button
                onClick={clearSignature}
                className="mt-2 text-sm text-ink/60 hover:text-ink font-bold uppercase"
              >
                clear signature
              </button>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="agreement" className="text-sm text-ink/70 leading-relaxed font-bold">
                I have read, understood, and agree to the terms and conditions outlined in this
                contract. By providing my digital signature, I acknowledge that this signature is
                legally binding and equivalent to my handwritten signature.
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="bg-white text-ink font-black rounded-full border-3 border-ink uppercase px-4 py-2 hover:bg-cream transition-colors"
              >
                cancel
              </button>
              <button
                onClick={handleSign}
                disabled={!agreed || loading}
                className="flex items-center space-x-2 px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                ) : (
                  <FileCheck size={18} />
                )}
                <span>{loading ? 'signing...' : 'sign contract'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
