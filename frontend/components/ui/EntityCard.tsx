import React from "react";

interface EntityCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: React.ReactNode;
  metadata?: { label: string; value: string | React.ReactNode }[];
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function EntityCard({ title, subtitle, icon, status, metadata, onClick, children }: EntityCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group p-6 bg-surface-card hover:bg-canvas border border-hairline hover:border-primary rounded-xl transition-all duration-300 text-left shadow-xs hover:shadow-md ${
        onClick ? "cursor-pointer hover:-translate-y-0.5" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
            {icon}
          </div>
        )}
        {status && <div className="ml-auto">{status}</div>}
      </div>
      <h3 className="text-md font-serif text-ink mb-1 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      {subtitle && <p className="text-xs text-muted mb-4 leading-relaxed">{subtitle}</p>}
      {metadata && metadata.length > 0 && (
        <div className="text-[11px] text-muted space-y-1.5 border-t border-hairline-soft pt-4 mt-2">
          {metadata.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-muted-soft">{item.label}</span>
              <span className="font-medium text-body-strong">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
