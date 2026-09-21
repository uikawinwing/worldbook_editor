import {
  filterLorebookSummaries,
  type LorebookSummary,
  type SmartViewId,
  type ViewSource,
  type ViewState,
} from '../domain/views';
import { type Folder, type ManagerState } from '../model';
import type { EntryEditorDraft } from '../services/entries';
import type { ManagerBootstrapResult } from '../services/manager';
import { MANAGER_STYLES } from './styles';

const STYLE_ID = 'wbm-styles';

export type ManagerUiModel = {
  data: ManagerBootstrapResult;
  view: ViewState;
  selectedBookName?: string;
  bookEntries?: WorldbookEntry[];
  bookEntriesFor?: string;
  bookEntriesLoading: boolean;
  bookEntriesError?: string;
  selectedEntryUid?: number;
  sidebarOpen: boolean;
  busy: boolean;
};

function escapeHtml(value: string): string {
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

function attr(value: string): string {
  return escapeHtml(value);
}

function getElement<T extends Element>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Worldbook Manager UI 缺少元素：${selector}`);
  }
  return element;
}

function sourceIsActive(view: ViewState, source: ViewSource): boolean {
  if (source.type === 'folder') {
    return view.source.type === 'folder' && view.source.folderId === source.folderId;
  }
  return view.source.type === 'smart' && view.source.smartId === source.smartId;
}

function folderName(state: ManagerState, folderId: string): string {
  return state.folders.find(folder => folder.id === folderId)?.name ?? '未知 Folder';
}

function tagName(state: ManagerState, tagId: string): string {
  return state.tags.find(tag => tag.id === tagId)?.name ?? tagId;
}

function counts(model: ManagerUiModel): {
  folders: Map<string, number>;
  recent: number;
  bound: number;
  unbound: number;
  trash: number;
} {
  const folders = new Map<string, number>();
  let recent = 0;
  let bound = 0;
  let unbound = 0;
  let trash = 0;
  const threshold =
    Date.now() - model.data.state.settings.recentDays * 24 * 60 * 60 * 1000;

  for (const book of model.data.summaries) {
    if (book.inTrash) {
      trash += 1;
      continue;
    }
    if (!book.exists) {
      continue;
    }

    folders.set(book.folderId, (folders.get(book.folderId) ?? 0) + 1);
    if (book.firstSeenAt !== undefined && book.firstSeenAt >= threshold) {
      recent += 1;
    }
    if (book.characterNames.length > 0 || book.chatBindingsKnown > 0) {
      bound += 1;
    } else {
      unbound += 1;
    }
  }

  return { folders, recent, bound, unbound, trash };
}

function navButton(
  label: string,
  count: number,
  source: ViewSource,
  active: boolean,
): string {
  const id = source.type === 'folder' ? source.folderId : source.smartId;
  return `<button type="button" class="wbm-nav-button${active ? ' is-active' : ''}"
    data-action="switch-source" data-source-type="${source.type}" data-source-id="${attr(id)}">
    <span class="wbm-nav-label">${escapeHtml(label)}</span>
    <span class="wbm-count">${count}</span>
  </button>`;
}

function renderSidebar(root: HTMLElement, model: ManagerUiModel): void {
  const smartList = getElement<HTMLElement>(root, '[data-role="smart-list"]');
  const folderList = getElement<HTMLElement>(root, '[data-role="folder-list"]');
  const currentCounts = counts(model);

  const smartViews: Array<[SmartViewId, string, number]> = [
    ['recent', '最近新增', currentCounts.recent],
    ['bound', '已绑定', currentCounts.bound],
    ['unbound', '未绑定', currentCounts.unbound],
    ['trash', '回收站', currentCounts.trash],
  ];

  smartList.innerHTML = smartViews
    .map(([smartId, label, count]) => {
      const source: ViewSource = { type: 'smart', smartId };
      return navButton(label, count, source, sourceIsActive(model.view, source));
    })
    .join('');

  folderList.innerHTML = [...model.data.state.folders]
    .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name))
    .map(folder => {
      const source: ViewSource = { type: 'folder', folderId: folder.id };
      const label = `${folder.icon ? `${folder.icon} ` : ''}${folder.name}`;
      return navButton(
        label,
        currentCounts.folders.get(folder.id) ?? 0,
        source,
        sourceIsActive(model.view, source),
      );
    })
    .join('');
}

function renderBoundTabs(root: HTMLElement, model: ManagerUiModel): void {
  const container = getElement<HTMLElement>(root, '[data-role="bound-tabs"]');
  const visible =
    model.view.source.type === 'smart' && model.view.source.smartId === 'bound';
  container.hidden = !visible;

  if (!visible) {
    container.replaceChildren();
    return;
  }

  const current = model.view.boundSubtype ?? 'all';
  container.innerHTML = [
    ['all', '全部'],
    ['character', '角色卡'],
    ['chat', '聊天'],
  ]
    .map(
      ([id, label]) =>
        `<button type="button" class="wbm-chip${current === id ? ' is-active' : ''}"
          data-action="set-bound-subtype" data-bound-subtype="${id}">${label}</button>`,
    )
    .join('');
}

function renderTags(root: HTMLElement, model: ManagerUiModel): void {
  const container = getElement<HTMLElement>(root, '[data-role="tags"]');
  const tags = [...model.data.state.tags].sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  const tagHtml = tags
    .map(
      tag =>
        `<button type="button" class="wbm-chip${
          model.view.tagIds.includes(tag.id) ? ' is-active' : ''
        }" data-action="toggle-tag-filter" data-tag-id="${attr(tag.id)}">${escapeHtml(tag.name)}</button>`,
    )
    .join('');

  container.innerHTML = `${
    tags.length === 0 ? '<span class="wbm-book-raw">还没有 Tag</span>' : ''
  }${tagHtml}<button type="button" class="wbm-chip" data-action="create-tag">＋ Tag</button>`;
}

