import {Loader} from "lucide-react";

export default function Loading(){
    return (
        <div className={"absolute inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm"}>
            <Loader/>
        </div>
    )
}