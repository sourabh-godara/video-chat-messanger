import "server-only";

import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export const verifySession = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }
  return { isAuth: true, userId: session.user.id };
});
