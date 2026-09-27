import 'server-only';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],
  pages: { signIn: '/write', error: '/write' },
  callbacks: {
    signIn({ user }) {
      return Boolean(
        process.env.WRITER_GITHUB_ID && user.id === process.env.WRITER_GITHUB_ID
      );
    },
    session({ session, token }) {
      return {
        ...session,
        user:
          process.env.WRITER_GITHUB_ID &&
          token.sub === process.env.WRITER_GITHUB_ID
            ? session.user
            : undefined,
      };
    },
  },
} satisfies NextAuthOptions;

export async function writerSession() {
  if (!process.env.NEXTAUTH_SECRET || !process.env.WRITER_GITHUB_ID)
    return null;
  const session = await getServerSession(authOptions);
  return session?.user ? session : null;
}
