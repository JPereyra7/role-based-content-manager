"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export const ConditionalLayoutWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const hide = pathname === "/signin";
  const hideSignup = pathname === "/signup";

  return (
    <SidebarProvider>
      {!hide && !hideSignup && <AppSidebar />}
      <main>
        {!hide && !hideSignup && <SidebarTrigger />}
        {children}
      </main>
    </SidebarProvider>
  );
}
export default ConditionalLayoutWrapper;