import { prisma } from './prisma';

export interface AdminSettings {
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

const defaultSettings: AdminSettings = {
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
};

export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const settings = await prisma.adminSettings.findMany();

    // Start with default settings
    const settingsObject: any = JSON.parse(JSON.stringify(defaultSettings));

    // Override with saved settings
    settings.forEach((setting) => {
      const keys = setting.key.split('.');
      let current = settingsObject;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = setting.value;
    });

    return settingsObject as AdminSettings;
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return defaultSettings;
  }
}

export async function getSettingValue(key: string): Promise<any> {
  try {
    const setting = await prisma.adminSettings.findUnique({
      where: { key },
    });

    if (setting) {
      return setting.value;
    }

    // Return default value if setting not found
    const keys = key.split('.');
    let current: any = defaultSettings;

    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        return null;
      }
    }

    return current;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}
