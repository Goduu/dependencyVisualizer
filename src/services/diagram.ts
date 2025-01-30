import { DiagramData, FileNode } from '@/src/types'
import mermaid from 'mermaid'
import DOMPurify from 'dompurify'

// Enhanced interfaces
interface SearchOptions {
  term: string
  isCaseSensitive: boolean
  isRegex: boolean
}

interface FilterState {
  showComponents: boolean
  showHooks: boolean
  showHOCs: boolean
  showFunctions: boolean
  showImports: boolean
  showProps: boolean
  showHookDeps: boolean
  search: SearchOptions
  currentPage: number
}

// Edge style definitions
const getEdgeStyle = (type: string): string => {
  switch (type) {
    case 'import':
      return ' -->|import| ';
    case 'prop':
      return ' ==>|props| ';
    case 'hook-dependency':
      return ' -.->|hook| ';
    case 'hoc':
      return ' ==>|hoc| ';
    default:
      return ' --> ';
  }
};

const getEdgeStyleProperties = (type: string): string => {
  switch (type) {
    case 'import':
      return 'stroke:#666,stroke-width:1px,stroke-dasharray:0';
    case 'prop':
      return 'stroke:#f66,stroke-width:2px';
    case 'hook-dependency':
      return 'stroke:#66f,stroke-width:1.5px,stroke-dasharray:5';
    case 'hoc':
      return 'stroke:#6f6,stroke-width:2px';
    default:
      return 'stroke:#666,stroke-width:1px';
  }
};

// Enhanced ID sanitization
const sanitizeId = (id: string): string => {
  if (!id) return '_empty_'
  return id.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
}

// Improved search matching with error handling
function matchesSearch(text: string | undefined, search: SearchOptions): boolean {
  if (!text) return false
  if (!search.term) return true

  try {
    if (search.isRegex) {
      const regex = new RegExp(search.term, search.isCaseSensitive ? '' : 'i')
      return regex.test(text)
    }

    const searchText = search.isCaseSensitive ? text : text.toLowerCase()
    const searchTerm = search.isCaseSensitive ? search.term : search.term.toLowerCase()
    return searchText.includes(searchTerm)
  } catch (error) {
    console.warn('Search matching error:', error)
    return false
  }
}

// Check for circular dependencies
function detectCircularDependencies(edges: Array<{ from: string; to: string }>): boolean {
  const graph = new Map<string, Set<string>>()
  
  edges.forEach(({ from, to }) => {
    if (!graph.has(from)) graph.set(from, new Set())
    graph.get(from)!.add(to)
  })

  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  function hasCycle(node: string): boolean {
    if (!graph.has(node)) return false
    if (recursionStack.has(node)) return true
    if (visited.has(node)) return false

    visited.add(node)
    recursionStack.add(node)

    for (const neighbor of Array.from(graph.get(node)!)) {
      if (hasCycle(neighbor)) return true
    }

    recursionStack.delete(node)
    return false
  }

  return Array.from(graph.keys()).some(node => hasCycle(node))
}

// Safe HTML content generation
function generateNodeContent(node: FileNode): string {
  const parts = [node.path];
  
  if (node.exports?.components?.length) {
    parts.push(`Components: ${node.exports.components.join(', ')}`);
  }
  if (node.hooks?.length) {
    parts.push(`Hooks: ${node.hooks.map(h => h.name).join(', ')}`);
  }
  if (node.hocs?.length) {
    parts.push(`HOCs: ${node.hocs.join(', ')}`);
  }
  
  return parts.join('<br/>');
}

