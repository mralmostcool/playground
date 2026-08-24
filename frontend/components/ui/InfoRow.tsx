import React from "react";

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 border-b border-hairline-soft text-xs">
      <span className="font-semibold text-muted uppercase tracking-wider text-[10px] w-48 flex-shrink-0">
        {label}
      </span>
      <span className="text-body-strong font-medium mt-1 sm:mt-0 flex-grow text-left sm:text-right break-all">
        {value ?? "—"}
      </span>
    </div>
  );
}
