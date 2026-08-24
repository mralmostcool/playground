import React from "react";

type StatusType =
  | "ENROLLED"
  | "COMPLETED"
  | "CANCELLED"
  | "DRAFT"
  | "ACTIVE"
  | "TERMINATED"
  | "true"
  | "false"
  | string;

interface StatusBadgeProps {
  status: StatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let label = status;
  let classes = "bg-muted/10 text-muted";

  if (status === "true" || status === "ACTIVE" || status === "COMPLETED") {
    label = status === "true" ? "Active" : status;
    classes = "bg-success/15 text-success border border-success/20";
  } else if (status === "false" || status === "CANCELLED" || status === "TERMINATED") {
    label = status === "false" ? "Inactive" : status;
    classes = "bg-error/15 text-error border border-error/20";
  } else if (status === "ENROLLED" || status === "DRAFT") {
    classes = "bg-accent-amber/15 text-accent-amber border border-accent-amber/20";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${classes}`}>
      {label}
    </span>
  );
}
