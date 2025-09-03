import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'Pixel Boba';
    const description = searchParams.get('description') || 'Websites that Pop';

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            position: 'relative',
          }}
        >
          {/* Pearl decorations */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '15%',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '20%',
              right: '20%',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(132, 204, 22, 0.7)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '10%',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(139, 94, 60, 0.6)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '25%',
              right: '15%',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(245, 233, 218, 0.8)',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '800px',
              padding: '0 40px',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
                lineHeight: '1.1',
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '0',
                lineHeight: '1.3',
              }}
            >
              {description}
            </p>
          </div>

          {/* Logo/Brand at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            Pixel Boba
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#84CC16',
                marginLeft: '8px',
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`Failed to generate OG image: ${e.message}`);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}
