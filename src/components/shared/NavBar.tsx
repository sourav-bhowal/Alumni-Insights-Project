import Link from "next/link";
import UserButton from "./UserButton";
// import SearchField from "./SearchField";
import NavbarLinks from "./NavBarLinks";

// NAVBAR COMPONENT
export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-2 sm:py-3">
        <div className="flex w-full items-center justify-between md:w-auto">
          <UserButton className="sm:ms-auto md:hidden" />
          <Link href={"/"} className="text-2xl font-bold text-primary">
            <p className="hidden md:block">AI</p>
          </Link>
        </div>
        {/* <SearchField /> */}
        <div className="hidden items-center justify-center md:flex">
          <NavbarLinks />
        </div>
        <div className="hidden md:flex items-center">
          <UserButton className="sm:ms-auto" />
        </div>
        <div className="block items-center justify-center md:hidden">
          <NavbarLinks />
        </div>
      </div>
    </header>
  );
}
