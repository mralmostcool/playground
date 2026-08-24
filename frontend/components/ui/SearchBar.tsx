import React, { useState, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export default function SearchBar({ placeholder, value, onChange, debounceMs = 300 }: SearchBarProps) {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localVal);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [localVal, debounceMs, onChange]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        className="w-full h-10 pl-10 pr-10 bg-surface-card border border-muted focus:border-primary rounded-md outline-none text-sm text-ink transition-colors"
      />
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {localVal && (
        <button
          onClick={() => setLocalVal("")}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-ink cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