function sourceLabel(model: ManagerUiModel): string {
  if (model.view.source.type === 'folder') {
    return folderName(model.data.state, model.view.source.folderId);
  }
  return {
    recent: '最近新增',
    bound: '已绑定',
    unbound: '未绑定',
    trash: '回收站',
  }[model.view.source.smartId];
}

function badge(text: string): string {
  return `<span class="wbm-badge">${escapeHtml(text)}</span>`;
}

function bookRow(model: ManagerUiModel, book: LorebookSummary): string {
  const metadata: string[] = [badge(folderName(model.data.state, book.folderId))];
  metadata.push(
    ...book.tagIds
      .slice(0, 3)
      .map(tagId => badge(`#${tagName(model.data.state, tagId)}`)),
  );
  if (book.tagIds.length > 3) metadata.push(badge(`+${book.tagIds.length - 3}`));
  if (book.globalEnabled) metadata.push(badge('Global'));
  if (book.characterNames.length > 0) metadata.push(badge(`角色 ${book.characterNames.length}`));
  if (book.chatBindingsKnown > 0) metadata.push(badge(`聊天 ${book.chatBindingsKnown}`));
  if (book.entryCount !== undefined) metadata.push(badge(`${book.entryCount} 条`));

  return `<button type="button" class="wbm-book-row" data-action="open-book"
    data-book-name="${attr(encodeURIComponent(book.name))}">
    <span class="wbm-book-main">
      <span class="wbm-book-name">${escapeHtml(book.displayName)}</span>
      ${
        book.displayName !== book.name
          ? `<span class="wbm-book-raw">${escapeHtml(book.name)}</span>`
          : ''
      }
      <span class="wbm-meta-line">${metadata.join('')}</span>
    </span>
    <span class="wbm-chevron">›</span>
  </button>`;
}

