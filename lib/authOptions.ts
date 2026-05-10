
import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

/* ---------------------------------------------------------
   MODULE AUGMENTATION
--------------------------------------------------------- */
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "user" | "hotelier" | "monasteryAdmin";
    };
  }

  interface User {
    id: string;
    role: "user" | "hotelier" | "monasteryAdmin";
    email: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "hotelier" | "monasteryAdmin";
    email?: string | null;
    name?: string | null;
  }
}

/* ---------------------------------------------------------
   NEXTAUTH CONFIG
--------------------------------------------------------- */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub, // temporary — replaced later with DB _id
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        };
      },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.type,
        } as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    /* ------------------------------------------------------------------
       signIn — ONLY responsible to ensure Google user exists in DB
    ------------------------------------------------------------------ */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          await User.create({
            email: user.email!,
            username: user.name!,
            password: "",
            type: "user",
          });
        }
      }

      return true;
    },

    /* ------------------------------------------------------------------
       JWT — attach MongoDB _id, NOT Google id
    ------------------------------------------------------------------ */
    async jwt({ token, user, account }) {
      // When Google login happens:
      if (account?.provider === "google") {
        await dbConnect();

        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.type;
          token.name = dbUser.username;
          token.email = dbUser.email;
        }

        return token;
      }

      // When credentials login happens:
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? "user";
        token.email = (user as any).email;
        token.name = (user as any).name;
      }

      return token;
    },

    /* ------------------------------------------------------------------
       Session mapping
    ------------------------------------------------------------------ */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.role = token.role!;
        session.user.email = token.email!;
        session.user.name = token.name!;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return url;
    },
  },
};
