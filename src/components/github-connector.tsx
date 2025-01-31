'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGithubRepos, Repository } from '@/src/hooks/useGithubRepos'

interface GithubConnectorProps {
  onSelectRepo: (repoUrl: string) => void;
}

export function GithubConnector({ onSelectRepo }: GithubConnectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    repos, 
    loading, 
    search, 
    accessToken, 
    handleSearch, 
    connectToGithub 
  } = useGithubRepos();

  const handleSelectRepo = (repo: Repository) => {
    onSelectRepo(repo.html_url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Github className="h-4 w-4" />
          Import from GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import from GitHub</DialogTitle>
          <DialogDescription>
            Select a repository to analyze its dependencies
          </DialogDescription>
        </DialogHeader>

        {!accessToken ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Github className="h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-500">Connect your GitHub account to get started</p>
            <Button onClick={connectToGithub} className="gap-2">
              <Github className="h-4 w-4" />
              Connect GitHub
            </Button>
          </div>
        ) : (
          <>
            <Input
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-[300px] pr-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : (
                <div className="space-y-2">
                  {repos.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => handleSelectRepo(repo)}
                      className="w-full p-4 text-left hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium">{repo.full_name}</div>
                      {repo.description && (
                        <div className="text-sm text-gray-500 truncate">
                          {repo.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 