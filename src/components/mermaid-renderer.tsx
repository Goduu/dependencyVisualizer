'use client'

import React from 'react'
import { DiagramData, FileNode, FilterState } from '@/src/types'
import { Button } from '@/components/ui/button'
import { SearchInput } from './search-input'
import { useMermaidDiagram } from '@/src/hooks/useMermaidDiagram'
import { DiagramFilters } from './diagram-filters'

interface MermaidRendererProps {
  diagram: string;
  nodes: FileNode[];
  edges: DiagramData['edges'];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  setHighlightedNodes: (nodes: Set<string>) => void;
  setHighlightedEdges: (edges: Set<string>) => void;
}

const MermaidRenderer = ({
  diagram,
  nodes,
  edges,
  filters,
  onFiltersChange,
  setHighlightedNodes,
  setHighlightedEdges
}: MermaidRendererProps) => {
  const {
    containerRef,
    scale,
    handleSearch,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  } = useMermaidDiagram({
    diagram,
    nodes,
    edges,
    setHighlightedNodes,
    setHighlightedEdges,
  });

  return (
    <div className="relative h-full">
      {/* Search Input */}
      <div className="absolute top-4 left-4 z-10 flex items-center w-full gap-2">
        <SearchInput
          className='w-64'
          onSearch={handleSearch}
          placeholder="Search components, files..."
        />
        {/* Filters */}
        <DiagramFilters
          filters={filters}
          onChange={onFiltersChange}
        />
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 right-4 bg-white/80 px-2 py-1 rounded text-sm">
        {Math.round(scale * 100)}%
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-16 right-4 flex gap-2 z-10 bg-white/80 p-2 rounded-lg shadow">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="w-8 h-8"
        >
          +
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="w-8 h-8"
        >
          -
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleResetZoom}
          className="w-8 h-8"
        >
          ↺
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/80 px-2 py-1 rounded text-sm">
        Scroll to zoom • Drag to pan
      </div>

      {/* Diagram Container */}
      <div 
        ref={containerRef}
        className="w-full h-[calc(100vh-200px)] border rounded-lg p-4 overflow-hidden"
      />
    </div>
  );
};

export default MermaidRenderer;

