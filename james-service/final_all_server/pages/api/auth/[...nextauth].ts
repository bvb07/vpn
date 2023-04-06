import NextAuth, { Account, Profile, RequestInternal, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getConnection } from "../../../db";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { nanoid } from "nanoid";

const client_ID = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
const client_secret = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`;
interface JwtParams {
  token: any;
  account?: any;
  user: any;
}
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: client_ID,
      clientSecret: client_secret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "@" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: { email: string; password: string } | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ) {
        const { email, password } = credentials ?? {};
        const time = new Date().toLocaleDateString("th-TH", {
          timeZone: "UTC",
        });
        var user = getConnection().get("tasks").find({ email: email }).value();
        if (user) {
          return user;
        } else {
          const newUser = {
            role: "user",
            uid: nanoid(),
            email: email || "",
            displayName: email ? email.split(".").join("_") : "",
            status: "pending",
            iscreated: false,
            time: time,
            photo: "User_Customix",
          };
          const tasks = getConnection().get("tasks");
          const createdUser = tasks.push(newUser).write();
          return {
            uid: newUser.uid, // Add uid property
            email: newUser.email,
            displayName: newUser.displayName,
            role: newUser.role,
            status: newUser.status,
            iscreated: newUser.iscreated,
            time: newUser.time,
            photo: newUser.photo,
          };
        }
      },
    }),
  ],
  callbacks: {
    jwt: async (params: {
      token: JWT;
      user?: User | AdapterUser | undefined;
      account?: Account | null | undefined;
      profile?: Profile | undefined;
      isNewUser?: boolean | undefined;
    }): Promise<any> => {
      const { token, account, user } = params;
      if (account) {
        try {
          token.accessToken = account.access_token;
          const foundUser = getConnection()
            .get("tasks")
            .find((task) => task.email === user?.email)
            .value();
          if (foundUser) {
            token.role = foundUser.role;
            token.uid = foundUser.uid;
            token.photo = foundUser.photo;
          } else {
            if (account.provider === "google") {
              return token;
            } else {
              const check = false;
              return check;
            }
          }
        } catch (err) {
          if (account.provider === "google") {
            return token;
          } else {
            return { message: "You are not registered" };
          }
        }
      }
      return token;
    },
    async session({
      session,
      user,
      token,
    }: {
      session: any;
      user: any;
      token: any;
    }): Promise<any> {
      try {
        const foundUser = getConnection()
          .get("tasks")
          .find((task) => task?.email === token?.email)
          .value();
        if (foundUser?.photo === "User_Customix") {
          session.check = true;
          session.message = "Sign up email";
          session.accessToken = token.accessToken;
          session.uid = token.sub;
          session.role = token.role;
          if (session.uid === undefined) {
            session.uid = token.uid;
            session.photo = token.photo;
          }
          return session;
        }
        console.log("tokemn email --> ",token?.email);
        
        console.log("found user --> ",foundUser);
        
        if (foundUser) {
          session.check = true;
          session.message = "You are user";
          session.accessToken = token.accessToken;
          session.uid = token.sub;
          session.role = token.role;
          if (session.uid === undefined) {
            session.uid = token.uid;
            session.photo = token.photo;
            session.role = token.role;
          }
          return session;
        } else {
          session.message = "You not registered";
          session.uid = token.sub;
          session.accessToken = token.accessToken;
          session.role = token.role;
          if (session.uid === undefined) {
            session.uid = token.uid;
            session.photo = token.photo;
            session.role = token.role;
          }
          return session;
        }
      } catch (err) {
        return { message: "You are not registered" };
      }
    },
  },
};
export default NextAuth(authOptions);
