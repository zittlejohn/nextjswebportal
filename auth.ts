import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';
import axios from 'axios';
import https from 'https';

/**
 * ----------------------------------------------------------------------------------
 * 1️⃣  Providers
 * ----------------------------------------------------------------------------------
 */
const providers: Provider[] = [
  // GitHub({
  //   clientId: process.env.GITHUB_CLIENT_ID as string,
  //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  // }),
  // Google({
  //   clientId: process.env.GOOGLE_CLIENT_ID as string,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  // }),
  Credentials({
    credentials: {
      email: { label: 'Email Address', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;

      const params: WebLoginParams = {
        email: credentials.email,
        password: credentials.password,
      };

      // Allow self‑signed certs locally only
      const isDev = process.env.NODE_ENV !== 'production';
      const httpsAgent = isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined;

      try {
        const { data } = await axios.post<WebLoginResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/weblogin`,
          params,
          { httpsAgent },
        );

        if (!data?.user) return null; // backend rejected login

        return {
          id: data.user.id ?? '',
          name: data.user.displayName ?? '',
          email: data.user.email ?? '',
          client: data.user.client ?? '',
          accessToken: data.accessToken ?? '',
        };
      } catch (err) {
        console.error('[auth] login error', err);
        return null;
      }
    },
  }),
];

/**
 * ----------------------------------------------------------------------------------
 * 2️⃣  Provider map (optional helper for UI)
 * ----------------------------------------------------------------------------------
 */
export const providerMap = providers.map((p) => {
  if (typeof p === 'function') {
    const data = p();
    return { id: data.id, name: data.name };
  }
  return { id: p.id, name: p.name };
});

/**
 * ----------------------------------------------------------------------------------
 * 3️⃣  NextAuth configuration
 * ----------------------------------------------------------------------------------
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    /** Route protection (unchanged) */
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isPublic = nextUrl.pathname.startsWith('/public');
      return isPublic || isLoggedIn;
    },

    /** Store token in JWT on sign‑in */
    async jwt({ token, user }) {
      if (user && 'accessToken' in user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },

    /** Expose token to the client session */
    async session({ session, token }) {
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});

/* ---------------------------------------------------------------------------
 * 4️⃣ Types shared with backend
 * ------------------------------------------------------------------------- */

/** Shape of the body you’re sending */
interface WebLoginParams {
  email: string | null | unknown;
  password: string | null | unknown;
}

/** User summary returned after login / token refresh */
export interface UserDto {
  id?: string | null;
  displayName?: string | null;
  email?: string | null;
  client?: string | null;
}

/** Response your website returns from /api/login */
export interface WebLoginResponse {
  user?: UserDto | null;
  accessToken?: string | null;
}

/** Generic JWT response (re‑auth, refresh, etc.) */
export interface AuthenticationResponse {
  token?: string | null;
  /** Expiration as ISO‑8601 string; convert to Date on the client if needed */
  expiration: string;
}
