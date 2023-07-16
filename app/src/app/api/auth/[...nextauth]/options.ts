import type { NextAuthOptions } from "next-auth";
// import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase, verifyPassword } from "@/app/lib/mongodbConnection";

export const options: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    CredentialsProvider({
      name: "Credentials",
      // credentials: {
      //   email: {
      //     label: 'Email',
      //     type: 'text',
      //     placeholder: 'enter your email',
      //   },
      //   password: {
      //     label: 'Password',
      //     type: 'password',
      //     placeholder: 'enter your password',
      //   },
      // },
      async authorize(credentials) {
        const client = await connectToDatabase();
        const userCollection = client.db().collection("user");
        const user = await userCollection.findOne({
          email: credentials?.email,
        });
        if (!user) {
          client.close();
          throw new Error("user not found");
        }
        const isValid = await verifyPassword(
          credentials?.password!,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("could not login because of wrong password");
        }
        client.close();
        return user;
      },
    }),
  ],
  // debug:process.env.NODE_ENV==='development',
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET
};
