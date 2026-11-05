import { describe, expect, it } from 'vitest';
import { MAX_TABS, createInitialState, ideReducer, type IdeState } from './state';
import type { IdeNode } from './model/types';

const file = (id: string): IdeNode => ({ kind: 'file', id, name: id.split('/').pop()!, language: 'json', icon: 'braces', source: '' });
const root: IdeNode[] = [
  { kind: 'folder', id: 'experience', name: 'experience', defaultOpen: true, children: [file('experience/a.json'), file('experience/b.json')] },
  { kind: 'folder', id: 'projects', name: 'projects', defaultOpen: false, children: [file('projects/x.md')] },
  file('README.md'),
];
const start = (): IdeState => createInitialState(root, 'README.md');

describe('createInitialState', () => {
  it('opens the initial file and the folders marked as open by default', () => {
    const state = start();
    expect(state.openIds).toEqual(['README.md']);
    expect(state.activeId).toBe('README.md');
    expect(state.expanded).toEqual(['experience']);
  });

  it('also expands the folder holding the initial file', () => {
    expect(createInitialState(root, 'projects/x.md').expanded).toContain('projects');
  });
});

describe('open', () => {
  it('opens a file in a new tab, activates it and reveals its folder', () => {
    const state = ideReducer(start(), { type: 'open', id: 'projects/x.md' });
    expect(state.openIds).toEqual(['README.md', 'projects/x.md']);
    expect(state.activeId).toBe('projects/x.md');
    expect(state.expanded).toContain('projects');
  });

  it('only activates a file that is already open', () => {
    const opened = ideReducer(start(), { type: 'open', id: 'experience/a.json' });
    const again = ideReducer(opened, { type: 'open', id: 'README.md' });
    expect(again.openIds).toEqual(['README.md', 'experience/a.json']);
    expect(again.activeId).toBe('README.md');
  });

  it(`never keeps more than ${MAX_TABS} tabs, evicting the oldest first`, () => {
    let state = start();
    for (const id of ['experience/a.json', 'experience/b.json', 'projects/x.md']) state = ideReducer(state, { type: 'open', id });
    expect(state.openIds).toEqual(['experience/a.json', 'experience/b.json', 'projects/x.md']);
    expect(state.activeId).toBe('projects/x.md');
  });
});

describe('close', () => {
  const three = (): IdeState =>
    ['experience/a.json', 'experience/b.json'].reduce((s, id) => ideReducer(s, { type: 'open', id }), start());

  it('activates the tab to the left when the active one closes', () => {
    const state = ideReducer(three(), { type: 'close', id: 'experience/b.json' });
    expect(state.openIds).toEqual(['README.md', 'experience/a.json']);
    expect(state.activeId).toBe('experience/a.json');
  });

  it('activates the first remaining tab when the leftmost active tab closes', () => {
    const state = ideReducer(ideReducer(three(), { type: 'open', id: 'README.md' }), { type: 'close', id: 'README.md' });
    expect(state.activeId).toBe('experience/a.json');
  });

  it('keeps the active tab when another one closes', () => {
    const state = ideReducer(three(), { type: 'close', id: 'README.md' });
    expect(state.activeId).toBe('experience/b.json');
  });

  it('leaves nothing active when the last tab closes', () => {
    const state = ideReducer(start(), { type: 'close', id: 'README.md' });
    expect(state.openIds).toEqual([]);
    expect(state.activeId).toBeUndefined();
  });
});

describe('toggleFolder', () => {
  it('expands and collapses a folder', () => {
    const open = ideReducer(start(), { type: 'toggle', id: 'projects' });
    expect(open.expanded).toContain('projects');
    expect(ideReducer(open, { type: 'toggle', id: 'projects' }).expanded).not.toContain('projects');
  });
});
