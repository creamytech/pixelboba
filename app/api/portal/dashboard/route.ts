import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Portal dashboard API called for user:', session.user.email);

    // For now, return mock data since we're focusing on getting OAuth working
    // This will be replaced with real database queries once the database is properly connected
    const mockPortalData = {
      user: {
        id: session.user.id || session.user.email,
        name: session.user.name || 'User',
        email: session.user.email,
        role: session.user.role || 'CLIENT',
        createdAt: new Date(),
      },
      projects: [
        {
          id: 'mock-project-1',
          name: 'Website Redesign',
          description: 'Modern, responsive website with improved UX',
          status: 'DEVELOPMENT',
          progress: 75,
          startDate: new Date('2024-01-15'),
          deadline: new Date('2024-03-15'),
          client: {
            id: session.user.id || session.user.email,
            name: session.user.name || 'User',
            email: session.user.email,
            role: session.user.role || 'CLIENT',
            createdAt: new Date(),
          },
          milestones: [
            {
              id: 'milestone-1',
              title: 'Wireframes Complete',
              description: 'All wireframes approved',
              completedAt: new Date('2024-02-01'),
              projectId: 'mock-project-1',
            },
            {
              id: 'milestone-2',
              title: 'Design Phase',
              description: 'Visual designs and mockups',
              dueDate: new Date('2024-02-15'),
              projectId: 'mock-project-1',
            },
          ],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date(),
        },
      ],
      unreadMessages: 2,
      pendingInvoices: 1,
      pendingContracts: 0,
    };

    console.log('Returning mock portal data for:', session.user.email);
    return NextResponse.json(mockPortalData);
  } catch (error) {
    console.error('Error in portal dashboard API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
