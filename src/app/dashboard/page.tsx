import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { apiKeys: { orderBy: { createdAt: "desc" } } },
  });
  if (!user) redirect("/login");

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email, username: user.username, plan: user.plan }}
      apiKeys={user.apiKeys.map((k) => ({
        id: k.id,
        key: k.key,
        name: k.name,
        requests: k.requests,
        limit: k.limit,
        createdAt: k.createdAt.toISOString(),
      }))}
    />
  );
}
