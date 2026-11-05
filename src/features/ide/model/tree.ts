import type { IdeFile, IdeNode } from './types';

export const flattenFiles = (nodes: readonly IdeNode[]): IdeFile[] =>
  nodes.flatMap((node) => (node.kind === 'file' ? [node] : flattenFiles(node.children)));

/** `a/b/c.md` -> [`a`, `a/b`]: the folders that must be open for the file to be visible. */
export const ancestorFolderIds = (fileId: string): string[] => {
  const folders = fileId.split('/').slice(0, -1);
  return folders.map((_, index) => folders.slice(0, index + 1).join('/'));
};

/** Folders that start expanded. */
export const defaultOpenFolderIds = (nodes: readonly IdeNode[]): string[] =>
  nodes.flatMap((node) => (node.kind === 'folder' ? [...(node.defaultOpen ? [node.id] : []), ...defaultOpenFolderIds(node.children)] : []));
