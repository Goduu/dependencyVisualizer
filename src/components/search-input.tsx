'use client'

import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({ onSearch, placeholder = "Search...", className = "" }: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}; 