"use client";

import {
    LayoutDashboardIcon, ShieldUserIcon, UserIcon,
} from "lucide-react";
import {BaseSidebar, type NavItem} from "@/components/dashboard/base-sidebar";
import type {Sidebar} from "@/components/ui/sidebar";

const adminNavLinks: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard/admin",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Users",
        url: `/dashboard/admin/users`,
        icon: UserIcon,
    },
    {
        title: "Moderators",
        url: `/dashboard/admin/moderators`,
        icon: ShieldUserIcon,
    },
];

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return <BaseSidebar navItems={adminNavLinks} {...props} />;
}
