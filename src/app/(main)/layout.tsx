import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../../context/SessionProvider";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
// import SideMenuBar from "@/components/shared/SideMenuBar";

// MAIN LAYOUT
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // USER FROM SESSION
  const session = await validateRequest();

  // IF USER NOT LOGGED IN
  if (!session.user) redirect("/signin");

  // RETURN CHILDREN
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        {/* SHOW NAVBAR */}
        <NavBar />
        <div className="mx-auto flex w-full grow flex-col gap-10 md:max-w-[95%] md:gap-[200px] md:p-5 p-3">
          {children}
          <Footer />
        </div>
      </div>
    </SessionProvider>
  );
}
