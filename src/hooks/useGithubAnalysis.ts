import { useState } from 'react'
import { parseRepoUrl, getRepoFiles, checkRateLimit, getTsConfig } from '@/src/services/github'
import { parseTypeScript, shouldParseFile } from '@/src/services/parser'
import { DiagramData, FileNode } from '@/src/types'

interface RateLimit {
    remaining: number
    limit: number
    resetTime: Date
    authenticated: boolean
}

export function useGithubAnalysis() {
    const [repoUrl, setRepoUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rateLimit, setRateLimit] = useState<RateLimit | null>(null)
    const [pathAliases, setPathAliases] = useState<Record<string, string[]>>({});

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

    const generateEdges = (nodes: FileNode[]) => {
        const edges: DiagramData['edges'] = [];
        const nodesByPath = new Map(nodes.map(node => [node.path, node]));

        const resolveAliasPath = (importPath: string): string => {
            const normalizedPath = importPath.replace(/\.(ts|tsx|js|jsx)$/, '');

            for (const [alias, paths] of Object.entries(pathAliases)) {
                const aliasPattern = alias.replace('*', '(.*)');
                const match = normalizedPath.match(new RegExp(`^${aliasPattern}$`));

                if (match) {
                    const [, rest] = match;
                    const replacement = paths[0].replace('*', rest);
                    return replacement.replace(/^\.\//, '');
                }
            }

            return normalizedPath;
        };

        nodes.forEach(node => {
            node.imports.forEach(imp => {
                let resolvedPath = imp.source;
                console.log('Processing import:', { from: node.path, import: imp.source });

                if (imp.source.startsWith('.')) {
                    resolvedPath = resolveImportPath(node.path, imp.source);
                }
                else if (imp.source.startsWith('@/')) {
                    resolvedPath = resolveAliasPath(imp.source);
                }

                console.log('Resolved path:', resolvedPath);

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

            node.props?.forEach(prop => {
                const targetNode = nodes.find(n => 
                    n.exports.components.includes(prop.to)
                );

                if (targetNode) {
                    edges.push({
                        from: node.path,
                        to: targetNode.path,
                        type: 'prop',
                        label: `${prop.from} → ${prop.to}: ${prop.propName}`,
                        name: prop.propName
                    });
                }
            });
        });

        console.log('Generated edges:', edges);
        return edges;
    };

    const analyzeRepository = async () => {
        setLoading(true)
        setError(null)

        try {
            const limit = await checkRateLimit()
            console.log('Rate limit status:', limit)

            if (limit.remaining < 10) {
                throw new Error(`GitHub API rate limit low (${limit.remaining}/${limit.limit}). 
          Please wait until ${limit.resetTime.toLocaleTimeString()} or provide a GitHub token.`)
            }

            const { owner, repo } = parseRepoUrl(repoUrl)
            const configPaths = await getTsConfig(owner, repo);
            if (configPaths) {
                setPathAliases(configPaths);
            }

            const files = await getRepoFiles(owner, repo)

            const parsedNodes = files
                .filter(file => shouldParseFile(file.path))
                .map(file => parseTypeScript(file.content, file.path))

            const edges = generateEdges(parsedNodes)

            return {
                nodes: parsedNodes,
                edges,
            } as DiagramData

        } catch (error) {
            console.error('Error analyzing repository:', error)
            setError(error instanceof Error ? error.message : 'An error occurred while analyzing the repository')
            return null
        } finally {
            setLoading(false)
        }
    }

    const checkGithubLimit = async () => {
        try {
            const limit = await checkRateLimit()
            setRateLimit(limit)
        } catch (error) {
            console.error('Error checking rate limit:', error)
        }
    }

    return {
        repoUrl,
        setRepoUrl,
        loading,
        error,
        rateLimit,
        analyzeRepository,
        checkGithubLimit,
    }
} 