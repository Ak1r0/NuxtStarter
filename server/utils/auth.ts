import type { User } from "~/server/database/schema";
import type {H3Event} from "h3";
import {Lucia} from 'lucia'
import process from 'node:process'
import { webcrypto } from "node:crypto";
import {uid} from "uid/secure";
import { Argon2id } from "oslo/password";
import {DrizzlePostgreSQLAdapter} from "@lucia-auth/adapter-drizzle";

// Lucia Polyfill is node < 20
globalThis.crypto = webcrypto as Crypto;

const luciaAdapter = new DrizzlePostgreSQLAdapter(db, tables.session, tables.user);

export const lucia = new Lucia(luciaAdapter, {
  sessionCookie: {
    // IMPORTANT!
    attributes: {
      // set to `true` when using HTTPS
      secure: !process.dev,
      sameSite: "strict",
    }
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name
    };
  }
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User
  }
}

// export const googleAuth = google(auth, {
//   clientId: config.google.clientId,
//   clientSecret: config.google.clientSecret,
//   scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
//   redirectUri: `${config.public.url}/auth/google/callback`,
// })

class AuthService {
  async createUser(name: string, email: string, password = '') {
    try {
      const userId = uid();
      const hashedPassword = await new Argon2id().hash(password);
      const [user] = await db.insert(tables.user).values({id: userId, name, email, hashedPassword}).returning() as User[];
      return user;
    }
    catch (e) {
      console.error(`error creating user: ${email}`, e)
      return null
    }
  }

  async createSession(user: User, event: any) {
    try {
      const session = await lucia.createSession(user.id, {});
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
      return session;
    }
    catch (e) {
      console.error(`error creating session: ${user.id}`, e)
      return null
    }
  }

  getAuthenticatedUser(event: H3Event) {
    return event.context.user as User;
  }

  async logout(event: any) {
    if (!event.context.session) {
      throw createError({
        statusCode: 403
      });
    }
    await lucia.invalidateSession(event.context.session.id);
    appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }

  async passwordLogin(event: any, email: string, password: string) {

    const user = await userService.getByEmail(email);
    if (!user) {
      await new Argon2id().verify('azertyuiop', password); // Time attack protection
      return false;
    }

    const validPassword = await new Argon2id().verify(user.hashedPassword, password);
    if (!validPassword) {
      return false;
    }

    const session = await this.createSession(user, event)
    return !!session;
  }
}

export const authService = new AuthService()
