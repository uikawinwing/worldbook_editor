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
  width: 100%;
  height: 100dvh;
  overflow: hidden;
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
#wbm-root select,
#wbm-root textarea {
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
  margin: 0;
  padding: 0;
  line-height: 1;
  font-size: 21px;
}

#wbm-root .wbm-menu-glyph {
  position: relative;
  width: 20px;
  height: 14px;
  display: block;
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 100% 2px;
  background-position: center;
  background-repeat: no-repeat;
}

#wbm-root .wbm-menu-glyph::before,
#wbm-root .wbm-menu-glyph::after {
  content: "";
  position: absolute;
  left: 0;
  width: 20px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

#wbm-root .wbm-menu-glyph::before {
  top: 0;
}

#wbm-root .wbm-menu-glyph::after {
  bottom: 0;
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

#wbm-root .wbm-input,
#wbm-root .wbm-textarea {
  width: 100%;
  border: 1px solid var(--wbm-border);
  border-radius: 8px;
  padding: 9px 10px;
  color: var(--wbm-text);
  background: var(--wbm-bg);
  outline: none;
}

#wbm-root .wbm-input:focus,
#wbm-root .wbm-textarea:focus {
  border-color: var(--wbm-accent);
}

#wbm-root .wbm-textarea {
  min-height: 96px;
  resize: vertical;
}

#wbm-root .wbm-content-editor {
  min-height: 220px;
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

#wbm-root .wbm-inline-toggle {
  margin: 12px 0;
}

#wbm-root .wbm-entry-section,
#wbm-root .wbm-organize-section {
  margin-top: 12px;
}

#wbm-root .wbm-organize-section {
  margin-top: 26px;
  padding-top: 8px;
  border-top: 1px solid var(--wbm-border);
}

#wbm-root .wbm-entry-heading {
  padding: 0;
}

#wbm-root .wbm-entry-list {
  display: grid;
  gap: 6px;
}

#wbm-root .wbm-entry-row {
  width: 100%;
  min-height: 58px;
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  border: 1px solid var(--wbm-border);
  border-radius: 10px;
  padding: 9px 10px;
  color: inherit;
  background: var(--wbm-panel-2);
  text-align: left;
  cursor: pointer;
}

#wbm-root .wbm-entry-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--wbm-muted);
}

#wbm-root .wbm-entry-status.is-enabled {
  background: var(--wbm-accent);
}

#wbm-root .wbm-entry-main {
  min-width: 0;
  display: grid;
  gap: 4px;
}

#wbm-root .wbm-entry-main strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#wbm-root .wbm-back-button {
  min-height: 40px;
  border: 0;
  padding: 0;
  color: var(--wbm-accent);
  background: transparent;
  cursor: pointer;
}

#wbm-root .wbm-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

#wbm-root .wbm-field-grid-three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

#wbm-root .wbm-menu-button,
#wbm-root .wbm-mobile-sidebar-actions {
  display: none;
}

#wbm-root .is-busy {
  opacity: 0.62;
  pointer-events: none;
}

