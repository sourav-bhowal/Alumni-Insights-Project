import Link from "next/link";
import UserButton from "./UserButton";
// import SearchField from "./SearchField";
import NavbarLinks from "./NavBarLinks";
import logo from "@/assets/logo.png";
import Image from "next/image";

// NAVBAR COMPONENT
export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-card/50 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-2 sm:py-3">
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link href={"/"}>
            <Image
              src={logo}
              alt="logo"
              width={100}
              height={100}
              className="cursor-pointer"
            />
          </Link>
        </div>
        {/* <SearchField /> */}
        <UserButton className="sm:ms-auto md:hidden" />
        <div className="hidden items-center justify-center md:flex">
          <NavbarLinks />
        </div>
        <div className="hidden items-center md:flex">
          <UserButton className="sm:ms-auto" />
        </div>
        <div className="block md:hidden">
          <NavbarLinks />
        </div>
      </div>
    </header>
  );
}
