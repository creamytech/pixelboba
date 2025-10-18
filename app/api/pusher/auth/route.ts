import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.text();
  const params = new URLSearchParams(body);
  const socketId = params.get('socket_id');
  const channel = params.get('channel_name');

  if (!socketId || !channel) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Authorize presence channels
  if (channel.startsWith('presence-')) {
    const presenceData = {
      user_id: session.user.id || session.user.email,
      user_info: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);
    return NextResponse.json(authResponse);
  }

  // Authorize private channels
  const authResponse = pusherServer.authorizeChannel(socketId, channel);
  return NextResponse.json(authResponse);
}