function renderList(root: HTMLElement, model: ManagerUiModel): void {
  const list = getElement<HTMLElement>(root, '[data-role="list"]');
  const label = getElement<HTMLElement>(root, '[data-role="view-label"]');
  const sort = getElement<HTMLSelectElement>(root, '[data-role="sort"]');
  const visible = filterLorebookSummaries(
    model.data.state,
    model.data.summaries,
    model.view,
  );

  label.textContent = `${sourceLabel(model)} · ${visible.length}`;
  sort.value = model.view.sort;
  list.innerHTML =
    visible.length === 0
      ? '<div class="wbm-empty">这里暂时没有符合条件的世界书</div>'
      : visible.map(book => bookRow(model, book)).join('');
}

function selectedBook(model: ManagerUiModel): LorebookSummary | undefined {
  return model.selectedBookName
    ? model.data.summaries.find(book => book.name === model.selectedBookName)
    : undefined;
}

function selectedEntry(model: ManagerUiModel): WorldbookEntry | undefined {
  if (model.selectedEntryUid === undefined || model.bookEntriesFor !== model.selectedBookName) {
    return undefined;
  }
  return model.bookEntries?.find(entry => entry.uid === model.selectedEntryUid);
}

function strategyKeyText(key: string | RegExp): string {
  return key instanceof RegExp ? key.toString() : key;
}

function entryRow(entry: WorldbookEntry): string {
  return `<button type="button" class="wbm-entry-row" data-action="open-entry" data-entry-uid="${entry.uid}">
    <span class="wbm-entry-status ${entry.enabled ? 'is-enabled' : ''}" aria-hidden="true"></span>
    <span class="wbm-entry-main">
      <strong>${escapeHtml(entry.name || '未命名条目')}</strong>
      <span class="wbm-sheet-note">${escapeHtml(entry.strategy.type)} · order ${entry.position.order} · ${entry.probability}%</span>
    </span>
    <span class="wbm-chevron">›</span>
  </button>`;
}

function renderEntryEditor(entry: WorldbookEntry): string {
  const strategyOptions = ['constant', 'selective', 'vectorized']
    .map(
      value =>
        `<option value="${value}"${entry.strategy.type === value ? ' selected' : ''}>${value}</option>`,
    )
    .join('');
  const positionOptions: WorldbookEntry['position']['type'][] = [
    'before_character_definition',
    'after_character_definition',
    'before_example_messages',
    'after_example_messages',
    'before_author_note',
    'after_author_note',
    'at_depth',
    'outlet',
  ];
  const roleOptions: WorldbookEntry['position']['role'][] = ['system', 'assistant', 'user'];

  return `
    <div class="wbm-entry-editor">
      <button type="button" class="wbm-back-button" data-action="close-entry">‹ 返回条目列表</button>
      <div class="wbm-field">
        <label>条目名称</label>
        <input class="wbm-input" data-role="entry-name" value="${attr(entry.name)}">
      </div>
      <label class="wbm-checkbox-row wbm-inline-toggle">
        <input type="checkbox" data-role="entry-enabled"${entry.enabled ? ' checked' : ''}>
        <span>启用条目</span>
      </label>
      <div class="wbm-field">
        <label>内容</label>
        <textarea class="wbm-textarea wbm-content-editor" data-role="entry-content">${escapeHtml(entry.content)}</textarea>
      </div>
      <div class="wbm-field-grid">
        <div class="wbm-field">
          <label>激活类型</label>
          <select class="wbm-select" data-role="entry-strategy">${strategyOptions}</select>
        </div>
        <div class="wbm-field">
          <label>激活概率 %</label>
          <input class="wbm-input" data-role="entry-probability" type="number" min="0" max="100" value="${entry.probability}">
        </div>
      </div>
      <div class="wbm-field">
        <label>Keys（每行一个；正则可写 /pattern/flags）</label>
        <textarea class="wbm-textarea" data-role="entry-keys">${escapeHtml(
          entry.strategy.keys.map(strategyKeyText).join('\n'),
        )}</textarea>
      </div>
      <div class="wbm-field">
        <label>插入位置</label>
        <select class="wbm-select" data-role="entry-position">${positionOptions
          .map(
            value =>
              `<option value="${value}"${entry.position.type === value ? ' selected' : ''}>${value}</option>`,
          )
          .join('')}</select>
      </div>
      <div class="wbm-field-grid wbm-field-grid-three">
        <div class="wbm-field">
          <label>Role</label>
          <select class="wbm-select" data-role="entry-role">${roleOptions
            .map(
              value =>
                `<option value="${value}"${entry.position.role === value ? ' selected' : ''}>${value}</option>`,
            )
            .join('')}</select>
        </div>
        <div class="wbm-field">
          <label>Depth</label>
          <input class="wbm-input" data-role="entry-depth" type="number" value="${entry.position.depth}">
        </div>
        <div class="wbm-field">
          <label>Order</label>
          <input class="wbm-input" data-role="entry-order" type="number" value="${entry.position.order}">
        </div>
      </div>
      <div class="wbm-sheet-actions">
        <button type="button" class="wbm-text-button is-danger" data-action="delete-entry">删除</button>
        <button type="button" class="wbm-text-button is-primary" data-action="save-entry">保存条目</button>
      </div>
    </div>`;
}

