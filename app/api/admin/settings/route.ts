import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      const settings = await prisma.adminSettings.findMany();

      // Transform settings array into object
      const settingsObject: any = {
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

      return NextResponse.json({ settings: settingsObject });
    } catch (dbError) {
      console.error('Database error fetching settings:', dbError);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in admin settings API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await request.json();

    try {
      const { prisma } = await import('@/lib/prisma');

      // Flatten settings object into key-value pairs
      const flattenSettings = (obj: any, prefix = ''): Array<{ key: string; value: any }> => {
        const result: Array<{ key: string; value: any }> = [];

        Object.keys(obj).forEach((key) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          const value = obj[key];

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            result.push(...flattenSettings(value, fullKey));
          } else {
            result.push({ key: fullKey, value });
          }
        });

        return result;
      };

      const flatSettings = flattenSettings(settings);

      // Save each setting
      for (const { key, value } of flatSettings) {
        await prisma.adminSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database error saving settings:', dbError);
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in save settings API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
