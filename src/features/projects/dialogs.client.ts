/** Wires `[data-open-dialog]` buttons to native <dialog> elements. */
export function initDialogs(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-open-dialog]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.openDialog!) as HTMLDialogElement | null;
    if (!dialog) return;
    trigger.addEventListener('click', () => dialog.showModal());
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
    // Click on the backdrop (the dialog element itself) closes it.
    dialog.addEventListener('click', (event) => event.target === dialog && dialog.close());
  });
}
