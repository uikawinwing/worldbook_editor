export const MANAGER_STYLES = `
body.wbm-lock-scroll {
  overflow: hidden !important;
}

#wbm-root {
  --wbm-bg: #11151b;
  --wbm-panel: #171c24;
  --wbm-panel-2: #1d2430;
  --wbm-border: rgba(255, 255, 255, 0.12);
  --wbm-text: #f1f5f9;
  --wbm-muted: #94a3b8;
  --wbm-accent: #4ea6c8;
  --wbm-accent-soft: rgba(78, 166, 200, 0.16);
  --wbm-danger: #ef6f6c;
  position: fixed;
  inset: 0;
  z-index: 200000;
  color: var(--wbm-text);
  background: var(--wbm-bg);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#wbm-root * {
  box-sizing: border-box;
}

#wbm-root button,
#wbm-root input,
#wbm-root select {
  font: inherit;
}

#wbm-root button {
  color: inherit;
}

#wbm-root .wbm-shell {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--wbm-bg);
}

#wbm-root .wbm-header {
  min-height: 64px;
  display: grid;
  grid-template-columns: auto minmax(170px, 1fr) minmax(220px, 520px) auto auto;
  gap: 10px;
  align-items: center;
  padding: max(10px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) 10px max(12px, env(safe-area-inset-left));
  border-bottom: 1px solid var(--wbm-border);
  background: var(--wbm-panel);
}

#wbm-root .wbm-title {
  min-width: 0;
  display: grid;
  gap: 2px;
}

#wbm-root .wbm-title strong {
  font-size: 16px;
}

#wbm-root .wbm-title span {
  color: var(--wbm-muted);
  font-size: 12px;
}

#wbm-root .wbm-icon-button,
#wbm-root .wbm-text-button,
#wbm-root .wbm-nav-button,
#wbm-root .wbm-chip,
#wbm-root .wbm-book-row {
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}

#wbm-root .wbm-icon-button,
#wbm-root .wbm-text-button {
  min-height: 44px;
  border-radius: 8px;
}

#wbm-root .wbm-icon-button {
  width: 44px;
  display: inline-grid;
  place-items: center;
  font-size: 21px;
}

#wbm-root .wbm-icon-button:hover,
#wbm-root .wbm-icon-button:focus-visible,
#wbm-root .wbm-text-button:hover,
#wbm-root .wbm-text-button:focus-visible,
#wbm-root .wbm-nav-button:hover,
#wbm-root .wbm-nav-button:focus-visible,
#wbm-root .wbm-chip:hover,
#wbm-root .wbm-chip:focus-visible,
#wbm-root .wbm-book-row:hover,
#wbm-root .wbm-book-row:focus-visible {
  background: rgba(255, 255, 255, 0.06);
  outline: none;
}

#wbm-root .wbm-search {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--wbm-border);
  border-radius: 9px;
  padding: 0 13px;
  color: var(--wbm-text);
  background: var(--wbm-bg);
  outline: none;
}

#wbm-root .wbm-search:focus {
  border-color: var(--wbm-accent);
}

#wbm-root .wbm-body {
  min-height: 0;
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
}

#wbm-root .wbm-sidebar {
  min-height: 0;
  overflow: auto;
  padding: 12px;
  border-right: 1px solid var(--wbm-border);
  background: var(--wbm-panel);
}

#wbm-root .wbm-sidebar-section + .wbm-sidebar-section {
  margin-top: 18px;
}

#wbm-root .wbm-section-heading {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 8px;
  color: var(--wbm-muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

#wbm-root .wbm-sidebar-list {
  display: grid;
  gap: 3px;
}

#wbm-root .wbm-nav-button {
  width: 100%;
  min-height: 44px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  text-align: left;
}

#wbm-root .wbm-nav-button.is-active {
  border-color: rgba(78, 166, 200, 0.35);
  background: var(--wbm-accent-soft);
}

#wbm-root .wbm-nav-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#wbm-root .wbm-count {
  min-width: 24px;
  color: var(--wbm-muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

#wbm-root .wbm-main {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto 1fr;
}

#wbm-root .wbm-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--wbm-border);
  background: var(--wbm-panel-2);
}

#wbm-root .wbm-toolbar-label {
  margin-right: auto;
  font-size: 14px;
  font-weight: 700;
}

#wbm-root .wbm-select {
  min-height: 38px;
  border: 1px solid var(--wbm-border);
  border-radius: 8px;
  padding: 0 10px;
  color: var(--wbm-text);
  background: var(--wbm-bg);
}

#wbm-root .wbm-bound-tabs,
#wbm-root .wbm-tags {
  display: flex;
  gap: 7px;
  align-items: center;
  overflow-x: auto;
  padding: 9px 14px;
  border-bottom: 1px solid var(--wbm-border);
  scrollbar-width: thin;
}

#wbm-root .wbm-bound-tabs[hidden],
#wbm-root .wbm-tags[hidden] {
  display: none;
}

#wbm-root .wbm-chip {
  flex: 0 0 auto;
  min-height: 36px;
  border: 1px solid var(--wbm-border);
  border-radius: 999px;
  padding: 0 11px;
  color: var(--wbm-muted);
  background: var(--wbm-panel);
}

#wbm-root .wbm-chip.is-active {
  color: var(--wbm-text);
  border-color: rgba(78, 166, 200, 0.5);
  background: var(--wbm-accent-soft);
}

#wbm-root .wbm-list {
  min-height: 0;
  overflow: auto;
  padding: 8px 14px max(18px, env(safe-area-inset-bottom));
}

#wbm-root .wbm-book-row {
  width: 100%;
  min-height: 66px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--wbm-border);
  text-align: left;
}

#wbm-root .wbm-book-main {
  min-width: 0;
  display: grid;
  gap: 5px;
}

#wbm-root .wbm-book-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}

#wbm-root .wbm-book-raw,
#wbm-root .wbm-meta-line,
#wbm-root .wbm-empty,
#wbm-root .wbm-sheet-note {
  color: var(--wbm-muted);
  font-size: 12px;
}

#wbm-root .wbm-book-raw {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#wbm-root .wbm-meta-line {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

#wbm-root .wbm-badge {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
}

#wbm-root .wbm-chevron {
  color: var(--wbm-muted);
  font-size: 20px;
}

#wbm-root .wbm-empty {
  padding: 42px 16px;
  text-align: center;
}

#wbm-root .wbm-sidebar-scrim {
  display: none;
}

#wbm-root .wbm-sheet-layer {
  position: fixed;
  inset: 0;
  z-index: 2;
  display: grid;
  justify-content: end;
  background: rgba(0, 0, 0, 0.48);
}

#wbm-root .wbm-sheet-layer[hidden] {
  display: none;
}

#wbm-root .wbm-sheet {
  width: min(440px, 100vw);
  height: 100%;
  overflow: auto;
  padding: 18px 18px max(20px, env(safe-area-inset-bottom));
  border-left: 1px solid var(--wbm-border);
  background: var(--wbm-panel);
}

#wbm-root .wbm-sheet-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
}

#wbm-root .wbm-sheet-title {
  min-width: 0;
}

#wbm-root .wbm-sheet-title h2 {
  margin: 0 0 4px;
  font-size: 18px;
  overflow-wrap: anywhere;
}

#wbm-root .wbm-field {
  display: grid;
  gap: 8px;
  margin: 18px 0;
}

#wbm-root .wbm-field > label,
#wbm-root .wbm-field > .wbm-field-label {
  font-size: 13px;
  font-weight: 700;
}

#wbm-root .wbm-checkbox-list {
  display: grid;
  gap: 7px;
}

#wbm-root .wbm-checkbox-row {
  min-height: 42px;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 6px 9px;
  border: 1px solid var(--wbm-border);
  border-radius: 8px;
}

#wbm-root .wbm-checkbox-row input {
  width: 18px;
  height: 18px;
}

#wbm-root .wbm-sheet-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin: 22px -18px -20px;
  padding: 12px 18px max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid var(--wbm-border);
  background: var(--wbm-panel);
}

#wbm-root .wbm-text-button {
  padding: 0 14px;
  border: 1px solid var(--wbm-border);
  background: var(--wbm-panel-2);
}

#wbm-root .wbm-text-button.is-primary {
  border-color: var(--wbm-accent);
  background: var(--wbm-accent);
  color: #071017;
  font-weight: 800;
}

#wbm-root .wbm-text-button.is-danger {
  border-color: rgba(239, 111, 108, 0.5);
  color: var(--wbm-danger);
}

#wbm-root .wbm-menu-button {
  display: none;
}

#wbm-root .is-busy {
  opacity: 0.62;
  pointer-events: none;
}

@media (max-width: 760px) {
  #wbm-root .wbm-header {
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    grid-template-areas:
      "menu title refresh close"
      "search search search search";
  }

  #wbm-root .wbm-menu-button {
    grid-area: menu;
    display: inline-grid;
  }

  #wbm-root .wbm-title {
    grid-area: title;
  }

  #wbm-root .wbm-search-wrap {
    grid-area: search;
  }

  #wbm-root [data-action="refresh"] {
    grid-area: refresh;
  }

  #wbm-root [data-action="close"] {
    grid-area: close;
  }

  #wbm-root .wbm-body {
    grid-template-columns: 1fr;
  }

  #wbm-root .wbm-sidebar {
    position: fixed;
    z-index: 3;
    inset: 0 auto 0 0;
    width: min(86vw, 320px);
    transform: translateX(-100%);
    transition: transform 150ms ease;
    box-shadow: 10px 0 26px rgba(0, 0, 0, 0.28);
    padding-top: max(12px, env(safe-area-inset-top));
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  #wbm-root.wbm-sidebar-open .wbm-sidebar {
    transform: translateX(0);
  }

  #wbm-root .wbm-sidebar-scrim {
    position: fixed;
    z-index: 2;
    inset: 0;
    border: 0;
    background: rgba(0, 0, 0, 0.46);
  }

  #wbm-root.wbm-sidebar-open .wbm-sidebar-scrim {
    display: block;
  }

  #wbm-root .wbm-toolbar {
    padding: 9px 10px;
  }

  #wbm-root .wbm-bound-tabs,
  #wbm-root .wbm-tags {
    padding-left: 10px;
    padding-right: 10px;
  }

  #wbm-root .wbm-list {
    padding-left: 6px;
    padding-right: 6px;
  }

  #wbm-root .wbm-book-row {
    padding-left: 10px;
    padding-right: 10px;
  }

  #wbm-root .wbm-sheet-layer {
    align-items: end;
    justify-content: stretch;
  }

  #wbm-root .wbm-sheet {
    width: 100%;
    height: min(78vh, 720px);
    border-left: 0;
    border-top: 1px solid var(--wbm-border);
    border-radius: 14px 14px 0 0;
  }
}
`;
