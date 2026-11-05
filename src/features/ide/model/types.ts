export type TokenKind = 'key' | 'string' | 'number' | 'literal' | 'punct' | 'heading' | 'bold' | 'code' | 'text' | 'muted';
export interface Token {
  kind: TokenKind;
  text: string;
}
export interface Line {
  indent: number;
  tokens: Token[];
}

export type Language = 'json' | 'markdown';

export interface IdeFile {
  kind: 'file';
  /** Unique path, e.g. `experience/igd.json`. */
  id: string;
  name: string;
  language: Language;
  /** Icon name, one of those bundled for the IDE (see icons.ts). */
  icon: string;
  /** Plain text; highlighting happens in the browser, so the page ships text, not tokens. */
  source: string;
}

export interface IdeFolder {
  kind: 'folder';
  /** Path of the folder; a file's id starts with its folder's id. */
  id: string;
  name: string;
  children: IdeNode[];
  defaultOpen: boolean;
}

export type IdeNode = IdeFile | IdeFolder;

export interface Workspace {
  name: string;
  root: IdeNode[];
  initialFileId: string;
}
