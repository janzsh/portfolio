import { IdeIcon } from './icons';
import type { IdeNode } from './model/types';

interface Props {
  nodes: readonly IdeNode[];
  activeId: string | undefined;
  expanded: readonly string[];
  onToggle: (folderId: string) => void;
  onOpen: (fileId: string) => void;
  depth?: number;
}

/** Explorer tree: folders are disclosure buttons, files are buttons. */
export function FileTree({ nodes, activeId, expanded, onToggle, onOpen, depth = 0 }: Props) {
  return (
    <ul class="ide__tree">
      {nodes.map((node) => {
        if (node.kind === 'folder') {
          const open = expanded.includes(node.id);
          return (
            <li key={node.id}>
              <button type="button" class="ide__row" style={`--depth:${depth}`} aria-expanded={open} onClick={() => onToggle(node.id)}>
                <IdeIcon name={open ? 'down-arrow' : 'right-arrow'} class="ide__chevron" />
                <IdeIcon name="folder" class="ide__folder" />
                {node.name}
              </button>
              {open && <FileTree nodes={node.children} activeId={activeId} expanded={expanded} onToggle={onToggle} onOpen={onOpen} depth={depth + 1} />}
            </li>
          );
        }
        const active = activeId === node.id;
        return (
          <li key={node.id}>
            <button
              type="button"
              class={`ide__row${active ? ' ide__row--active' : ''}`}
              style={`--depth:${depth}`}
              aria-current={active ? 'true' : undefined}
              onClick={() => onOpen(node.id)}
            >
              <span class="ide__spacer" />
              <IdeIcon name={node.icon} class="ide__file" />
              {node.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
