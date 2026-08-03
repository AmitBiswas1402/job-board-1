import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-background flex flex-col items-center justify-center p-6 select-none">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="size-12 rounded-full border-2 border-hairline border-t-primary animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            Loading your workspace
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">
            Syncing your latest data...
          </p>
        </div>
      </div>
    </div>
  );
}
