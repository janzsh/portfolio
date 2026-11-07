import { matchesProject, setSelection, type FilterGroup, type FilterSelection } from '../../domain/project-filters';

/** Wires the filter selects to the project cards: hides non-matching cards, reports the count. */
export function initProjectFilters(): void {
  const root = document.querySelector<HTMLElement>('[data-project-filters]');
  if (!root) return;
  const cards = [...document.querySelectorAll<HTMLElement>('[data-project]')];
  const projects = cards.map((card) => ({
    searchSkills: (card.dataset.skills ?? '').split('|'),
    type: card.dataset.type ?? '',
    kind: card.dataset.kind ?? '',
  }));
  const frameworksOf: Record<string, string[]> = JSON.parse(root.dataset.frameworks ?? '{}');
  const selects = [...root.querySelectorAll<HTMLSelectElement>('select[data-filter-group]')];
  const frameworkSelect = selects.find((select) => select.dataset.filterGroup === 'framework');
  const status = root.querySelector<HTMLElement>('[data-filter-status]')!;
  const empty = root.querySelector<HTMLElement>('[data-filter-empty]')!;
  const reset = root.querySelector<HTMLButtonElement>('[data-filter-reset]')!;
  const allLabel = root.dataset.all ?? '';
  let selection: FilterSelection = {};

  // The framework list depends on the chosen language and stays disabled until there is one to choose from.
  const syncFrameworks = () => {
    if (!frameworkSelect) return;
    const options = frameworksOf[selection.language ?? ''] ?? [];
    frameworkSelect.replaceChildren(new Option(allLabel, ''), ...options.map((name) => new Option(name, name)));
    frameworkSelect.value = selection.framework ?? '';
    frameworkSelect.disabled = options.length === 0;
  };

  const render = () => {
    const visible = projects.map((project) => matchesProject(project, selection));
    cards.forEach((card, index) => (card.hidden = !visible[index]));
    const shown = visible.filter(Boolean).length;
    syncFrameworks();
    selects.forEach((select) => {
      if (select !== frameworkSelect) select.value = selection[select.dataset.filterGroup as FilterGroup] ?? '';
    });
    status.textContent = (root.dataset.countTemplate ?? '').replace('{shown}', String(shown)).replace('{total}', String(cards.length));
    empty.hidden = shown > 0;
    reset.hidden = Object.keys(selection).length === 0;
  };

  root.addEventListener('change', (event) => {
    const select = event.target as HTMLSelectElement;
    if (!select.dataset.filterGroup) return;
    selection = setSelection(selection, select.dataset.filterGroup as FilterGroup, select.value);
    render();
  });
  reset.addEventListener('click', () => {
    selection = {};
    render();
  });

  root.hidden = false;
  render();
}
