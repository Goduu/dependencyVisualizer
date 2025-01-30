export interface FileNode {
  path: string;
  exports: {
    functions: string[];
    components: string[];
    variables: string[];
  };
  imports: {
    source: string;
    items: string[];
  }[];
  hooks?: {
    name: string;
    dependencies: string[];
  }[];
  hocs?: string[];
}

export interface DiagramData {
  nodes: FileNode[];
  edges: {
    from: string;
    to: string;
    type: 'import' | 'prop' | 'hook-dependency' | 'hoc';
  }[];
}

export interface SearchOptions {
  term: string;
  isCaseSensitive: boolean;
  isRegex: boolean;
}

export interface FilterState {
  showComponents: boolean;
  showHooks: boolean;
  showHOCs: boolean;
  showFunctions: boolean;
  showImports: boolean;
  showProps: boolean;
  showHookDeps: boolean;
  search: SearchOptions;
  currentPage: number;
}

export * from './github'; 