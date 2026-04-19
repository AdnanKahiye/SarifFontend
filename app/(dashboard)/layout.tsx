"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PermissionProvider } from "@/context/PermissionContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const permissionUser = {
    id: user.userId || "",
    fullName: (user as any).fullName || "User",
    email: user.email,
    role: user.role,
    permissions: (user as any).permissions || [],
  };

  // 1. Wrap EVERYTHING in the Provider first
  return (
    <PermissionProvider user={permissionUser}>
      <DashboardInnerContent>{children}</DashboardInnerContent>
    </PermissionProvider>
  );
}

// 2. This component now safely sits WITHIN the PermissionProvider
function DashboardInnerContent({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) setIsSidebarCollapsed(saved === "true");
  }, []);

  const handleCollapse = (val: boolean) => {
    setIsSidebarCollapsed(val);
    localStorage.setItem("sidebarCollapsed", String(val));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        <Navbar 
          isSidebarCollapsed={isSidebarCollapsed} 
          onCollapse={handleCollapse} 
          onOpenMobile={() => setIsMobileOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}