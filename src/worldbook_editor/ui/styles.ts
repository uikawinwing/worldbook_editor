export const MANAGER_STYLES = `
body.wbe-lock-scroll {
  overflow: hidden !important;
}

#wbe-root {
  --wbe-bg: #11151b;
  --wbe-panel: #171c24;
  --wbe-panel-2: #1d2430;
  --wbe-border: rgba(255, 255, 255, 0.12);
  --wbe-text: #f1f5f9;
  --wbe-muted: #94a3b8;
  --wbe-accent: #4ea6c8;
  --wbe-accent-soft: rgba(78, 166, 200, 0.16);
  --wbe-danger: #ef6f6c;
  position: fixed;
  inset: 0;
  z-index: 200000;
  color: var(--wbe-text);
  background: var(--wbe-bg);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#wbe-root * {
  box-sizing: border-box;
}

#wbe-root button,
#wbe-root input,
#wbe-root select {
  font: inherit;
}

#wbe-root button {
  color: inherit;
}

#wbe-root .wbe-shell {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--wbe-bg);
}

#wbe-root .wbe-header {
  min-height: 64px;
  display: grid;
  grid-template-columns: auto minmax(170px, 1fr) minmax(220px, 520px) auto auto;
  gap: 10px;
  align-items: center;
  padding: max(10px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) 10px max(12px, env(safe-area-inset-left));
  border-bottom: 1px solid var(--wbe-border);
  background: var(--wbe-panel);
}

#wbe-root .wbe-title {
  min-width: 0;
  display: grid;
  gap: 2px;
}

#wbe-root .wbe-title strong {
  font-size: 16px;
}

#wbe-root .wbe-title span {
  color: var(--wbe-muted);
  font-size: 12px;
}

#wbe-root .wbe-icon-button,
#wbe-root .wbe-text-button,
#wbe-root .wbe-nav-button,
#wbe-root .wbe-chip,
#wbe-root .wbe-book-row {
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}

#wbe-root .wbe-icon-button,
#wbe-root .wbe-text-button {
  min-height: 44px;
  border-radius: 8px;
}

#wbe-root .wbe-icon-button {
  width: 44px;
  display: inline-grid;
  place-items: center;
  font-size: 21px;
}

#wbe-root .wbe-icon-button:hover,
#wbe-root .wbe-icon-button:focus-visible,
#wbe-root .wbe-text-button:hover,
#wbe-root .wbe-text-button:focus-visible,
#wbe-root .wbe-nav-button:hover,
#wbe-root .wbe-nav-button:focus-visible,
#wbe-root .wbe-chip:hover,
#wbe-root .wbe-chip:focus-visible,
#wbe-root .wbe-book-row:hover,
#wbe-root .wbe-book-row:focus-visible {
  background: rgba(255, 255, 255, 0.06);
  outline: none;
}

#wbe-root .wbe-search {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--wbe-border);
  border-radius: 9px;
  padding: 0 13px;
  color: var(--wbe-text);
  background: var(--wbe-bg);
  outline: none;
}

#wbe-root .wbe-search:focus {
  border-color: var(--wbe-accent);
}

#wbe-root .wbe-body {
  min-height: 0;
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
}

#wbe-root .wbe-sidebar {
  min-height: 0;
  overflow: auto;
  padding: 12px;
  border-right: 1px solid var(--wbe-border);
  background: var(--wbe-panel);
}

#wbe-root .wbe-sidebar-section + .wbe-sidebar-section {
  margin-top: 18px;
}

#wbe-root .wbe-section-heading {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 8px;
  color: var(--wbe-muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

#wbe-root .wbe-sidebar-list {
  display: grid;
  gap: 3px;
}

#wbe-root .wbe-nav-button {
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

#wbe-root .wbe-nav-button.is-active {
  border-color: rgba(78, 166, 200, 0.35);
  background: var(--wbe-accent-soft);
}

#wbe-root .wbe-nav-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#wbe-root .wbe-count {
  min-width: 24px;
  color: var(--wbe-muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

#wbe-root .wbe-main {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto 1fr;
}

#wbe-root .wbe-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--wbe-border);
  background: var(--wbe-panel-2);
}

#wbe-root .wbe-toolbar-label {
  margin-right: auto;
  font-size: 14px;
  font-weight: 700;
}

#wbe-root .wbe-select {
  min-height: 38px;
  border: 1px solid var(--wbe-border);
  border-radius: 8px;
  padding: 0 10px;
  color: var(--wbe-text);
  background: var(--wbe-bg);
}

#wbe-root .wbe-bound-tabs,
#wbe-root .wbe-tags {
  display: flex;
  gap: 7px;
  align-items: center;
  overflow-x: auto;
  padding: 9px 14px;
  border-bottom: 1px solid var(--wbe-border);
  scrollbar-width: thin;
}

#wbe-root .wbe-bound-tabs[hidden],
#wbe-root .wbe-tags[hidden] {
  display: none;
}

#wbe-root .wbe-chip {
  flex: 0 0 auto;
  min-height: 36px;
  border: 1px solid var(--wbe-border);
  border-radius: 999px;
  padding: 0 11px;
  color: var(--wbe-muted);
  background: var(--wbe-panel);
}

#wbe-root .wbe-chip.is-active {
  color: var(--wbe-text);
  border-color: rgba(78, 166, 200, 0.5);
  background: var(--wbe-accent-soft);
}

#wbe-root .wbe-list {
  min-height: 0;
  overflow: auto;
  padding: 8px 14px max(18px, env(safe-area-inset-bottom));
}

#wbe-root .wbe-book-row {
  width: 100%;
  min-height: 66px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--wbe-border);
  text-align: left;
}

#wbe-root .wbe-book-main {
  min-width: 0;
  display: grid;
  gap: 5px;
}

#wbe-root .wbe-book-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}

#wbe-root .wbe-book-raw,
#wbe-root .wbe-meta-line,
#wbe-root .wbe-empty,
#wbe-root .wbe-sheet-note {
  color: var(--wbe-muted);
  font-size: 12px;
}

#wbe-root .wbe-book-raw {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#wbe-root .wbe-meta-line {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

#wbe-root .wbe-badge {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
}

#wbe-root .wbe-chevron {
  color: var(--wbe-muted);
  font-size: 20px;
}

#wbe-root .wbe-empty {
  padding: 42px 16px;
  text-align: center;
}

#wbe-root .wbe-sidebar-scrim {
  display: none;
}

#wbe-root .wbe-sheet-layer {
  position: fixed;
  inset: 0;
  z-index: 2;
  display: grid;
  justify-content: end;
  background: rgba(0, 0, 0, 0.48);
}

#wbe-root .wbe-sheet-layer[hidden] {
  display: none;
}

#wbe-root .wbe-sheet {
  width: min(440px, 100vw);
  height: 100%;
  overflow: auto;
  padding: 18px 18px max(20px, env(safe-area-inset-bottom));
  border-left: 1px solid var(--wbe-border);
  background: var(--wbe-panel);
}

#wbe-root .wbe-sheet-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
}

#wbe-root .wbe-sheet-title {
  min-width: 0;
}

#wbe-root .wbe-sheet-title h2 {
  margin: 0 0 4px;
  font-size: 18px;
  overflow-wrap: anywhere;
}

#wbe-root .wbe-field {
  display: grid;
  gap: 8px;
  margin: 18px 0;
}

#wbe-root .wbe-field > label,
#wbe-root .wbe-field > .wbe-field-label {
  font-size: 13px;
  font-weight: 700;
}

#wbe-root .wbe-checkbox-list {
  display: grid;
  gap: 7px;
}

#wbe-root .wbe-checkbox-row {
  min-height: 42px;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 6px 9px;
  border: 1px solid var(--wbe-border);
  border-radius: 8px;
}

#wbe-root .wbe-checkbox-row input {
  width: 18px;
  height: 18px;
}

#wbe-root .wbe-sheet-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin: 22px -18px -20px;
  padding: 12px 18px max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid var(--wbe-border);
  background: var(--wbe-panel);
}

#wbe-root .wbe-text-button {
  padding: 0 14px;
  border: 1px solid var(--wbe-border);
  background: var(--wbe-panel-2);
}

#wbe-root .wbe-text-button.is-primary {
  border-color: var(--wbe-accent);
  background: var(--wbe-accent);
  color: #071017;
  font-weight: 800;
}

#wbe-root .wbe-text-button.is-danger {
  border-color: rgba(239, 111, 108, 0.5);
  color: var(--wbe-danger);
}

#wbe-root .wbe-menu-button {
  display: none;
}

#wbe-root .is-busy {
  opacity: 0.62;
  pointer-events: none;
}

@media (max-width: 760px) {
  #wbe-root {
    --wbe-bg: #0d1218;
    --wbe-panel: #141b24;
    --wbe-panel-2: #18212c;
    -webkit-tap-highlight-color: transparent;
  }

  #wbe-root .wbe-shell {
    height: 100dvh;
  }

  #wbe-root button,
  #wbe-root input,
  #wbe-root select {
    touch-action: manipulation;
  }

  #wbe-root .wbe-header {
    min-height: 0;
    grid-template-columns: 44px minmax(0, 1fr) 44px 44px;
    grid-template-areas:
      "menu title refresh close"
      "search search search search";
    gap: 8px;
    padding:
      max(8px, env(safe-area-inset-top))
      max(10px, env(safe-area-inset-right))
      10px
      max(10px, env(safe-area-inset-left));
    background: var(--wbe-panel);
  }

  #wbe-root .wbe-menu-button {
    grid-area: menu;
    display: inline-grid;
  }

  #wbe-root .wbe-title {
    grid-area: title;
    gap: 0;
    padding-left: 2px;
  }

  #wbe-root .wbe-title strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    line-height: 1.2;
  }

  #wbe-root .wbe-title span {
    display: none;
  }

  #wbe-root .wbe-search-wrap {
    grid-area: search;
  }

  #wbe-root [data-action="refresh"] {
    grid-area: refresh;
  }

  #wbe-root [data-action="close"] {
    grid-area: close;
  }

  #wbe-root .wbe-icon-button {
    width: 44px;
    min-height: 44px;
    border-radius: 12px;
    color: var(--wbe-muted);
  }

  #wbe-root .wbe-icon-button:active,
  #wbe-root .wbe-text-button:active,
  #wbe-root .wbe-nav-button:active,
  #wbe-root .wbe-chip:active,
  #wbe-root .wbe-book-row:active {
    transform: scale(0.985);
    background: rgba(255, 255, 255, 0.08);
  }

  #wbe-root .wbe-search {
    min-height: 46px;
    border-radius: 12px;
    padding: 0 14px;
    background: #0b1016;
  }

  #wbe-root .wbe-body {
    grid-template-columns: 1fr;
  }

  #wbe-root .wbe-main {
    grid-template-rows: auto auto minmax(0, 1fr);
    background: var(--wbe-bg);
  }

  #wbe-root .wbe-toolbar {
    min-height: 54px;
    flex-wrap: nowrap;
    gap: 10px;
    padding: 8px 12px;
    background: var(--wbe-panel);
  }

  #wbe-root .wbe-toolbar-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    font-weight: 800;
  }

  #wbe-root .wbe-toolbar .wbe-select {
    width: 112px;
    min-width: 112px;
  }

  #wbe-root .wbe-select {
    min-height: 42px;
    border-radius: 11px;
    padding: 0 10px;
    background: #0b1016;
  }

  #wbe-root .wbe-bound-tabs,
  #wbe-root .wbe-tags {
    gap: 7px;
    padding: 8px 12px 10px;
    border-bottom: 1px solid var(--wbe-border);
    background: var(--wbe-panel);
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }

  #wbe-root .wbe-bound-tabs::-webkit-scrollbar,
  #wbe-root .wbe-tags::-webkit-scrollbar {
    display: none;
  }

  #wbe-root .wbe-chip {
    min-height: 38px;
    padding: 0 12px;
    border-radius: 999px;
    background: var(--wbe-panel-2);
  }

  #wbe-root .wbe-chip.is-active {
    color: #dff7ff;
    border-color: rgba(78, 166, 200, 0.62);
    background: rgba(78, 166, 200, 0.2);
  }

  #wbe-root .wbe-list {
    display: grid;
    align-content: start;
    gap: 8px;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding:
      10px
      max(10px, env(safe-area-inset-right))
      max(18px, env(safe-area-inset-bottom))
      max(10px, env(safe-area-inset-left));
    background: var(--wbe-bg);
  }

  #wbe-root .wbe-book-row {
    min-height: 76px;
    gap: 10px;
    padding: 12px 12px 11px;
    border: 1px solid var(--wbe-border);
    border-radius: 13px;
    background: var(--wbe-panel);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.18);
  }

  #wbe-root .wbe-book-main {
    gap: 6px;
  }

  #wbe-root .wbe-book-name {
    font-size: 14px;
    line-height: 1.35;
  }

  #wbe-root .wbe-book-raw {
    font-size: 11px;
  }

  #wbe-root .wbe-meta-line {
    gap: 5px;
  }

  #wbe-root .wbe-badge {
    min-height: 21px;
    padding: 1px 7px;
    font-size: 11px;
    background: rgba(255, 255, 255, 0.065);
  }

  #wbe-root .wbe-chevron {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
  }

  #wbe-root .wbe-empty {
    align-self: center;
    padding: 48px 20px;
    border: 1px dashed var(--wbe-border);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.02);
  }

  #wbe-root .wbe-sidebar {
    position: fixed;
    z-index: 4;
    inset: 0 auto 0 0;
    width: min(90vw, 340px);
    transform: translateX(-102%);
    transition: transform 170ms ease;
    overscroll-behavior: contain;
    padding:
      max(18px, env(safe-area-inset-top))
      12px
      max(18px, env(safe-area-inset-bottom));
    border-right: 1px solid var(--wbe-border);
    background: var(--wbe-panel);
    box-shadow: 18px 0 44px rgba(0, 0, 0, 0.38);
  }

  #wbe-root.wbe-sidebar-open .wbe-sidebar {
    transform: translateX(0);
  }

  #wbe-root .wbe-sidebar-section + .wbe-sidebar-section {
    margin-top: 24px;
  }

  #wbe-root .wbe-section-heading {
    min-height: 40px;
    padding: 0 8px;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  #wbe-root .wbe-section-heading .wbe-text-button {
    min-width: 40px;
    min-height: 40px;
    padding: 0 10px;
    border-radius: 10px;
  }

  #wbe-root .wbe-sidebar-list {
    gap: 6px;
  }

  #wbe-root .wbe-nav-button {
    min-height: 50px;
    padding: 10px 12px;
    border-radius: 12px;
    font-size: 14px;
  }

  #wbe-root .wbe-nav-button.is-active {
    border-color: rgba(78, 166, 200, 0.46);
    background: rgba(78, 166, 200, 0.18);
  }

  #wbe-root .wbe-count {
    min-width: 28px;
    padding: 2px 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.055);
    text-align: center;
  }

  #wbe-root .wbe-sidebar-scrim {
    position: fixed;
    z-index: 3;
    inset: 0;
    border: 0;
    background: rgba(0, 0, 0, 0.58);
    backdrop-filter: blur(2px);
  }

  #wbe-root.wbe-sidebar-open .wbe-sidebar-scrim {
    display: block;
  }

  #wbe-root .wbe-sheet-layer {
    z-index: 5;
    align-items: end;
    justify-content: stretch;
    background: rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(2px);
  }

  #wbe-root .wbe-sheet {
    position: relative;
    width: 100%;
    height: auto;
    max-height: min(86dvh, 760px);
    padding: 26px 16px max(20px, env(safe-area-inset-bottom));
    border: 0;
    border-top: 1px solid var(--wbe-border);
    border-radius: 20px 20px 0 0;
    background: var(--wbe-panel);
    box-shadow: 0 -18px 50px rgba(0, 0, 0, 0.34);
  }

  #wbe-root .wbe-sheet::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 50%;
    width: 42px;
    height: 4px;
    border-radius: 999px;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.2);
  }

  #wbe-root .wbe-sheet-header {
    margin-bottom: 12px;
  }

  #wbe-root .wbe-sheet-title h2 {
    font-size: 17px;
    line-height: 1.35;
  }

  #wbe-root .wbe-field {
    gap: 9px;
    margin: 16px 0;
  }

  #wbe-root .wbe-field > label,
  #wbe-root .wbe-field > .wbe-field-label {
    font-size: 13px;
  }

  #wbe-root .wbe-checkbox-list {
    gap: 8px;
  }

  #wbe-root .wbe-checkbox-row {
    min-height: 48px;
    padding: 8px 11px;
    border-radius: 11px;
    background: var(--wbe-panel-2);
  }

  #wbe-root .wbe-checkbox-row input {
    width: 20px;
    height: 20px;
  }

  #wbe-root .wbe-sheet-actions {
    gap: 10px;
    margin: 20px -16px -20px;
    padding:
      12px 16px
      max(12px, env(safe-area-inset-bottom));
  }

  #wbe-root .wbe-sheet-actions .wbe-text-button {
    flex: 1 1 0;
    min-height: 48px;
    border-radius: 12px;
  }
}

@media (max-width: 420px) {
  #wbe-root .wbe-header {
    grid-template-columns: 42px minmax(0, 1fr) 42px 42px;
  }

  #wbe-root .wbe-icon-button {
    width: 42px;
    min-height: 42px;
  }

  #wbe-root .wbe-toolbar {
    gap: 8px;
  }

  #wbe-root .wbe-toolbar .wbe-select {
    width: 104px;
    min-width: 104px;
    font-size: 13px;
  }

  #wbe-root .wbe-book-row {
    min-height: 72px;
    padding: 11px;
  }
}
`;