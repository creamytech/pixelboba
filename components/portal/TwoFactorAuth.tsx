'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Shield, Check, X, Copy, Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function TwoFactorAuth() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [setupData, setSetupData] = useState<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disableToken, setDisableToken] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/portal/dashboard');
      if (response.ok) {
        const data = await response.json();
        setIsEnabled(data.user?.twoFactorEnabled || false);
      }
    } catch (error) {
      console.error('Failed to fetch 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Setup failed');
      }

      const data = await response.json();
      setSetupData(data);
      setShowSetup(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      setError('');
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Verification failed');
      }

      setIsEnabled(true);
      setShowSetup(false);
      setVerificationToken('');
      setSetupData(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable = async () => {
    try {
      setVerifying(true);
      setError('');
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: disableToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to disable');
      }

      setIsEnabled(false);
      setShowDisableConfirm(false);
      setDisableToken('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to disable');
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-taro animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-black text-2xl uppercase text-ink mb-2 flex items-center gap-3">
          <Shield className="w-7 h-7 text-taro" strokeWidth={2.5} />
          Two-Factor Authentication
        </h2>
        <p className="text-ink/60 font-bold">Add an extra layer of security to your account</p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`w-12 h-12 rounded-full border-3 border-ink flex items-center justify-center ${
                isEnabled ? 'bg-matcha' : 'bg-ink/10'
              }`}
            >
              {isEnabled ? (
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              ) : (
                <Shield className="w-6 h-6 text-ink/60" strokeWidth={2.5} />
              )}
            </div>
            <div>
              <h3 className="font-black text-lg uppercase text-ink mb-1">
                {isEnabled ? '2FA Enabled' : '2FA Disabled'}
              </h3>
              <p className="text-sm text-ink/60 font-bold">
                {isEnabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Protect your account by enabling two-factor authentication'}
              </p>
            </div>
          </div>

          <button
            onClick={() => (isEnabled ? setShowDisableConfirm(true) : handleSetup())}
            disabled={loading}
            className={`px-6 py-3 rounded-full border-3 border-ink font-black uppercase transition-all ${
              isEnabled
                ? 'bg-strawberry/20 hover:bg-strawberry/30 text-strawberry'
                : 'bg-matcha hover:bg-matcha/90 text-white shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isEnabled ? (
              'Disable'
            ) : (
              'Enable 2FA'
            )}
          </button>
        </div>
      </div>

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetup && setupData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xl uppercase text-ink">Setup 2FA</h3>
                <button
                  onClick={() => {
                    setShowSetup(false);
                    setError('');
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-ink hover:bg-ink/5 transition-colors"
                >
                  <X className="w-5 h-5 text-ink" strokeWidth={2.5} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Step 1: Scan QR Code */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-taro rounded-full border-2 border-ink flex items-center justify-center text-white text-xs font-black">
                      1
                    </div>
                    <h4 className="font-black uppercase text-ink">Scan QR Code</h4>
                  </div>
                  <p className="text-sm text-ink/60 font-bold mb-4">
                    Use Google Authenticator, Authy, or similar app
                  </p>
                  <div className="bg-white p-4 rounded-lg border-3 border-ink flex justify-center">
                    <img src={setupData.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="bg-cream/50 rounded-lg border-2 border-ink/20 p-4">
                  <p className="text-xs text-ink/60 font-bold uppercase mb-2">
                    Can&apos;t scan? Enter manually:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white rounded-lg border-2 border-ink font-mono text-sm text-ink break-all">
                      {setupData.secret}
                    </code>
                    <button
                      onClick={() => copyToClipboard(setupData.secret)}
                      className="p-2 rounded-lg border-2 border-ink hover:bg-ink/5 transition-colors"
                    >
                      {copiedCode === setupData.secret ? (
                        <Check className="w-5 h-5 text-matcha" />
                      ) : (
                        <Copy className="w-5 h-5 text-ink" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 2: Backup Codes */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-taro rounded-full border-2 border-ink flex items-center justify-center text-white text-xs font-black">
                      2
                    </div>
                    <h4 className="font-black uppercase text-ink">Save Backup Codes</h4>
                  </div>
                  <div className="bg-strawberry/10 rounded-lg border-2 border-strawberry/40 p-4 mb-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-strawberry flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-strawberry font-bold">
                        Save these codes in a secure place. You&apos;ll need them if you lose access
                        to your authenticator.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {setupData.backupCodes.map((code) => (
                      <div
                        key={code}
                        className="flex items-center justify-between gap-2 px-3 py-2 bg-white rounded-lg border-2 border-ink"
                      >
                        <code className="font-mono text-sm text-ink">{code}</code>
                        <button
                          onClick={() => copyToClipboard(code)}
                          className="p-1 rounded hover:bg-ink/5 transition-colors"
                        >
                          {copiedCode === code ? (
                            <Check className="w-4 h-4 text-matcha" />
                          ) : (
                            <Copy className="w-4 h-4 text-ink/60" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3: Verify */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-taro rounded-full border-2 border-ink flex items-center justify-center text-white text-xs font-black">
                      3
                    </div>
                    <h4 className="font-black uppercase text-ink">Verify Setup</h4>
                  </div>
                  <p className="text-sm text-ink/60 font-bold mb-3">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  <input
                    type="text"
                    value={verificationToken}
                    onChange={(e) =>
                      setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-white border-3 border-ink rounded-xl font-mono text-center text-2xl font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro/40 transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-strawberry/10 rounded-lg border-2 border-strawberry/40 p-3">
                    <p className="text-sm text-strawberry font-bold">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={verificationToken.length !== 6 || verifying}
                  className="w-full py-3 bg-matcha hover:bg-matcha/90 disabled:bg-ink/20 disabled:text-ink/40 text-white font-black uppercase rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Enable 2FA'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable Confirm Modal */}
      <AnimatePresence>
        {showDisableConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xl uppercase text-ink">Disable 2FA</h3>
                <button
                  onClick={() => {
                    setShowDisableConfirm(false);
                    setError('');
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-ink hover:bg-ink/5 transition-colors"
                >
                  <X className="w-5 h-5 text-ink" strokeWidth={2.5} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-strawberry/10 rounded-lg border-2 border-strawberry/40 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-strawberry flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-strawberry font-bold">
                      Your account will be less secure without 2FA protection.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-ink/70 mb-2">
                    Enter 6-digit code to confirm
                  </label>
                  <input
                    type="text"
                    value={disableToken}
                    onChange={(e) => setDisableToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-white border-3 border-ink rounded-xl font-mono text-center text-2xl font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro/40 transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-strawberry/10 rounded-lg border-2 border-strawberry/40 p-3">
                    <p className="text-sm text-strawberry font-bold">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDisableConfirm(false);
                      setDisableToken('');
                      setError('');
                    }}
                    className="flex-1 py-3 bg-white hover:bg-ink/5 text-ink font-black uppercase rounded-xl border-3 border-ink transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDisable}
                    disabled={disableToken.length !== 6 || verifying}
                    className="flex-1 py-3 bg-strawberry hover:bg-strawberry/90 disabled:bg-ink/20 disabled:text-ink/40 text-white font-black uppercase rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Disabling...
                      </>
                    ) : (
                      'Disable'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
