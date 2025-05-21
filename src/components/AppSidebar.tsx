
import { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarLogoutSection from "./sidebar/SidebarLogoutSection";
import SidebarFooter from "./sidebar/SidebarFooter";

type AppSidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const AppSidebar = ({ isSidebarOpen, toggleSidebar }: AppSidebarProps) => {
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 z-40 h-full transition-all duration-300 ease-in-out rounded-r-lg shadow-lg",
        isSidebarOpen ? "w-64 bg-card border-r" : "w-[60px] bg-farm text-white"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <SidebarHeader 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />

        {/* Navigation */}
        <SidebarNavigation isSidebarOpen={isSidebarOpen} />

        {/* Logout Button */}
        <SidebarLogoutSection isSidebarOpen={isSidebarOpen} />

        {/* Footer */}
        <SidebarFooter isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};
