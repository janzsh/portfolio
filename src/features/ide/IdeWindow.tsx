import { useMemo, useReducer } from 'preact/hooks';
import type { UiStrings } from '../../i18n/ui';
import { CodeView } from './CodeView';
import { FileTree } from './FileTree';
import { IdeIcon } from './icons';
import { highlight } from './model/highlight';
import { flattenFiles } from './model/tree';
import type { Language, Workspace } from './model/types';
import { createInitialState, ideReducer } from './state';
import { openFileId, Tabs } from './Tabs';
import './ide.scss';

interface Props {
  workspace: Workspace;
  labels: UiStrings['ide'];
  locale: string;
}

const LANGUAGE_LABEL: Record<Language, string> = { json: 'JSON', markdown: 'Markdown' };

/** The career as a browsable repository: explorer, tabs, highlighted code and a status bar. */
export default function IdeWindow({ workspace, labels, locale }: Props) {
  const byId = useMemo(() => new Map(flattenFiles(workspace.root).map((file) => [file.id, file])), [workspace]);
  const [state, dispatch] = useReducer(ideReducer, undefined, () => createInitialState(workspace.root, workspace.initialFileId));

  const active = state.activeId ? byId.get(state.activeId) : undefined;
  const openFiles = state.openIds.flatMap((id) => byId.get(id) ?? []);
  const lines = useMemo(() => (active ? highlight(active.language, active.source) : []), [active]);

  return (
    <div class="ide">
      <div class="ide__titlebar">
        <IdeIcon name="logo" size="18px" class="ide__logo" />
        <p class="ide__title">{`${workspace.name}${active ? ` — ${active.name}` : ''}`}</p>
      </div>

      <div class="ide__body">
        <aside class="ide__sidebar" aria-label={labels.explorer}>
          <p class="ide__heading">{labels.explorer}</p>
          <p class="ide__root">{workspace.name}</p>
          <FileTree
            nodes={workspace.root}
            activeId={state.activeId}
            expanded={state.expanded}
            onToggle={(id) => dispatch({ type: 'toggle', id })}
            onOpen={(id) => dispatch({ type: 'open', id })}
          />
        </aside>

        <div class="ide__main">
          <Tabs
            files={openFiles}
            activeId={state.activeId}
            label={labels.openFiles}
            closeLabel={labels.closeFile}
            onSelect={(id) => dispatch({ type: 'open', id })}
            onClose={(id) => dispatch({ type: 'close', id })}
          />
          {active && <CodeView lines={lines} labelledBy={openFileId(active.id)} />}
        </div>
      </div>

      <footer class="ide__status">
        <p class="ide__status-group">
          <span class="ide__status-item">
            <IdeIcon name="branch" />
            main
          </span>
          <span class="ide__status-item">
            <i class="ide__dot" />
            {labels.openToWork}
          </span>
        </p>
        <p class="ide__status-group">
          <span class="ide__status-item">{active ? LANGUAGE_LABEL[active.language] : ''}</span>
          <span class="ide__status-item ide__status-item--optional">UTF-8</span>
          <span class="ide__status-item ide__status-item--optional">{locale.toUpperCase()}</span>
        </p>
      </footer>
    </div>
  );
}
