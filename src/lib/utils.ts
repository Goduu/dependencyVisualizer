import { clsx, type ClassValue } from "clsx"
import { MermaidConfig, RenderResult } from "mermaid";
import { twMerge } from "tailwind-merge"
import mermaid from 'mermaid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
