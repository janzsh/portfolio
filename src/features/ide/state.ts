import { ancestorFolderIds, defaultOpenFolderIds } from './model/tree';
import type { IdeNode } from './model/types';

/** Open tabs at once; opening one more evicts the oldest (FIFO). */
export const MAX_TABS = 3;

export interface IdeState {
  openIds: string[];
  activeId: string | undefined;
  /** Opened again whenever the last tab closes, so the editor is never empty. */
  fallbackId: string;
  /** Ids of the expanded folders. */
  expanded: string[];
}

export type IdeAction = { type: 'open'; id: string } | { type: 'close'; id: string } | { type: 'toggle'; id: string };

const withIds = (current: string[], more: string[]): string[] => [...new Set([...current, ...more])];

export const createInitialState = (root: readonly IdeNode[], initialFileId: string): IdeState => ({
  openIds: [initialFileId],
  activeId: initialFileId,
  fallbackId: initialFileId,
  expanded: withIds(defaultOpenFolderIds(root), ancestorFolderIds(initialFileId)),
});

export function ideReducer(state: IdeState, action: IdeAction): IdeState {
  switch (action.type) {
    case 'open': {
      const openIds = state.openIds.includes(action.id) ? state.openIds : [...state.openIds, action.id].slice(-MAX_TABS);
      return { ...state, openIds, activeId: action.id, expanded: withIds(state.expanded, ancestorFolderIds(action.id)) };
    }
    case 'close': {
      const index = state.openIds.indexOf(action.id);
      if (index < 0) return state;
      const remaining = state.openIds.filter((id) => id !== action.id);
      const openIds = remaining.length > 0 ? remaining : [state.fallbackId];
      const activeId = state.activeId === action.id ? openIds[Math.max(0, index - 1)] : state.activeId;
      return { ...state, openIds, activeId };
    }
    case 'toggle':
      return {
        ...state,
        expanded: state.expanded.includes(action.id) ? state.expanded.filter((id) => id !== action.id) : [...state.expanded, action.id],
      };
  }
}