function folderOptions(
  folders: readonly Folder[],
  selectedFolderId: string,
): string {
  return [...folders]
    .sort((left, right) => left.order - right.order)
    .map(
      folder =>
        `<option value="${attr(folder.id)}"${
          folder.id === selectedFolderId ? ' selected' : ''
        }>${escapeHtml(folder.name)}</option>`,
    )
    .join('');
}

function renderSheet(root: HTMLElement, model: ManagerUiModel): void {
  const layer = getElement<HTMLElement>(root, '[data-role="sheet-layer"]');
  const sheet = getElement<HTMLElement>(root, '[data-role="sheet"]');
  const book = selectedBook(model);

  layer.hidden = !book;
  if (!book) {
    sheet.replaceChildren();
    return;
  }

  const bindings: string[] = [];
  if (book.globalEnabled) bindings.push('Global');
  if (book.characterNames.length > 0) bindings.push(`角色卡：${book.characterNames.join('、')}`);
  if (book.chatBindingsKnown > 0) bindings.push(`已知聊天：${book.chatBindingsKnown}`);

  const tags = [...model.data.state.tags]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map(
      tag => `<label class="wbm-checkbox-row">
        <input type="checkbox" data-role="sheet-tag" value="${attr(tag.id)}"${
          book.tagIds.includes(tag.id) ? ' checked' : ''
        }>
        <span>${escapeHtml(tag.name)}</span>
      </label>`,
    )
    .join('');

  const entry = selectedEntry(model);
  const entryPanel = entry
    ? renderEntryEditor(entry)
    : model.bookEntriesLoading
      ? '<div class="wbm-empty">正在读取世界书条目…</div>'
      : model.bookEntriesError
        ? `<div class="wbm-empty">${escapeHtml(model.bookEntriesError)}<br><button type="button" class="wbm-text-button" data-action="reload-book">重新读取</button></div>`
        : model.bookEntriesFor === book.name
          ? `<section class="wbm-entry-section">
              <div class="wbm-section-heading wbm-entry-heading">
                <span>Entries · ${model.bookEntries?.length ?? 0}</span>
                <button type="button" class="wbm-text-button" data-action="new-entry">＋ 新增条目</button>
              </div>
              <div class="wbm-entry-list">${
                model.bookEntries?.length
                  ? model.bookEntries.map(entryRow).join('')
                  : '<div class="wbm-empty">这本世界书还没有条目</div>'
              }</div>
            </section>`
          : '<div class="wbm-empty">尚未读取世界书条目</div>';

  sheet.innerHTML = `
    <div class="wbm-sheet-header">
      <div class="wbm-sheet-title">
        <h2>${escapeHtml(book.displayName)}</h2>
        <div class="wbm-sheet-note">${escapeHtml(book.name)}</div>
      </div>
      <button type="button" class="wbm-icon-button" data-action="close-sheet" aria-label="返回世界书列表">←</button>
    </div>
    ${
      book.inTrash
        ? '<div class="wbm-empty">回收站恢复与永久删除会在 Trash 里程碑接入</div>'
        : entry
          ? entryPanel
          : `
          ${entryPanel}
          <div class="wbm-organize-section">
            <div class="wbm-section-heading wbm-entry-heading"><span>整理</span></div>
            <div class="wbm-field">
              <label>Folder</label>
              <select class="wbm-select" data-role="sheet-folder">
                ${folderOptions(model.data.state.folders, book.folderId)}
              </select>
            </div>
            <div class="wbm-field">
              <div class="wbm-field-label">Tags</div>
              <div class="wbm-checkbox-list">
                ${tags || '<span class="wbm-sheet-note">还没有 Tag，可以先在 Editor 顶部建立</span>'}
              </div>
            </div>
            <div class="wbm-field">
              <div class="wbm-field-label">绑定</div>
              <div class="wbm-sheet-note">${
                bindings.length > 0
                  ? escapeHtml(bindings.join(' · '))
                  : '没有确认到 Character / Chat binding'
              }</div>
            </div>
            <div class="wbm-sheet-actions">
              <button type="button" class="wbm-text-button" data-action="close-sheet">取消</button>
              <button type="button" class="wbm-text-button is-primary" data-action="save-book">保存整理信息</button>
            </div>
          </div>
        `
    }
  `;
}

