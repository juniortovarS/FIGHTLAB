import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userName = session.user?.name ?? session.user?.email?.split("@")[0] ?? "Atleta";
  const userEmail = session.user?.email ?? "";
  const userId = (session.user as any).id;

  return <DashboardClient userName={userName} userEmail={userEmail} userId={userId} />;
}