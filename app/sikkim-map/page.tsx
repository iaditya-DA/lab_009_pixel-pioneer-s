"use client";
import dynamic from "next/dynamic";
const SikkimMap = dynamic(() => import("@/components/ui/SikkimMap"), { ssr: false });
export default function Page(){
    return (
        <div>
            <SikkimMap/>
        </div>
    )
}
