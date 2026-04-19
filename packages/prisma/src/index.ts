export * from "../generated/client";

import { PrismaClient } from "../generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({ adapter });
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({ adapter });
    }

    prisma = global.prisma;
  }
}
//@ts-ignore
export default prisma;
