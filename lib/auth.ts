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

          // Dynamic import to avoid build-time database connection
          const { prisma } = await import('./prisma');

          // Check if user exists
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!dbUser) {
            // User doesn't exist, check for valid invite
            const inviteToken =
              (req as any)?.query?.invite ||
              (typeof window !== 'undefined' ? localStorage.getItem('inviteToken') : null);

            if (!inviteToken) {
              console.log('No invite token provided for new Google user:', profile.email);
              return false; // Reject sign-in
            }

            // Validate invite
            const invite = await prisma.invite.findUnique({
              where: { token: inviteToken },
            });

            if (
              !invite ||
              invite.usedAt ||
              invite.expiresAt < new Date() ||
              invite.email !== profile.email
            ) {
              console.log('Invalid invite for Google user:', profile.email);
              return false; // Reject sign-in
            }

            // Create user with invite validation
            console.log('Creating new user with invite:', profile.email);
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.email,
                image: (profile as any)?.picture,
                role: invite.role,
                emailVerified: new Date(),
              },
            });

            // Mark invite as used
            await prisma.invite.update({
              where: { id: invite.id },
              data: {
                usedAt: new Date(),
                usedById: dbUser.id,
              },
            });

            console.log('User created successfully with invite:', dbUser.id);
          } else {
            console.log('Existing user found:', dbUser.id);
          }

          // Store role in user object for JWT
          user.role = dbUser.role;
          user.id = dbUser.id;
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
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'CLIENT' | 'ADMIN' | 'OWNER';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If redirecting after signup/signin, redirect based on role
      if (url.startsWith('/') || url === baseUrl) {
        return baseUrl;
      }
      // Default redirect to appropriate dashboard
      return url;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
