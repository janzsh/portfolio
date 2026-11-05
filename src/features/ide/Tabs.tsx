import { IdeIcon } from './icons';
import type { IdeFile } from './model/types';

/** Id of the control that opens a file, used to name the code region it shows. */
export const openFileId = (fileId: string) => `ide-open-${fileId}`;

interface Props {
  files: readonly IdeFile[];
  activeId: string | undefined;
  label: string;
  closeLabel: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

/**
 * Open files as a list of buttons. It is deliberately not a WAI-ARIA tablist: tabs may not
 * contain other controls, and every file here also needs its own close button.
 */
export function Tabs({ files, activeId, label, closeLabel, onSelect, onClose }: Props) {
  return (
    <ul class="ide__tabs" aria-label={label}>
      {files.map((file) => {
        const active = activeId === file.id;
        return (
          <li key={file.id} class={`ide__tab${active ? ' ide__tab--active' : ''}`}>
            <button type="button" id={openFileId(file.id)} class="ide__tab-label" aria-current={active ? 'true' : undefined} onClick={() => onSelect(file.id)}>
              <IdeIcon name={file.icon} class="ide__file" />
              {file.name}
            </button>
            <button type="button" class="ide__tab-close" aria-label={`${closeLabel} ${file.name}`} onClick={() => onClose(file.id)}>
              <IdeIcon name="close" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
