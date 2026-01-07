"use client";

import {
    LayoutDashboardIcon, FileText,
} from "lucide-react";
import { BaseSidebar, type NavItem } from "@/components/dashboard/base-sidebar";
import type { Sidebar } from "@/components/ui/sidebar";

const moderatorNavLinks: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard/moderator",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Notes Review",
        url: `/dashboard/moderator/notes`,
        icon: FileText,
    },
];

export function ModeratorSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return <BaseSidebar navItems={moderatorNavLinks} {...props} />;
}

