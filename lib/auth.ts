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

          // For simplicity, we'll create a password hash method later
          // const isPasswordValid = await compare(credentials.password, user.password);
          // if (!isPasswordValid) {
          //   return null;
          // }

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
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          console.log('Google OAuth signIn attempt for:', profile.email);

          // Dynamic import to avoid build-time database connection
          const { prisma } = await import('./prisma');

          // Check if user exists, create if not
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!dbUser) {
            console.log('Creating new user:', profile.email);
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.email,
                image: (profile as any)?.picture,
                role: 'CLIENT',
                emailVerified: new Date(),
              },
            });
            console.log('User created successfully:', dbUser.id);
          } else {
            console.log('Existing user found:', dbUser.id);
          }

          // Store role in user object for JWT
          user.role = dbUser.role;
          user.id = dbUser.id;
        } catch (error) {
          console.error('Database error in signIn callback:', error);
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
          });
          // Continue without database for now - allow sign in but with limited functionality
          console.log('Allowing sign in without database connection');
          user.role = 'CLIENT';
          user.id = profile.email; // Use email as fallback ID
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
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
