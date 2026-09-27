const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    element => !element.hidden && element.offsetParent !== null,
  );
}

export function focusFirstWithin(container: HTMLElement): void {
  const first = focusableElements(container)[0];
  (first ?? container).focus({ preventScroll: true });
}

export function trapTabWithin(container: HTMLElement, event: KeyboardEvent): boolean {
  if (event.key !== 'Tab') return false;
  const elements = focusableElements(container);
  if (elements.length === 0) {
    event.preventDefault();
    container.focus({ preventScroll: true });
    return true;
  }

  const first = elements[0];
  const last = elements[elements.length - 1];
  const active = container.ownerDocument.activeElement;
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}
