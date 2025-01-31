import { useState, useEffect } from 'react'

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  html_url: string;
  updated_at: string;
}

export function useGithubRepos() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Check URL for access token on mount
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    // Fetch repositories when we have an access token
    const fetchRepos = async () => {
      if (!accessToken) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [accessToken]);

  const handleSearch = (value: string) => {
    setSearch(value.toLowerCase());
  };

  const filteredRepos = repos.filter(repo => 
    repo.full_name.toLowerCase().includes(search) ||
    repo.description?.toLowerCase().includes(search)
  );

  const connectToGithub = () => {
    window.location.href = `/api/auth/github`;
  };

  return {
    repos: filteredRepos,
    loading,
    search,
    accessToken,
    handleSearch,
    connectToGithub,
  };
}

export type { Repository }; 