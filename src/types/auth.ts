import type { User as PrismaUser } from "@prisma/client";


import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {

  interface Session extends DefaultSession {
    user: {
    
      id: string;
   
      role: PrismaUser["role"];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: PrismaUser["role"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: PrismaUser["role"];
  }
}


export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: PrismaUser["role"];
} 