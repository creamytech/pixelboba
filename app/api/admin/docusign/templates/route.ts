import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DocuSignService } from '@/lib/docusign';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const templates = await DocuSignService.getTemplates();

    return NextResponse.json({
      templates,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching DocuSign templates:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch templates',
        templates: [],
      },
      { status: 500 }
    );
  }
}
