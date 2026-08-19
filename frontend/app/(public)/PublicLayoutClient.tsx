"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type PublicLayoutContextType = {
  header: React.ReactNode;
  setHeader: (node: React.ReactNode) => void;
  sidebar: React.ReactNode;
  setSidebar: (node: React.ReactNode) => void;
};

const PublicLayoutContext = createContext<PublicLayoutContextType | null>(null);

export function usePublicLayout() {
  const context = useContext(PublicLayoutContext);
  if (!context) {
    throw new Error("usePublicLayout must be used within a PublicLayoutProvider");
  }
  return context;
}

export function PublicLayoutHeader({ children, deps = [] }: { children: React.ReactNode; deps?: any[] }) {
  const { setHeader } = usePublicLayout();
  useEffect(() => {
    setHeader(children);
    return () => setHeader(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeader, ...deps]);
  return null;
}

export function PublicLayoutSidebar({ children, deps = [] }: { children: React.ReactNode; deps?: any[] }) {
  const { setSidebar } = usePublicLayout();
  useEffect(() => {
    setSidebar(children);
    return () => setSidebar(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSidebar, ...deps]);
  return null;
}

export function PublicLayoutProvider({ children }: { children: React.ReactNode }) {
  const [header, setHeader] = useState<React.ReactNode>(null);
  const [sidebar, setSidebar] = useState<React.ReactNode>(null);

  return (
    <PublicLayoutContext.Provider value={{ header, setHeader, sidebar, setSidebar }}>
      {children}
    </PublicLayoutContext.Provider>
  );
}

export function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const { header, sidebar } = usePublicLayout();
  const hasLeftColumn = !!(header || sidebar);

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Header and Sidebar */}
        <div className={`w-full lg:w-80 flex-shrink-0 flex flex-col gap-8 ${hasLeftColumn ? "" : "hidden lg:hidden"}`}>
          {header && <div className="flex flex-col gap-2">{header}</div>}
          {sidebar && <aside className="w-full flex flex-col gap-1.5">{sidebar}</aside>}
        </div>

        {/* Right Column: Main Content (children) */}
        <div className={`flex-grow w-full ${hasLeftColumn ? "lg:max-w-[calc(100%-22rem)]" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
