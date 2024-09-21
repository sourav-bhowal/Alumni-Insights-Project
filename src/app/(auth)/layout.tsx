import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

// AUTH LAYOUT
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF USER ALREADY LOGGED IN
  if (user) redirect("/");

  // RETURN CHILDREN
  return <>{children}</>;
}
