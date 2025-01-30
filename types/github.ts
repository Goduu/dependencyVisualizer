export interface GitHubContent {
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  content?: string;
  encoding?: string;
}

export interface RepoInfo {
  owner: string;
  repo: string;
}

export interface FileContent {
  path: string;
  content: string;
} 