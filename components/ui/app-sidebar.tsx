"use client";

import { useRouter } from "next/navigation";
import {
  Home,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";

export function AppSidebar() {
  const router = useRouter();

  /** log the user out and send them to /signin */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CharpstAR Dashboard</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* static nav items */}
              {[
                { title: "Home", url: "/admindashboardpage/products", icon: Home },
                { title: "Users", url: "#", icon: User },
                { title: "Search", url: "#", icon: Search },
                { title: "Settings", url: "#", icon: Settings },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* sign-out item (button, not link) */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={handleSignOut}
                  aria-label="Sign out"
                >
                  <button type="button">
                    <LogOut />
                    <span>Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
