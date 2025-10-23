import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";
import { getAccountsByUserId, getUserbyId } from "@/features/auth/actions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user || !account) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });
      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            accounts: {
              create: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token ?? null,
                refresh_token: account.refresh_token ?? null,
                expires_at: account.expires_at
                  ? Math.floor(account.expires_at)
                  : null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
                session_state: account.session_state
                  ? String(account.session_state)
                  : null,
              },
            },
          },
        });
        if (!newUser) return false;
        
      } else {
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });
        if (!existingAccount) {
          await prisma.account.create({
            data: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: JSON.stringify(account.session_state),
              userId: existingUser.id, // Link to existing user
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (!token.sub) return token;
      const existingUser = await getUserbyId(token.sub);

      if (!existingUser) return token;

      const exisitingAccount = await getAccountsByUserId(existingUser.id);

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },
    async session({ session, token }) {
      // Attach the user ID from the token to the session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.sub && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
