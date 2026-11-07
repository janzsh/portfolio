const bound = new WeakSet<Element>();

/** Wires `[data-open-dialog]` buttons to native <dialog> elements. Safe to call from several islands. */
export function initDialogs(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-open-dialog]').forEach((trigger) => {
    if (bound.has(trigger)) return;
    const dialog = document.getElementById(trigger.dataset.openDialog!) as HTMLDialogElement | null;
    if (!dialog) return;
    bound.add(trigger);
    trigger.addEventListener('click', () => dialog.showModal());
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
    // Click on the backdrop (the dialog element itself) closes it.
    dialog.addEventListener('click', (event) => event.target === dialog && dialog.close());
  });
}
