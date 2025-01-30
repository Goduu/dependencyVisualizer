'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { parseRepoUrl, getRepoFiles, checkRateLimit } from '@/src/services/github'
import { parseTypeScript, shouldParseFile } from '@/src/services/parser'
import { generateMermaidDiagram, renderDiagram } from '@/src/services/diagram'
import { DiagramData, FileNode, FilterState } from '@/src/types'
import { Alert, AlertDescription } from "@/components/ui/alert"
import MermaidRenderer from '@/src/components/mermaid-renderer'

interface RateLimit {
  remaining: number;
  limit: number;
  resetTime: Date;
  authenticated: boolean;
}

export default function Home() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null)
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null)
  const [diagram, setDiagram] = useState<string>('')
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

  // Check rate limit on component mount
  useEffect(() => {
    const checkLimit = async () => {
      try {
        const limit = await checkRateLimit()
        setRateLimit(limit)
      } catch (error) {
        console.error('Error checking rate limit:', error)
      }
    }
    checkLimit()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRepoUrl(e.target.value)
  }

  const generateEdges = (nodes: FileNode[]) => {
    const edges: DiagramData['edges'] = [];
    const nodesByPath = new Map(nodes.map(node => [node.path, node]));

    // Get path aliases from tsconfig
    const pathAliases = {
      '@/*': ['./*'],
      '@/src/*': ['./src/*'],
      '@/components/*': ['./src/components/*'],
      '@/types/*': ['./src/types/*'],
      '@/services/*': ['./src/services/*']
    };

    const resolveAliasPath = (importPath: string): string => {
      // Remove file extensions
      const normalizedPath = importPath.replace(/\.(ts|tsx|js|jsx)$/, '');

      // Check each alias
      for (const [alias, paths] of Object.entries(pathAliases)) {
        const aliasPattern = alias.replace('*', '(.*)');
        const match = normalizedPath.match(new RegExp(`^${aliasPattern}$`));
        
        if (match) {
          const [, rest] = match;
          // Use the first path mapping (most common case)
          const replacement = paths[0].replace('*', rest);
          // Remove './' prefix and normalize slashes
          return replacement.replace(/^\.\//, '');
        }
      }
      
      return normalizedPath;
    };

    nodes.forEach(node => {
      // Handle import dependencies
      node.imports.forEach(imp => {
        let resolvedPath = imp.source;
        console.log('Processing import:', { from: node.path, import: imp.source });

        // Handle relative imports
        if (imp.source.startsWith('.')) {
          resolvedPath = resolveImportPath(node.path, imp.source);
        } 
        // Handle alias imports
        else if (imp.source.startsWith('@/')) {
          resolvedPath = resolveAliasPath(imp.source);
        }

        console.log('Resolved path:', resolvedPath);
        
        // Find the matching node
        const targetNode = Array.from(nodesByPath.entries()).find(([path]) => {
          const normalizedPath = path.replace(/\.(ts|tsx|js|jsx)$/, '');
          const normalizedResolved = resolvedPath.replace(/\.(ts|tsx|js|jsx)$/, '');
          return normalizedPath.endsWith(normalizedResolved) || 
                 normalizedResolved.endsWith(normalizedPath);
        });

        if (targetNode) {
          console.log('Found target node:', targetNode[0]);
          edges.push({
            from: targetNode[0],
            to: node.path,
            type: 'import'
          });
        }
      });

      // Handle hook dependencies
      node.hooks?.forEach(hook => {
        hook.dependencies.forEach(dep => {
          const depNode = nodes.find(n =>
            n.exports.variables.includes(dep) ||
            n.exports.functions.includes(dep)
          );
          if (depNode) {
            edges.push({
              from: depNode.path,
              to: node.path,
              type: 'hook-dependency'
            });
          }
        });
      });

      // Handle HOC relationships
      node.hocs?.forEach(hoc => {
        const hocNode = nodes.find(n =>
          n.exports.functions.includes(hoc) ||
          n.exports.components.includes(hoc)
        );
        if (hocNode) {
          edges.push({
            from: hocNode.path,
            to: node.path,
            type: 'hoc'
          });
        }
      });
    });

    console.log('Generated edges:', edges);
    return edges;
  };

  const resolveImportPath = (currentPath: string, importPath: string): string => {
    console.log('currentPath', currentPath)
    console.log('importPath', importPath)
    if (importPath.startsWith('.')) {
      const currentDir = currentPath.split('/').slice(0, -1).join('/');
      const normalizedPath = importPath.replace(/\.(ts|tsx|js|jsx)$/, '');

      if (importPath.startsWith('./')) {
        return `${currentDir}/${normalizedPath.slice(2)}`;
      } else if (importPath.startsWith('../')) {
        let resolvedPath = currentDir;
        let remainingPath = normalizedPath;

        while (remainingPath.startsWith('../')) {
          resolvedPath = resolvedPath.split('/').slice(0, -1).join('/');
          remainingPath = remainingPath.slice(3);
        }

        return `${resolvedPath}/${remainingPath}`;
      }
    }
    return importPath;
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setDiagram(''); // Clear previous diagram
    
    try {
      console.log('Starting repository analysis');
      const limit = await checkRateLimit();
      console.log('Rate limit status:', limit);

      if (limit.remaining < 10) {
        throw new Error(`GitHub API rate limit low (${limit.remaining}/${limit.limit}). 
          Please wait until ${limit.resetTime.toLocaleTimeString()} or provide a GitHub token.`);
      }

      const { owner, repo } = parseRepoUrl(repoUrl);
      const files = await getRepoFiles(owner, repo);
      console.log('Files fetched:', files.length);

      // Filter and parse files
      const parsedNodes = files
        .filter(file => shouldParseFile(file.path))
        .map(file => parseTypeScript(file.content, file.path));
      console.log('Parsed nodes:', parsedNodes.length);

      // Generate edges between nodes
      const edges = generateEdges(parsedNodes);
      console.log('Generated edges:', edges.length);

      const data: DiagramData = {
        nodes: parsedNodes,
        edges,
      };

      setDiagramData(data);
      const newDiagram = generateMermaidDiagram(data, filters);
      console.log('Setting new diagram');
      setDiagram(newDiagram);
    } catch (error) {
      console.error('Error analyzing repository:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while analyzing the repository');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (diagramData) {
      const newDiagram = generateMermaidDiagram(diagramData, newFilters);
      setDiagram(newDiagram);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">GitHub Dependency Visualizer</h1>

      {rateLimit && (
        <div className="text-sm space-y-1">
          <div className={`${rateLimit.authenticated ? 'text-green-600' : 'text-red-600'}`}>
            Status: {rateLimit.authenticated ? 'Authenticated' : 'Not authenticated'}
          </div>
          <div className="text-gray-600">
            API Rate Limit: {rateLimit.remaining}/{rateLimit.limit} requests remaining
            {rateLimit.remaining < 20 && (
              <span className="text-red-500 ml-2">
                (Resets at {rateLimit.resetTime.toLocaleTimeString()})
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Input
          placeholder="Enter GitHub repository URL (e.g., owner/repo)"
          value={repoUrl}
          onChange={handleInputChange}
          className="max-w-xl"
        />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <MermaidRenderer 
        diagram={diagram}
        nodes={diagramData?.nodes || []}
        edges={diagramData?.edges || []}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
} 