export function ensureManagerStyles(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = MANAGER_STYLES;
  document.head.append(style);
}

export function createManagerRoot(): HTMLDivElement {
  const root = document.createElement('div');
  root.id = 'wbm-root';
  root.innerHTML = `
    <section class="wbm-shell" role="dialog" aria-modal="true" aria-label="Worldbook Editor">
      <header class="wbm-header">
        <button type="button" class="wbm-icon-button wbm-menu-button" data-action="toggle-sidebar" aria-label="打开导航"><span class="wbm-menu-glyph" aria-hidden="true"></span></button>
        <div class="wbm-title">
          <strong>世界书编辑器</strong>
          <span data-role="library-summary"></span>
        </div>
        <div class="wbm-search-wrap">
          <input class="wbm-search" data-role="search" type="search" placeholder="搜索世界书…" autocomplete="off">
        </div>
        <button type="button" class="wbm-icon-button" data-action="refresh" aria-label="刷新">↻</button>
        <button type="button" class="wbm-icon-button" data-action="close" aria-label="关闭">×</button>
      </header>
      <div class="wbm-body">
        <aside class="wbm-sidebar">
          <section class="wbm-sidebar-section">
            <div class="wbm-section-heading"><span>Smart Views</span></div>
            <div class="wbm-sidebar-list" data-role="smart-list"></div>
          </section>
          <section class="wbm-sidebar-section">
            <div class="wbm-section-heading">
              <span>Folders</span>
              <button type="button" class="wbm-text-button" data-action="create-folder">＋</button>
            </div>
            <div class="wbm-sidebar-list" data-role="folder-list"></div>
          </section>
          <section class="wbm-sidebar-section wbm-mobile-sidebar-actions">
            <button type="button" class="wbm-nav-button" data-action="refresh">
              <span class="wbm-nav-label">↻ 重新读取 Tavern</span>
            </button>
          </section>
        </aside>
        <button type="button" class="wbm-sidebar-scrim" data-action="close-sidebar" aria-label="关闭导航"></button>
        <main class="wbm-main">
          <div class="wbm-toolbar">
            <span class="wbm-toolbar-label" data-role="view-label"></span>
            <select class="wbm-select" data-role="sort" aria-label="排序">
              <option value="name">名称</option>
              <option value="recent">最近新增</option>
              <option value="entryCount">条目数</option>
            </select>
          </div>
          <div class="wbm-bound-tabs" data-role="bound-tabs" hidden></div>
          <div class="wbm-tags" data-role="tags"></div>
          <div class="wbm-list" data-role="list"></div>
        </main>
      </div>
      <div class="wbm-sheet-layer" data-role="sheet-layer" hidden>
        <section class="wbm-sheet" data-role="sheet"></section>
      </div>
    </section>
  `;
  return root;
}

