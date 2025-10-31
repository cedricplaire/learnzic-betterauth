import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js"
import { admin, customSession, magicLink } from "better-auth/plugins";
import { ac, roles } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { getValidDomains, normalizeName } from "./utils";
import { UserGenre, UserRole } from "@/generated/prisma/enums";
import { SendEmailAction } from "@/actions/send-email.action";

const options = {
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
      github: {
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      autoSignIn: false,
      password: {
        hash: hashPassword,
        verify: verifyPassword,
      },
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url}) => {
        await SendEmailAction({
          to: user.email,
          subject: "reset your password",
          meta: {
            description: "Please click the link below to reset your password",
            link: url
          },
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      expiresIn: 60 * 60,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({user, url}) => {
        const link = new URL(url);
        link.searchParams.set("callbackURL", "/auth/verify");
        await SendEmailAction({
          to: user.email,
          subject: "Verify Your EMail Address",
          meta: {
            description:
              "Please verify yur email address to complete registration",
            link: String(link),
          },
        });
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/sign-up/email") {
          const email = String(ctx.body.email);
          const domains = email.split("@")[1];

          const VALID_DOMAINS = getValidDomains();
          if (!VALID_DOMAINS.includes(domains)) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid domain, please use a valid email",
            });
          }
          return {
            context: {
              ...ctx,
              body: {
                ...ctx.body,
                name: normalizeName(ctx.body.name),
              },
            },
          };
        }

        if (ctx.path === "/sign-in/magic-link") {
          return {
            context: {
              ...ctx,
              body: {
                ...ctx.body,
                name: normalizeName(ctx.body.name),
              },
            },
          };
        }

        if (ctx.path === "/update-user") {
          return {
            context: {
              ...ctx,
              body: {
                ...ctx.body,
                name: normalizeName(ctx.body.name),
              },
            },
          };
        }
      }),
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];
  
            if (ADMIN_EMAILS.includes(user.email)) {
              return { data: { ...user, role: UserRole.ADMIN } };
            }
  
            return { data: user };
          },
        },
      },
    },
    user: {
      additionalFields: {
        role: {
          type: ["USER", "ADMIN"] as Array<UserRole>,
          input: false,
        },
        genre: {
          type: ["MALE", "FEMALE"] as Array<UserGenre>,
          input: false,
        },
      },
    },
    session: {
      expiresIn: 30 * 24 * 60 * 60,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
      additionalFields: {
        genre: {
          type: ["MALE", "FEMALE"] as Array<UserGenre>,
        },
      },
    },
    account: {
      accountLinking: {
        enabled: false,
      }
    },
    advanced: {
      database: {
        generateId: false,
      },
    },
    plugins: [
      nextCookies(),
      admin({
        defaultRole: UserRole.USER,
        adminRoles: [UserRole.ADMIN],
        ac,
        roles,
      }),
      magicLink({
        sendMagicLink: async({email, url}) => {
          await SendEmailAction({
            to: email,
            subject: "Magic Link Login",
            meta: {
              description: "Please click the link below to login",
              link: url
            },
          });
        },
      }),
    ],
  
} satisfies BetterAuthOptions

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async({user, session}) => {
      return {
        session: {
          expireAt: session.expiresAt,
          token: session.token,
          userId: session.userId,
          userAgent: session.userAgent,
          ipAddress: session.ipAddress
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          role: user.role,
          genre: user.genre,
          emailVerif: user.emailVerified
        }
      }
    }, options)
  ]
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN"; 