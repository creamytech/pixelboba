'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, CreditCard, FileText, Bell, Shield, Database } from 'lucide-react';

interface Settings {
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
  };
  email: {
    provider: string;
    apiKey: string;
    fromName: string;
    fromEmail: string;
  };
  payments: {
    stripePublishableKey: string;
    stripeSecretKey: string;
    currency: string;
    taxRate: number;
  };
  notifications: {
    enableEmail: boolean;
    enableSMS: boolean;
    projectUpdates: boolean;
    invoiceReminders: boolean;
    contractNotifications: boolean;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    company: {
      name: 'pixel boba',
      email: 'hello@pixelboba.com',
      phone: '',
      address: '',
      logo: '',
    },
    email: {
      provider: 'resend',
      apiKey: '',
      fromName: 'pixel boba',
      fromEmail: 'noreply@pixelboba.com',
    },
    payments: {
      stripePublishableKey: '',
      stripeSecretKey: '',
      currency: 'USD',
      taxRate: 0,
    },
    notifications: {
      enableEmail: true,
      enableSMS: false,
      projectUpdates: true,
      invoiceReminders: true,
      contractNotifications: true,
    },
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'company', name: 'company', icon: Shield },
    { id: 'email', name: 'email', icon: Mail },
    { id: 'payments', name: 'payments', icon: CreditCard },
    { id: 'notifications', name: 'notifications', icon: Bell },
    { id: 'contracts', name: 'contracts', icon: FileText },
    { id: 'database', name: 'database', icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanySettings settings={settings} setSettings={setSettings} />;
      case 'email':
        return <EmailSettings settings={settings} setSettings={setSettings} />;
      case 'payments':
        return <PaymentSettings settings={settings} setSettings={setSettings} />;
      case 'notifications':
        return <NotificationSettings settings={settings} setSettings={setSettings} />;
      case 'contracts':
        return <ContractSettings />;
      case 'database':
        return <DatabaseSettings />;
      default:
        return <CompanySettings settings={settings} setSettings={setSettings} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">admin settings</h2>
            <p className="text-ink/60 mt-1">configure system settings and preferences</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'saving...' : 'save changes'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-taro text-white'
                      : 'text-ink/70 hover:text-ink hover:bg-milk-tea/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CompanySettings({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (s: Settings) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink">company information</h3>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">company name</label>
          <input
            type="text"
            value={settings.company.name}
            onChange={(e) =>
              setSettings({
                ...settings,
                company: { ...settings.company, name: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">email address</label>
          <input
            type="email"
            value={settings.company.email}
            onChange={(e) =>
              setSettings({
                ...settings,
                company: { ...settings.company, email: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">phone number</label>
          <input
            type="tel"
            value={settings.company.phone}
            onChange={(e) =>
              setSettings({
                ...settings,
                company: { ...settings.company, phone: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">address</label>
        <textarea
          value={settings.company.address}
          onChange={(e) =>
            setSettings({
              ...settings,
              company: { ...settings.company, address: e.target.value },
            })
          }
          rows={3}
          className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
        />
      </div>
    </div>
  );
}

function EmailSettings({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (s: Settings) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink">email configuration</h3>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">from name</label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) =>
              setSettings({
                ...settings,
                email: { ...settings.email, fromName: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">from email</label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) =>
              setSettings({
                ...settings,
                email: { ...settings.email, fromEmail: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">resend api key</label>
        <input
          type="password"
          value={settings.email.apiKey}
          onChange={(e) =>
            setSettings({
              ...settings,
              email: { ...settings.email, apiKey: e.target.value },
            })
          }
          placeholder="re_your_resend_api_key_here"
          className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
        />
      </div>
    </div>
  );
}

function PaymentSettings({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (s: Settings) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink">payment configuration</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">stripe publishable key</label>
          <input
            type="text"
            value={settings.payments.stripePublishableKey}
            onChange={(e) =>
              setSettings({
                ...settings,
                payments: { ...settings.payments, stripePublishableKey: e.target.value },
              })
            }
            placeholder="pk_test_your_publishable_key_here"
            className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">stripe secret key</label>
          <input
            type="password"
            value={settings.payments.stripeSecretKey}
            onChange={(e) =>
              setSettings({
                ...settings,
                payments: { ...settings.payments, stripeSecretKey: e.target.value },
              })
            }
            placeholder="sk_test_your_secret_key_here"
            className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">currency</label>
            <select
              value={settings.payments.currency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payments: { ...settings.payments, currency: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">tax rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={settings.payments.taxRate}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payments: { ...settings.payments, taxRate: parseFloat(e.target.value) },
                })
              }
              className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (s: Settings) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink">notification preferences</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-milk-tea/10 rounded-lg">
          <div>
            <div className="font-medium text-ink">email notifications</div>
            <div className="text-sm text-ink/60">send notifications via email</div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.enableEmail}
            onChange={(e) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, enableEmail: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-milk-tea/10 rounded-lg">
          <div>
            <div className="font-medium text-ink">project update notifications</div>
            <div className="text-sm text-ink/60">notify clients when projects are updated</div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.projectUpdates}
            onChange={(e) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, projectUpdates: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-milk-tea/10 rounded-lg">
          <div>
            <div className="font-medium text-ink">invoice reminders</div>
            <div className="text-sm text-ink/60">send reminders for overdue invoices</div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.invoiceReminders}
            onChange={(e) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, invoiceReminders: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-milk-tea/10 rounded-lg">
          <div>
            <div className="font-medium text-ink">contract notifications</div>
            <div className="text-sm text-ink/60">notify when contracts are signed or expire</div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.contractNotifications}
            onChange={(e) =>
              setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  contractNotifications: e.target.checked,
                },
              })
            }
            className="w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
}

function ContractSettings() {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink">contract templates</h3>

      <div className="p-8 text-center text-ink/50 border border-dashed border-ink/20 rounded-lg">
        <FileText className="w-12 h-12 mx-auto mb-4 text-ink/30" />
        <p>contract template management coming soon</p>
      </div>
    </div>
  );
}

function DatabaseSettings() {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink">database management</h3>

      <div className="p-8 text-center text-ink/50 border border-dashed border-ink/20 rounded-lg">
        <Database className="w-12 h-12 mx-auto mb-4 text-ink/30" />
        <p>database backup and migration tools coming soon</p>
      </div>
    </div>
  );
}
