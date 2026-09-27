export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    character =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character] ?? character,
  );
}

export function attr(value: string): string {
  return escapeHtml(value);
}

export function renderSwitchField(options: {
  role: string;
  checked: boolean;
  label: string;
}): string {
  return `<label class="wbm-switch-field">
    <span class="wbm-switch-copy">${escapeHtml(options.label)}</span>
    <input class="wbm-switch-input" type="checkbox" data-role="${attr(options.role)}"${
      options.checked ? ' checked' : ''
    }>
    <span class="wbm-switch-track" aria-hidden="true"><span class="wbm-switch-knob"></span></span>
  </label>`;
}

export function renderModeToggle(options: {
  action: string;
  pressed: boolean;
  idleLabel: string;
  activeLabel: string;
}): string {
  return `<button type="button" class="wbm-mode-toggle" data-action="${attr(options.action)}"
    aria-pressed="${options.pressed ? 'true' : 'false'}">
    ${escapeHtml(options.pressed ? options.activeLabel : options.idleLabel)}
  </button>`;
}
