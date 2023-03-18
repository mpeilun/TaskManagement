import NextAuth from 'next-auth'
import { JWT as NextAuthJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface JWT extends NextAuthJWT {
    id?: string
    accessToken?: string
  }
  interface Session {
    accessToken?: string
    user: {
      id?: string
      name?: string
      email?: string
      image?: string
    }
  }
}

// declare module 'next-auth/jwt' {
//   interface JWT {
//     accessToken?: string
//   }
// }

//reference https://stackoverflow.com/questions/74168539/next-auth-provide-types-for-callback-functions-parameters
