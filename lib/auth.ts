import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Dynamic import to avoid build-time database connection
          const { prisma } = await import('./prisma');

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          // Verify password if user has one (manual signup)
          if (user.password) {
            const isPasswordValid = await compare(credentials.password, user.password);
            if (!isPasswordValid) {
              return null;
            }
          } else {
            // No password set - probably OAuth user trying credentials login
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Error finding user:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile, ...req }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          console.log('Google OAuth signIn attempt for:', profile.email);
          console.log('Full req object keys:', Object.keys(req));

          // Dynamic import to avoid build-time database connection
          const { prisma } = await import('./prisma');

          // Check if user exists
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!dbUser) {
            console.log('User does not exist in database, checking invites...');

            // Find any pending invite for this email (don't rely on token in URL)
            const invite = await prisma.invite.findFirst({
              where: {
                email: profile.email,
                usedAt: null,
                expiresAt: {
                  gt: new Date(),
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            });

            let userRole: 'CLIENT' | 'ADMIN' | 'OWNER' = 'CLIENT'; // default

            if (invite) {
              console.log('Found valid invite for user:', invite.role);
              userRole = invite.role;
            } else {
              console.log('No valid invite found, using default CLIENT role');
            }

            // Create user
            console.log('Creating new user with role:', userRole);
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.email,
                image: (profile as any)?.picture,
                role: userRole,
                emailVerified: new Date(),
              },
            });

            // Mark invite as used if it exists
            if (invite) {
              await prisma.invite.update({
                where: { id: invite.id },
                data: {
                  usedAt: new Date(),
                  usedById: dbUser.id,
                },
              });
              console.log('Invite marked as used');
            }

            console.log('User created successfully:', dbUser.id);
          } else {
            console.log('Existing user found:', dbUser.id, 'Role:', dbUser.role);
          }

          // Store role in user object for JWT
          user.role = dbUser.role;
          user.id = dbUser.id;

          console.log('SignIn successful for user:', user.id, 'with role:', user.role);
        } catch (error) {
          console.error('Database error in signIn callback:', error);

          // Safe error details extraction
          const errorDetails =
            error instanceof Error
              ? {
                  message: error.message,
                  name: error.name,
                  stack: error.stack,
                  code: (error as any).code,
                }
              : { message: String(error) };

          console.error('Error details:', errorDetails);

          // Don't allow sign in on database error for security
          console.log('Rejecting sign in due to database error');
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - adding user data to token:', user.id, user.role);
        token.role = user.role;
        token.id = user.id;
      }
      console.log('JWT callback - token:', { id: token.id, role: token.role, email: token.email });
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log('Session callback - token data:', { id: token.id, role: token.role });
        session.user.id = token.id as string;
        session.user.role = token.role as 'CLIENT' | 'ADMIN' | 'OWNER';
      }
      console.log('Session callback - final session:', {
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
      });
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If it's a relative URL, use the baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      // If it's the same domain
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Default fallback - redirect to portal for now
      // The role-based redirection will happen in the signIn callback
      return `${baseUrl}/portal`;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
