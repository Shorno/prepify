"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Flame } from "lucide-react"
import { DataTable } from "@/components/data-table";
import { LeaderboardEntry } from "@/db/schema";
import Link from "next/link";


interface LeaderboardTableProps {
    data: LeaderboardEntry[]
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                    </div>
                )
            case 2:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600 flex items-center justify-center">
                        <Medal className="w-4 h-4 text-white" />
                    </div>
                )
            case 3:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <Medal className="w-4 h-4 text-white" />
                    </div>
                )
            default:
                return (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-semibold text-muted-foreground">{rank}</span>
                    </div>
                )
        }
    }

    const columns: ColumnDef<LeaderboardEntry>[] = [
        {
            accessorKey: "rank",
            header: () => <div className="">Rank</div>,
            cell: ({ row }) => {
                const rank = row.getValue("rank") as number
                return (
                    <div className="flex gap-2 items-center">
                        {getRankIcon(rank)}
                    </div>
                )
            },
        },


        {
            accessorKey: "user",
            header: () => <div className="text-left">User</div>,
            cell: ({ row }) => {
                const user = row.getValue("user") as LeaderboardEntry["user"]
                return (
                    <Link
                        href={`/profile/${user.id}`}
                        className="flex items-center gap-3 group"
                    >
                        <Avatar className="h-10 w-10 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-semibold text-sm group-hover:text-primary transition-colors">{user.name}</p>
                        </div>
                    </Link>
                )
            },
        },
        {
            accessorKey: "totalPoints",
            header: () => <div className="text-right">Points</div>,
            cell: ({ row }) => {
                const points = row.getValue("totalPoints") as number
                return (
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-lg">{points}</span>
                        <span className="text-xs text-muted-foreground">pts</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "notesCreated",
            header: () => <div className="text-right">Notes</div>,
            cell: ({ row }) => {
                const notes = row.getValue("notesCreated") as number
                return (
                    <div className="flex justify-end">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                            {notes}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: "updatedAt",
            header: () => <div className="text-right">Updated</div>,
            cell: ({ row }) => {
                const date = row.getValue("updatedAt") as string
                return (
                    <div className="text-right text-sm text-muted-foreground">
                        {new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                )
            },
        },
    ]

    return <DataTable columns={columns} data={data} />
}