@media (max-width: 760px) {
  #wbm-root {
    --wbm-bg: #0d1218;
    --wbm-panel: #141b24;
    --wbm-panel-2: #18212c;
    -webkit-tap-highlight-color: transparent;
  }

  #wbm-root .wbm-shell {
    height: 100dvh;
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
  }

  #wbm-root button,
  #wbm-root input,
  #wbm-root select,
  #wbm-root textarea {
    touch-action: manipulation;
  }

  #wbm-root .wbm-header {
    min-height: 0;
    grid-template-columns: 44px minmax(0, 1fr) 44px;
    grid-template-areas:
      "menu title close"
      "search search search";
    gap: 6px 8px;
    padding:
      max(6px, env(safe-area-inset-top))
      max(10px, env(safe-area-inset-right))
      8px
      max(10px, env(safe-area-inset-left));
    border-bottom: 1px solid var(--wbm-border);
    background: var(--wbm-panel);
  }

  #wbm-root .wbm-menu-button {
    grid-area: menu;
    display: inline-grid;
    align-self: center;
    justify-self: start;
    position: relative;
    z-index: 1;
    overflow: visible;
    pointer-events: auto;
  }

  #wbm-root .wbm-title {
    grid-area: title;
    gap: 0;
    padding-left: 2px;
  }

  #wbm-root .wbm-title strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    line-height: 1.2;
  }

  #wbm-root .wbm-title span {
    display: none;
  }

  #wbm-root .wbm-search-wrap {
    grid-area: search;
  }

  #wbm-root .wbm-header [data-action="refresh"] {
    display: none;
  }

  #wbm-root .wbm-mobile-sidebar-actions {
    display: block;
  }

  #wbm-root [data-action="close"] {
    grid-area: close;
  }

  #wbm-root .wbm-icon-button {
    width: 44px;
    min-height: 44px;
    border-radius: 12px;
    color: var(--wbm-muted);
  }

  #wbm-root .wbm-icon-button:active,
  #wbm-root .wbm-text-button:active,
  #wbm-root .wbm-nav-button:active,
  #wbm-root .wbm-chip:active,
  #wbm-root .wbm-book-row:active {
    transform: scale(0.985);
    background: rgba(255, 255, 255, 0.08);
  }

  #wbm-root .wbm-search {
    min-height: 42px;
    border-radius: 10px;
    padding: 0 12px;
    font-size: 16px;
    background: #0b1016;
  }

  #wbm-root .wbm-body {
    min-height: 0;
    grid-template-columns: 1fr;
    overflow: hidden;
  }

  #wbm-root .wbm-main {
    min-height: 0;
    grid-template-rows: auto auto minmax(0, 1fr);
    overflow: hidden;
    background: var(--wbm-bg);
  }

  #wbm-root .wbm-toolbar {
    min-height: 46px;
    flex-wrap: nowrap;
    gap: 8px;
    padding: 5px 10px;
    background: var(--wbm-panel);
  }

  #wbm-root .wbm-toolbar-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 800;
  }

  #wbm-root .wbm-toolbar .wbm-select {
    width: 96px;
    min-width: 96px;
  }

  #wbm-root .wbm-select {
    min-height: 42px;
    border-radius: 11px;
    padding: 0 10px;
    background: #0b1016;
  }

  #wbm-root .wbm-bound-tabs,
  #wbm-root .wbm-tags {
    gap: 6px;
    min-height: 40px;
    padding: 4px 10px;
    border-bottom: 1px solid var(--wbm-border);
    background: var(--wbm-panel);
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }

  #wbm-root .wbm-bound-tabs::-webkit-scrollbar,
  #wbm-root .wbm-tags::-webkit-scrollbar {
    display: none;
  }

  #wbm-root .wbm-chip {
    min-height: 32px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 12px;
    background: var(--wbm-panel-2);
  }

  #wbm-root .wbm-tags .wbm-book-raw {
    display: none;
  }

  #wbm-root .wbm-chip.is-active {
    color: #dff7ff;
    border-color: rgba(78, 166, 200, 0.62);
    background: rgba(78, 166, 200, 0.2);
  }

  #wbm-root .wbm-list {
    display: grid;
    align-content: start;
    gap: 5px;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding:
      6px
      max(8px, env(safe-area-inset-right))
      max(14px, env(safe-area-inset-bottom))
      max(8px, env(safe-area-inset-left));
    background: var(--wbm-bg);
  }

  #wbm-root .wbm-book-row {
    min-height: 60px;
    gap: 8px;
    padding: 8px 10px;
    border: 1px solid var(--wbm-border);
    border-radius: 10px;
    background: var(--wbm-panel);
    box-shadow: none;
  }

  #wbm-root .wbm-book-main {
    gap: 4px;
  }

  #wbm-root .wbm-book-name {
    font-size: 14px;
    line-height: 1.35;
  }

  #wbm-root .wbm-book-raw {
    font-size: 11px;
  }

  #wbm-root .wbm-meta-line {
    gap: 5px;
  }

  #wbm-root .wbm-badge {
    min-height: 21px;
    padding: 1px 7px;
    font-size: 11px;
    background: rgba(255, 255, 255, 0.065);
  }

  #wbm-root .wbm-chevron {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
  }

  #wbm-root .wbm-empty {
    align-self: center;
    padding: 48px 20px;
    border: 1px dashed var(--wbm-border);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.02);
  }

  #wbm-root .wbm-sidebar {
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
    border-right: 1px solid var(--wbm-border);
    background: var(--wbm-panel);
    box-shadow: 18px 0 44px rgba(0, 0, 0, 0.38);
  }

  #wbm-root.wbm-sidebar-open .wbm-sidebar {
    transform: translateX(0);
  }

  #wbm-root .wbm-sidebar-section + .wbm-sidebar-section {
    margin-top: 24px;
  }

  #wbm-root .wbm-section-heading {
    min-height: 40px;
    padding: 0 8px;
    font-size: 12px;
    letter-spacing: 0.02em;
  }

  #wbm-root .wbm-section-heading .wbm-text-button {
    min-width: 40px;
    min-height: 40px;
    padding: 0 10px;
    border-radius: 10px;
  }

  #wbm-root .wbm-sidebar-list {
    gap: 6px;
  }

  #wbm-root .wbm-nav-button {
    min-height: 50px;
    padding: 10px 12px;
    border-radius: 12px;
    font-size: 14px;
  }

  #wbm-root .wbm-nav-button.is-active {
    border-color: rgba(78, 166, 200, 0.46);
    background: rgba(78, 166, 200, 0.18);
  }

  #wbm-root .wbm-count {
    min-width: 28px;
    padding: 2px 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.055);
    text-align: center;
  }

  #wbm-root .wbm-sidebar-scrim {
    position: fixed;
    z-index: 3;
    inset: 0;
    border: 0;
    background: rgba(0, 0, 0, 0.58);
    backdrop-filter: blur(2px);
  }

  #wbm-root.wbm-sidebar-open .wbm-sidebar-scrim {
    display: block;
  }

  #wbm-root .wbm-sheet-layer {
    z-index: 5;
    align-items: stretch;
    justify-content: stretch;
    background: var(--wbm-panel);
    backdrop-filter: none;
  }

  #wbm-root .wbm-sheet {
    position: relative;
    width: 100%;
    height: 100dvh;
    max-height: none;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding:
      0
      max(12px, env(safe-area-inset-right))
      max(16px, env(safe-area-inset-bottom))
      max(12px, env(safe-area-inset-left));
    border: 0;
    border-radius: 0;
    background: var(--wbm-panel);
    box-shadow: none;
  }

  #wbm-root .wbm-sheet::before {
    display: none;
  }

  #wbm-root .wbm-sheet-header {
    position: sticky;
    top: 0;
    z-index: 2;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    margin: 0 -12px 8px;
    padding:
      max(6px, env(safe-area-inset-top))
      8px
      8px;
    border-bottom: 1px solid var(--wbm-border);
    background: var(--wbm-panel);
  }

  #wbm-root .wbm-sheet-header [data-action="close-sheet"] {
    order: -1;
    flex: 0 0 auto;
  }

  #wbm-root .wbm-sheet-title {
    flex: 1 1 auto;
    min-width: 0;
  }

  #wbm-root .wbm-sheet-title h2 {
    font-size: 16px;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #wbm-root .wbm-sheet-title .wbm-sheet-note {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #wbm-root .wbm-field {
    gap: 9px;
    margin: 16px 0;
  }

  #wbm-root .wbm-field > label,
  #wbm-root .wbm-field > .wbm-field-label {
    font-size: 13px;
  }

  #wbm-root .wbm-checkbox-list {
    gap: 8px;
  }

  #wbm-root .wbm-checkbox-row {
    min-height: 48px;
    padding: 8px 11px;
    border-radius: 11px;
    background: var(--wbm-panel-2);
  }

  #wbm-root .wbm-checkbox-row input {
    width: 20px;
    height: 20px;
  }

  #wbm-root .wbm-sheet-actions {
    gap: 8px;
    margin: 18px -12px -16px;
    padding:
      10px 12px
      max(10px, env(safe-area-inset-bottom));
  }

  #wbm-root .wbm-sheet-actions .wbm-text-button {
    flex: 1 1 0;
    min-height: 48px;
    border-radius: 12px;
  }

  #wbm-root .wbm-field-grid,
  #wbm-root .wbm-field-grid-three {
    grid-template-columns: 1fr;
  }

  #wbm-root .wbm-input,
  #wbm-root .wbm-textarea {
    border-radius: 11px;
    font-size: 16px;
  }

  #wbm-root .wbm-content-editor {
    min-height: 42dvh;
  }

  #wbm-root .wbm-entry-row {
    min-height: 54px;
    border-radius: 9px;
  }
}

@media (max-width: 420px) {
  #wbm-root .wbm-header {
    grid-template-columns: 42px minmax(0, 1fr) 42px;
  }

  #wbm-root .wbm-icon-button {
    width: 42px;
    min-height: 42px;
  }

  #wbm-root .wbm-toolbar {
    gap: 8px;
  }

  #wbm-root .wbm-toolbar .wbm-select {
    width: 90px;
    min-width: 90px;
    font-size: 13px;
  }

  #wbm-root .wbm-book-row {
    min-height: 58px;
    padding: 8px 9px;
  }
}
`;