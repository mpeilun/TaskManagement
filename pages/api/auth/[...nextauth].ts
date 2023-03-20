import NextAuth, { Account, JWT, Profile, Session, User } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
import GithubProvider from 'next-auth/providers/github'

const REPO = process.env.GITHUB_REPO

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: { scope: `repo` },
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  // secret: process.env.SECRET,
  callbacks: {
    async jwt(params: {
      token: JWT
      user?: User | AdapterUser | undefined
      account?: Account | null | undefined
      profile?: Profile | undefined
      isNewUser?: boolean | undefined
    }): Promise<JWT> {
      const { token, user, account } = params
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session(params: {
      session: Session
      user: User | AdapterUser
      token: JWT
    }): Promise<Session> {
      const { session, user, token } = params
      session.user.id = token.id
      session.accessToken = token.accessToken
      return session
    },
  },
}
export default NextAuth(authOptions)
