import NavSidebar from "@/components/layouts/nav-sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavSidebar />
      <main className="mt-[72px] p-2 w-full  text-white">
        
        {children}
      </main>
  </>
  );
};

export default DashboardLayout;
