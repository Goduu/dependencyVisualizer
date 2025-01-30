'use client'

import React, { useEffect, useRef, useState, WheelEvent, MouseEvent } from 'react'
import mermaid from 'mermaid'
import { DiagramData, FileNode, FilterState } from '@/src/types'
import { Button } from '@/components/ui/button'
import { SearchInput } from './search-input'

interface MermaidRendererProps {
  diagram: string;
  nodes: FileNode[];
  edges: DiagramData['edges'];
  onFilterChange?: (filters: FilterState) => void;
}

const MermaidRenderer = ({ diagram, nodes, edges, onFilterChange }: MermaidRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(new Set());
  
  const zoomStep = 0.5;
  const maxZoom = 30;
  const minZoom = 0.1;

  // Handle mouse wheel zoom
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) { // Only zoom when Ctrl/Cmd is pressed
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(maxZoom, Math.max(minZoom, scale + delta));
      setScale(newScale);
    }
  };

  // Handle drag to pan
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging && wrapperRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
      wrapperRef.current.style.transform = 
        `translate(${newX}px, ${newY}px) scale(${scale})`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setHighlightedNodes(new Set());
      setHighlightedEdges(new Set());
      return;
    }

    const newHighlightedNodes = new Set<string>();
    const newHighlightedEdges = new Set<string>();
    const termLower = term.toLowerCase();

    // Find matching nodes
    nodes.forEach(node => {
      const matches = 
        node.path.toLowerCase().includes(termLower) ||
        node.exports?.components?.some(c => c.toLowerCase().includes(termLower)) ||
        node.exports?.functions?.some(f => f.toLowerCase().includes(termLower)) ||
        node.hooks?.some((h: { name: string }) => h.name.toLowerCase().includes(termLower)) ||
        node.hocs?.some((h: string) => h.toLowerCase().includes(termLower));


      if (matches) {
        newHighlightedNodes.add(node.path);
        
        // Find connected edges and nodes
        edges.forEach((edge: DiagramData['edges'][number]) => {
          if (edge.from === node.path || edge.to === node.path) {
            newHighlightedEdges.add(`${edge.from}-${edge.to}`);
            newHighlightedNodes.add(edge.from);
            newHighlightedNodes.add(edge.to);
          }
        });
      }
    });

    setHighlightedNodes(newHighlightedNodes);
    setHighlightedEdges(newHighlightedEdges);
  };

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        rankSpacing: 100,
        nodeSpacing: 100,
        diagramPadding: 100,
      },
    });
  }, []);

  // Render diagram
  useEffect(() => {
    if (!containerRef.current || !diagram) return;

    const renderDiagram = async () => {
      try {
        console.log('Rendering diagram:', diagram);
        const wrapper = document.createElement('div');
        wrapper.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;
        wrapper.style.transformOrigin = 'top left';
        wrapper.style.transition = 'transform 0.2s ease';
        wrapper.style.cursor = 'grab';
        
        const { svg } = await mermaid.render('mermaid-diagram-svg', diagram);
        
        if (svg) {
          wrapper.innerHTML = svg;
          containerRef.current!.innerHTML = '';
          containerRef.current!.appendChild(wrapper);
          wrapperRef.current = wrapper;
        }
      } catch (error) {
        console.error('Error rendering diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = 'Error rendering diagram';
        }
      }
    };

    renderDiagram();
  }, [diagram, scale, position]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(maxZoom, prev + zoomStep));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(minZoom, prev - zoomStep));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="absolute top-4 left-4 w-64 z-10">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search components, files..."
        />
      </div>

      {/* Zoom Level Indicator - move to right */}
      <div className="absolute top-4 right-4 bg-white/80 px-2 py-1 rounded text-sm">
        {Math.round(scale * 100)}%
      </div>

      {/* Move zoom controls below search */}
      <div className="absolute top-16 right-4 flex gap-2 z-10 bg-white/80 p-2 rounded-lg shadow">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={scale >= maxZoom}
          className="w-8 h-8"
        >
          +
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={scale <= minZoom}
          className="w-8 h-8"
        >
          -
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleResetZoom}
          disabled={scale === 1 && position.x === 0 && position.y === 0}
          className="w-8 h-8"
        >
          ↺
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/80 px-2 py-1 rounded text-sm">
        Ctrl + Scroll to zoom • Drag to pan
      </div>

      {/* Diagram Container */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full min-h-[500px] border rounded-lg p-4 overflow-hidden cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

export default MermaidRenderer;