export function renderManager(root: HTMLElement, model: ManagerUiModel): void {
  const activeBooks = model.data.summaries.filter(book => book.exists && !book.inTrash).length;
  getElement<HTMLElement>(root, '[data-role="library-summary"]').textContent =
    `${activeBooks} 本世界书 · ${model.data.state.folders.length} 个 Folder · ${model.data.state.tags.length} 个 Tag`;

  const search = getElement<HTMLInputElement>(root, '[data-role="search"]');
  if (search.value !== model.view.search) search.value = model.view.search;

  renderSidebar(root, model);
  renderBoundTabs(root, model);
  renderTags(root, model);
  renderList(root, model);
  renderSheet(root, model);

  getElement<HTMLElement>(root, '.wbm-shell').classList.toggle('is-busy', model.busy);
  root.classList.toggle('wbm-sidebar-open', model.sidebarOpen);
}

export function renderManagerList(root: HTMLElement, model: ManagerUiModel): void {
  renderList(root, model);
}

export function renderManagerSheet(root: HTMLElement, model: ManagerUiModel): void {
  renderSheet(root, model);
}

export function readSheetOrganization(root: HTMLElement): {
  folderId: string;
  tagIds: string[];
} {
  const folderId = getElement<HTMLSelectElement>(root, '[data-role="sheet-folder"]').value;
  const tagIds = Array.from(
    root.querySelectorAll<HTMLInputElement>('[data-role="sheet-tag"]:checked'),
    checkbox => checkbox.value,
  );
  return { folderId, tagIds };
}

function parseStrategyKey(value: string): string | RegExp {
  const trimmed = value.trim();
  if (!trimmed.startsWith('/')) return trimmed;

  for (let slash = trimmed.length - 1; slash > 0; slash -= 1) {
    if (trimmed[slash] !== '/' || trimmed[slash - 1] === '\\') continue;
    const pattern = trimmed.slice(1, slash);
    const flags = trimmed.slice(slash + 1);
    if (!/^[dgimsuvy]*$/.test(flags)) return trimmed;
    try {
      return new RegExp(pattern, flags);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

function readNumber(root: HTMLElement, selector: string): number {
  const value = Number(getElement<HTMLInputElement>(root, selector).value);
  if (!Number.isFinite(value)) throw new Error(`无效数字：${selector}`);
  return value;
}

export function readEntryEditorDraft(root: HTMLElement): EntryEditorDraft {
  const probability = Math.min(
    100,
    Math.max(0, readNumber(root, '[data-role="entry-probability"]')),
  );
  const keys = getElement<HTMLTextAreaElement>(root, '[data-role="entry-keys"]')
    .value.split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(parseStrategyKey);

  return {
    name: getElement<HTMLInputElement>(root, '[data-role="entry-name"]').value,
    enabled: getElement<HTMLInputElement>(root, '[data-role="entry-enabled"]').checked,
    content: getElement<HTMLTextAreaElement>(root, '[data-role="entry-content"]').value,
    probability,
    strategyType: getElement<HTMLSelectElement>(root, '[data-role="entry-strategy"]')
      .value as EntryEditorDraft['strategyType'],
    keys,
    positionType: getElement<HTMLSelectElement>(root, '[data-role="entry-position"]')
      .value as EntryEditorDraft['positionType'],
    role: getElement<HTMLSelectElement>(root, '[data-role="entry-role"]')
      .value as EntryEditorDraft['role'],
    depth: readNumber(root, '[data-role="entry-depth"]'),
    order: readNumber(root, '[data-role="entry-order"]'),
  };
}
