import { useState } from 'react'
import { DiagramData, FilterState } from '@/src/types'
import { generateMermaidDiagram } from '@/src/services/diagram'
import { diagramDataEx } from '../diagramDataEx'

export function useDiagramState() {
  const [diagramData, setDiagramData] = useState<DiagramData | null>(diagramDataEx as DiagramData)
  const [diagram, setDiagram] = useState<string>('')
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set())
  const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<FilterState>({
    showComponents: true,
    showHooks: true,
    showHOCs: true,
    showFunctions: true,
    showImports: true,
    showProps: true,
    showHookDeps: true,
    search: {
      term: '',
      isCaseSensitive: false,
      isRegex: false,
    },
    currentPage: 0,
  })

  const updateDiagram = (data: DiagramData | null = diagramData) => {
    if (data) {
      const newDiagram = generateMermaidDiagram(
        data,
        filters,
        highlightedNodes,
        highlightedEdges
      )
      setDiagram(newDiagram)
    }
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    updateDiagram()
  }

  return {
    diagramData,
    setDiagramData,
    diagram,
    setDiagram,
    highlightedNodes,
    setHighlightedNodes,
    highlightedEdges,
    setHighlightedEdges,
    filters,
    handleFiltersChange,
    updateDiagram,
  }
} 