import NavBar from "@/components/layouts/nav-bar";
import NavSidebar from "@/components/layouts/nav-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <NavBar />

        <NavSidebar />
        <main className="mt-[72px] p-2 w-full  text-white">{children}</main>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
