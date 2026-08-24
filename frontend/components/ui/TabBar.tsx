import React from "react";

interface TabBarProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps<any>) {
  return (
    <div className="flex border-b border-hairline w-full mb-6">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-xs font-semibold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
              isActive
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted hover:text-ink hover:border-hairline"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