// Enhanced diagram generation with pagination
export const generateMermaidDiagram = (
  data: DiagramData,
  filters: FilterState,
  highlightedNodes?: Set<string>,
  highlightedEdges?: Set<string>
): string => {
  console.log('Generating diagram with data:', { 
    nodeCount: data?.nodes?.length,
    edgeCount: data?.edges?.length,
    filters 
  });

  if (!data?.nodes?.length) {
    console.warn('No nodes to display');
    return 'graph TD\n  empty["No data to display"]';
  }

  try {
    let diagram = 'graph TD\n';

    // Add styles
    diagram += `
      classDef default fill:#fff,stroke:#333,stroke-width:1px;
      classDef component fill:#f9f,stroke:#333,stroke-width:2px;
      classDef hook fill:#bbf,stroke:#333,stroke-width:2px;
      classDef hoc fill:#ffb,stroke:#333,stroke-width:2px;
      classDef highlight fill:#ff0,stroke:#f00,stroke-width:3px;
      classDef dimmed fill:#eee,stroke:#999,stroke-width:1px;
    `.replace(/^\s+/gm, '  ');

    // Filter nodes based on search and filters
    const filteredNodes = data.nodes.filter(node => {
      if (filters?.search?.term) {
        const matchesPath = matchesSearch(node.path, filters.search);
        const matchesComponents = node.exports?.components?.some(c => matchesSearch(c, filters.search)) ?? false;
        const matchesFunctions = node.exports?.functions?.some(f => matchesSearch(f, filters.search)) ?? false;
        const matchesHooks = node.hooks?.some(h => matchesSearch(h.name, filters.search)) ?? false;
        const matchesHOCs = node.hocs?.some(h => matchesSearch(h, filters.search)) ?? false;

        if (!matchesPath && !matchesComponents && !matchesFunctions && !matchesHooks && !matchesHOCs) {
          return false;
        }
      }

      return (
        (filters.showComponents && (node.exports?.components?.length ?? 0) > 0) ||
        (filters.showHooks && (node.hooks?.length ?? 0) > 0) ||
        (filters.showHOCs && (node.hocs?.length ?? 0) > 0) ||
        (filters.showFunctions && (node.exports?.functions?.length ?? 0) > 0)
      );
    });

    // Process nodes
    const nodeIds = new Set<string>();
    filteredNodes.forEach(node => {
      const nodeId = sanitizeId(node.path);
      nodeIds.add(nodeId);

      const label = generateNodeContent(node);
      diagram += `  ${nodeId}["${DOMPurify.sanitize(label)}"]\n`;

      // Apply styles
      if (highlightedNodes?.has(node.path)) {
        diagram += `  class ${nodeId} highlight\n`;
      } else if ((highlightedNodes?.size ?? 0) > 0) {
        diagram += `  class ${nodeId} dimmed\n`;
      } else {
        if (node.exports?.components?.length) {
          diagram += `  class ${nodeId} component\n`;
        }
        if (node.hooks?.length) {
          diagram += `  class ${nodeId} hook\n`;
        }
        if (node.hocs?.length) {
          diagram += `  class ${nodeId} hoc\n`;
        }
      }
    });

    // Process edges
    if (data.edges) {
      let linkStyleIndex = 0;  // Add this line
      data.edges.forEach(edge => {
        const fromId = sanitizeId(edge.from);
        const toId = sanitizeId(edge.to);
        
        if (nodeIds.has(fromId) && nodeIds.has(toId)) {
          const isHighlighted = highlightedEdges?.has(`${edge.from}-${edge.to}`);
          let edgeStyle = isHighlighted ? 
            ' ===> ' : 
            getEdgeStyle(edge.type);

          if (
            (filters.showImports && edge.type === 'import') ||
            (filters.showProps && edge.type === 'prop') ||
            (filters.showHookDeps && edge.type === 'hook-dependency')
          ) {
            const style = isHighlighted ? 
              'stroke:#f00,stroke-width:2px' : 
              getEdgeStyleProperties(edge.type);
            
            diagram += `  ${fromId}${edgeStyle}${toId}\n`;
            diagram += `  linkStyle ${linkStyleIndex} ${style}\n`;
            linkStyleIndex++;
          }
        }
      });
    }

    console.log('Generated diagram:', diagram);
    return diagram;
  } catch (error) {
    console.error('Error generating diagram:', error);
    return 'graph TD\n  error["Error generating diagram"]';
  }
};

// Enhanced rendering with timeout and error handling
export const renderDiagram = async (
  diagram: string,
  container: HTMLElement,
  onFilterChange?: (filters: FilterState) => void
): Promise<void> => {
  console.log('Rendering diagram to container');
  
  try {
    container.innerHTML = '';
    
    // Create container for diagram
    const diagramContainer = document.createElement('div');
    diagramContainer.style.position = 'relative';
    diagramContainer.style.width = '100%';
    diagramContainer.style.minHeight = '500px';
    
    console.log('Attempting to render mermaid diagram');
    const { svg } = await mermaid.render('mermaid-diagram-svg', diagram);
    console.log('Mermaid render complete, svg length:', svg?.length);

    if (!svg) {
      throw new Error('Mermaid rendered empty SVG');
    }

    // Create wrapper for SVG
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.overflow = 'auto';
    wrapper.innerHTML = svg;

    const svgElement = wrapper.querySelector('svg');
    if (!svgElement) {
      throw new Error('SVG element not found in rendered output');
    }

    // Set SVG dimensions
    svgElement.style.width = '100%';
    svgElement.style.height = '100%';

    // Add wrapper to container
    diagramContainer.appendChild(wrapper);

    // Add container to page
    container.appendChild(diagramContainer);
    console.log('Diagram rendered successfully');

  } catch (error) {
    console.error('Error rendering diagram:', error);
    container.innerHTML = `Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}