"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardGroupError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[DashboardGroup Error Boundary]:", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 shadow-sm">
                <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Dashboard error encountered
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6 text-sm">
                {error?.message || "Could not load dashboard information. Please retry or navigate to main dashboard."}
            </p>
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow cursor-pointer"
                >
                    <RefreshCw className="h-4 w-4" /> Try Again
                </Button>
                <Link href="/dashboard">
                    <Button variant="outline" className="gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
