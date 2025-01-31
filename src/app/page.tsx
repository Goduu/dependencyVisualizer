'use client'

import { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MermaidRenderer from '@/src/components/mermaid-renderer'
import { GithubConnector } from '../components/github-connector'
import { useDiagramState } from '@/src/hooks/useDiagramState'
import { useGithubAnalysis } from '@/src/hooks/useGithubAnalysis'

export default function Home() {
  const {
    diagramData,
    setDiagramData,
    diagram,
    highlightedNodes,
    setHighlightedNodes,
    highlightedEdges,
    setHighlightedEdges,
    filters,
    handleFiltersChange,
    updateDiagram,
  } = useDiagramState()

  const {
    repoUrl,
    setRepoUrl,
    loading,
    error,
    rateLimit,
    analyzeRepository,
    checkGithubLimit,
  } = useGithubAnalysis()

  useEffect(() => {
    checkGithubLimit()
  }, [])

  useEffect(() => {
    updateDiagram()
  }, [highlightedNodes, highlightedEdges])

  const handleAnalyze = async () => {
    const data = await analyzeRepository()
    if (data) {
      setDiagramData(data)
      updateDiagram(data)
    }
  }

  return (
    <div className="space-y-8 w-full h-full">
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
        <GithubConnector onSelectRepo={setRepoUrl} />
        <Input
          placeholder="Enter GitHub repository URL (e.g., owner/repo)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
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
        filters={filters}
        onFiltersChange={handleFiltersChange}
        setHighlightedNodes={setHighlightedNodes}
        setHighlightedEdges={setHighlightedEdges}
      />
    </div>
  )
} 