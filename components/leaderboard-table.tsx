"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Flame } from "lucide-react"
import {DataTable} from "@/components/data-table";
import {LeaderboardEntry} from "@/db/schema";


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
                return <Trophy className="w-5 h-5 text-amber-500" />
            case 2:
                return <Medal className="w-5 h-5 text-slate-400" />
            case 3:
                return <Medal className="w-5 h-5 text-amber-700" />
            default:
                return <Flame className="w-5 h-5 text-slate-300 dark:text-slate-600" />
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
                        <span className="font-bold text-lg w-6 text-center">{rank}</span>
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
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-2 ring-border">
                            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-semibold text-sm">{user.name}</p>
                        </div>
                    </div>
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
