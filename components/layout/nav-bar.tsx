import Image from "next/image";
import { SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-white/10 backdrop-blur-md text-white z-50 fixed w-full h-[72px] px-4">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={"/dashboard"} className="flex items-center gap-4 ">
            <div className="w-9 h-9  overflow-hidden rounded bg-secondary">
              <Image className="object-contain" src='/logo.png' alt="logo" width={35} height={35}/>
            </div>
            <div className="hidden sm:inline">
              <h3 className="font-bold">Digital OB</h3>
              <h4 className="text-base">Kenya Police Service</h4>
            </div>
          </Link>
          <SidebarTrigger className="cursor-pointer"/>
        </div>
        <div className="flex gap-2">
          <div className="text-end hidden md:inline-block">
            <h4 className="text-base">Inspector Nelson Mudanya</h4>
            <h5 className="text-sm">Nairobi central Police</h5>
          </div>
          <div className="bg-secondary w-10 h-10 rounded-full text-center flex items-center justify-center">NM</div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
