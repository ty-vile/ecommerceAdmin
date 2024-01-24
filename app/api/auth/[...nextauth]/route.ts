import NextAuth from "next-auth";

import { authOptions } from "@/app/libs/session";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, handler as DELETE };
