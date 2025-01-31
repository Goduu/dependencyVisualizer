import { Octokit } from '@octokit/rest'
import { GitHubContent, FileContent, RepoInfo } from '@/src/types'

// Log the token presence (without exposing the actual token)
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN
console.log('GitHub Token configured:', !!token)

const octokit = new Octokit({
  auth: token,
  log: {
    debug: (msg: string) => console.debug(msg),
    info: (msg: string) => console.info(msg),
    warn: (msg: string) => console.warn(msg),
    error: (msg: string) => console.error(msg)
  }
})

// Add a function to verify authentication
export const verifyAuth = async (): Promise<boolean> => {
  try {
    const { data } = await octokit.users.getAuthenticated()
    console.log('Authenticated as:', data.login)
    return true
  } catch (error) {
    console.error('Authentication error:', error)
    return false
  }
}

export const parseRepoUrl = (url: string): RepoInfo => {
  // Handle both URL and owner/repo format
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/) || url.match(/^([^/]+)\/([^/]+)$/)
  if (!match) {
    throw new Error('Invalid repository format. Please use owner/repo or full GitHub URL')
  }
  return { owner: match[1], repo: match[2].replace('.git', '') }
}

export const getRepoFiles = async (owner: string, repo: string, path: string = ''): Promise<FileContent[]> => {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      headers: {
        'If-None-Match': '', // Bypass GitHub's cache
      },
    })

    if (Array.isArray(response.data)) {
      const files = await Promise.all(
        response.data.map(async (item) => {
          if (item.type === 'dir') {
            return getRepoFiles(owner, repo, item.path)
          }
          if (item.type === 'file') {
            const content = await octokit.repos.getContent({
              owner,
              repo,
              path: item.path,
              headers: {
                'If-None-Match': '', // Bypass GitHub's cache
              },
            })
            
            if ('content' in content.data) {
              return {
                path: item.path,
                content: Buffer.from(content.data.content, 'base64').toString(),
              }
            }
          }
          return []
        })
      )
      return files.flat().filter(Boolean) as FileContent[]
    }
    return []
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && 
        'message' in error && error.status === 403 && 
        typeof error.message === 'string' && 
        error.message.includes('API rate limit exceeded')) {
      throw new Error(
        'GitHub API rate limit exceeded. Please provide a GitHub token or wait a while.'
      )
    }
    console.error('Error fetching repository files:', error)
    throw error
  }
}

// Update checkRateLimit to include authentication status
export const checkRateLimit = async (): Promise<{
  remaining: number;
  limit: number;
  resetTime: Date;
  authenticated: boolean;
}> => {
  const { data } = await octokit.rateLimit.get()
  const isAuthenticated = await verifyAuth()
  
  return {
    remaining: data.rate.remaining,
    limit: data.rate.limit,
    resetTime: new Date(data.rate.reset * 1000),
    authenticated: isAuthenticated
  }
}

export async function getTsConfig(owner: string, repo: string): Promise<Record<string, string[]> | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/tsconfig.json`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log('No tsconfig.json found');
        return null;
      }
      throw new Error(`Failed to fetch tsconfig.json: ${response.statusText}`);
    }

    const tsConfig = await response.json();
    
    // Extract path mappings from compilerOptions
    const paths = tsConfig.compilerOptions?.paths || {};
    
    // Convert paths to our format
    const normalizedPaths: Record<string, string[]> = {};
    Object.entries(paths).forEach(([alias, targets]) => {
      // Ensure targets is an array
      const pathTargets = Array.isArray(targets) ? targets : [targets];
      // Remove ./* from the beginning of each target
      normalizedPaths[alias] = pathTargets.map(target => 
        target.replace(/^\.\//, '')
      );
    });

    return normalizedPaths;
  } catch (error) {
    console.error('Error fetching tsconfig.json:', error);
    return null;
  }
} 