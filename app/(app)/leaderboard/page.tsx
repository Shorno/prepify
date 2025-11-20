import {getPublicLeaderboard} from "@/actions/leaderboard/get-leader-board";
import {LeaderboardTable} from "@/components/leaderboard-table";

export default async function LeaderboardPage(){
    const result = await getPublicLeaderboard()

    if (!result.success) {
        return <div>Error loading leaderboard: {result.error}</div>
    }
    return (
        <div className={"main-container"}>
            <LeaderboardTable data={result.data}/>
        </div>
    )
}