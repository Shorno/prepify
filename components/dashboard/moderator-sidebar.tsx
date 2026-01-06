"use client";

import {
    LayoutDashboardIcon, UserIcon,
} from "lucide-react";
import {BaseSidebar, type NavItem} from "@/components/dashboard/base-sidebar";
import type {Sidebar} from "@/components/ui/sidebar";

const moderatorNavLinks: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard/moderator",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Users",
        url: `/dashboard/moderator/pending-notes`,
        icon: UserIcon,
    },
];

export function ModeratorSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return <BaseSidebar navItems={moderatorNavLinks} {...props} />;
}
