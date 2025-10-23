import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'CLIENT' | 'ADMIN' | 'OWNER' | 'TEAM_MEMBER' | 'TEAM_ADMIN';
      image?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'CLIENT' | 'ADMIN' | 'OWNER' | 'TEAM_MEMBER' | 'TEAM_ADMIN';
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
  }
}
