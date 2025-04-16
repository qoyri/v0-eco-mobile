export const authOptions = {
  // Add authentication providers here
  // Example:
  // providers: [
  //   CredentialsProvider({
  //     name: 'Credentials',
  //     async authorize(credentials, req) {
  //       // Add your authentication logic here
  //       return null
  //     }
  //   })
  // ],
  session: {
    strategy: "jwt" as const, // Explicitly define the type
    maxAge: 60 * 60 * 24, // 24 hours
  },
  secret: process.env.JWT_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      return token
    },
    async session({ session, token }) {
      return session
    },
  },
}
