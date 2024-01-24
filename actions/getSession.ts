import { authOptions } from "@/app/libs/session";
import { getServerSession } from "next-auth";

export async function getCurrentSession() {
  return await getServerSession(authOptions);
}
