'use client'
import { Items } from "@/lib/data";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { usePathname } from "next/navigation";
const items = Items

const NavSidebar = () => {
  const pathName = usePathname()
  return (
    <Sidebar collapsible="icon" className="mt-[72px] !text-white ">  
    
      <SidebarHeader />
      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupLabel className="text-white h-fit me-2 mb-4">
            <div className="p-2 w-full bg-white/10 rounded-lg">
              <h4 className="text-lg">Station Status</h4>
              <div className="flex justify-between items-center">
                <p className="!text-sm">Officers On Duty</p>
                <p className="text-orange-500 text-base">23/32</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="!text-sm">Active Cases</p>
                <p className="text-lime-500 text-base">156</p>
              </div>
            </div>
            </SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathName == item.url} size="lg" asChild tooltip={item.title} className="!text-xl">
                    <a href={item.url}>
                      <item.icon  className="!w-[24px] !h-[24px]"/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default NavSidebar;
