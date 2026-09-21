import { type SmartViewId, type ViewState } from '../domain/views';
import { UNFILED_FOLDER_ID } from '../model';
import { createEntry, deleteEntry, loadLorebookEntries, updateEntry } from '../services/entries';
import { createFolder, createTag, updateLorebookOrganization } from '../services/organize';
import { bootstrapManager, type ManagerBootstrapResult } from '../services/manager';
import {
  createManagerRoot,
  readEntryEditorDraft,
  readSheetOrganization,
  renderManager,
  renderManagerList,
  renderManagerSheet,
  type ManagerUiModel,
} from './view';
import { MANAGER_STYLES } from './styles';

const ROOT_ID = 'wbm-root';
const STYLE_ID = 'wbm-styles';

type UiSession = ManagerUiModel & {
  root: HTMLDivElement;
  keydownHandler: (event: KeyboardEvent) => void;
};

let activeSession: UiSession | null = null;

function reportError(context: string, error: unknown): void {
  console.error(`[Worldbook Manager] ${context}`, error);
  toastr.error(error instanceof Error ? error.message : String(error), 'Worldbook Manager');
}

function ensureHostStyles(): void {
  if ($(`#${STYLE_ID}`).length > 0) return;
  $('<style>').attr('id', STYLE_ID).text(MANAGER_STYLES).appendTo('head');
}

async function refreshSession(session: UiSession, refreshRuntime: boolean): Promise<void> {
  session.data = await bootstrapManager(refreshRuntime ? undefined : session.data.runtime);

  if (session.view.source.type === 'folder') {
    const activeFolderId = session.view.source.folderId;
    if (!session.data.state.folders.some(folder => folder.id === activeFolderId)) {
      session.view.source = { type: 'folder', folderId: UNFILED_FOLDER_ID };
    }
  }

  if (
    session.selectedBookName &&
    !session.data.summaries.some(book => book.name === session.selectedBookName)
  ) {
    session.selectedBookName = undefined;
  }
}

async function runBusy(session: UiSession, action: () => Promise<void>): Promise<void> {
  if (session.busy) return;

  session.busy = true;
  renderManager(session.root, session);
  try {
    await action();
  } finally {
    session.busy = false;
    renderManager(session.root, session);
  }
}

function switchSource(
  session: UiSession,
  sourceType: string | undefined,
  sourceId: string | undefined,
): void {
  if (!sourceId) return;

  if (sourceType === 'folder') {
    session.view.source = { type: 'folder', folderId: sourceId };
  } else if (
    sourceType === 'smart' &&
    ['recent', 'bound', 'unbound', 'trash'].includes(sourceId)
  ) {
    session.view.source = { type: 'smart', smartId: sourceId as SmartViewId };
  } else {
    return;
  }

  session.sidebarOpen = false;
  renderManager(session.root, session);
}

async function createFolderFromPrompt(session: UiSession): Promise<void> {
  const name = window.parent.prompt('新 Folder 名称');
  if (name === null) return;

  await runBusy(session, async () => {
    await createFolder(name);
    await refreshSession(session, false);
    toastr.success('Folder 已建立', 'Worldbook Manager');
  });
}

async function createTagFromPrompt(session: UiSession): Promise<void> {
  const name = window.parent.prompt('新 Tag 名称');
  if (name === null) return;

  await runBusy(session, async () => {
    await createTag(name);
    await refreshSession(session, false);
    toastr.success('Tag 已建立', 'Worldbook Manager');
  });
}

async function saveSelectedBook(session: UiSession): Promise<void> {
  const bookName = session.selectedBookName;
  if (!bookName) return;

  const organization = readSheetOrganization(session.root);
  await runBusy(session, async () => {
    await updateLorebookOrganization(bookName, organization);
    await refreshSession(session, false);
    clearSelectedBook(session);
    toastr.success('整理信息已保存', 'Worldbook Editor');
  });
}

function clearSelectedBook(session: UiSession): void {
  session.selectedBookName = undefined;
  session.bookEntries = undefined;
  session.bookEntriesFor = undefined;
  session.bookEntriesError = undefined;
  session.bookEntriesLoading = false;
  session.selectedEntryUid = undefined;
}

async function loadSelectedBook(session: UiSession, bookName: string): Promise<void> {
  session.bookEntriesLoading = true;
  session.bookEntriesError = undefined;
  session.bookEntriesFor = bookName;
  session.bookEntries = undefined;
  session.selectedEntryUid = undefined;
  renderManagerSheet(session.root, session);

  try {
    const entries = await loadLorebookEntries(bookName);
    if (session.selectedBookName !== bookName) return;
    session.bookEntries = entries;
  } catch (error) {
    if (session.selectedBookName !== bookName) return;
    session.bookEntriesError = error instanceof Error ? error.message : String(error);
  } finally {
    if (session.selectedBookName === bookName) {
      session.bookEntriesLoading = false;
      renderManagerSheet(session.root, session);
    }
  }
}

async function createSelectedEntry(session: UiSession): Promise<void> {
  const bookName = session.selectedBookName;
  if (!bookName) return;

  await runBusy(session, async () => {
    const result = await createEntry(bookName);
    session.bookEntries = result.worldbook;
    session.bookEntriesFor = bookName;
    session.selectedEntryUid = result.entry.uid;
    toastr.success('条目已建立', 'Worldbook Editor');
  });
}

async function saveSelectedEntry(session: UiSession): Promise<void> {
  const bookName = session.selectedBookName;
  const uid = session.selectedEntryUid;
  if (!bookName || uid === undefined) return;

  const draft = readEntryEditorDraft(session.root);
  await runBusy(session, async () => {
    session.bookEntries = await updateEntry(bookName, uid, draft);
    session.bookEntriesFor = bookName;
    toastr.success('世界书条目已保存', 'Worldbook Editor');
  });
}

async function deleteSelectedEntry(session: UiSession): Promise<void> {
  const bookName = session.selectedBookName;
  const uid = session.selectedEntryUid;
  if (!bookName || uid === undefined) return;
  if (!window.parent.confirm('确定删除这个世界书条目？')) return;

  await runBusy(session, async () => {
    session.bookEntries = await deleteEntry(bookName, uid);
    session.bookEntriesFor = bookName;
    session.selectedEntryUid = undefined;
    toastr.success('世界书条目已删除', 'Worldbook Editor');
  });
}

function handleClick(session: UiSession, event: MouseEvent): void {
  const target = event.target as Element | null;
  if (!target || typeof target.closest !== 'function') return;

  const element = target.closest<HTMLElement>('[data-action]');
  if (!element || !session.root.contains(element)) return;

  switch (element.dataset.action) {
    case 'close':
      destroyManagerUi();
      return;
    case 'toggle-sidebar':
      session.sidebarOpen = !session.sidebarOpen;
      renderManager(session.root, session);
      return;
    case 'close-sidebar':
      session.sidebarOpen = false;
      renderManager(session.root, session);
      return;
    case 'switch-source':
      switchSource(session, element.dataset.sourceType, element.dataset.sourceId);
      return;
    case 'toggle-tag-filter': {
      const tagId = element.dataset.tagId;
      if (!tagId) return;
      session.view.tagIds = session.view.tagIds.includes(tagId)
        ? session.view.tagIds.filter(candidate => candidate !== tagId)
        : [...session.view.tagIds, tagId];
      renderManager(session.root, session);
      return;
    }
    case 'set-bound-subtype': {
      const subtype = element.dataset.boundSubtype;
      if (subtype === 'all' || subtype === 'character' || subtype === 'chat') {
        session.view.boundSubtype = subtype;
        renderManager(session.root, session);
      }
      return;
    }
    case 'open-book': {
      const encodedName = element.dataset.bookName;
      if (!encodedName) return;
      session.selectedBookName = decodeURIComponent(encodedName);
      session.bookEntries = undefined;
      session.bookEntriesFor = session.selectedBookName;
      session.bookEntriesError = undefined;
      session.selectedEntryUid = undefined;
      renderManagerSheet(session.root, session);
      void loadSelectedBook(session, session.selectedBookName).catch(error =>
        reportError('读取世界书条目失败', error),
      );
      return;
    }
    case 'close-sheet':
      clearSelectedBook(session);
      renderManagerSheet(session.root, session);
      return;
    case 'reload-book':
      if (session.selectedBookName) {
        void loadSelectedBook(session, session.selectedBookName).catch(error =>
          reportError('读取世界书条目失败', error),
        );
      }
      return;
    case 'open-entry': {
      const uid = Number(element.dataset.entryUid);
      if (!Number.isInteger(uid)) return;
      session.selectedEntryUid = uid;
      renderManagerSheet(session.root, session);
      return;
    }
    case 'close-entry':
      session.selectedEntryUid = undefined;
      renderManagerSheet(session.root, session);
      return;
    case 'new-entry':
      void createSelectedEntry(session).catch(error => reportError('建立世界书条目失败', error));
      return;
    case 'save-entry':
      void saveSelectedEntry(session).catch(error => reportError('保存世界书条目失败', error));
      return;
    case 'delete-entry':
      void deleteSelectedEntry(session).catch(error => reportError('删除世界书条目失败', error));
      return;
    case 'create-folder':
      void createFolderFromPrompt(session).catch(error => reportError('建立 Folder 失败', error));
      return;
    case 'create-tag':
      void createTagFromPrompt(session).catch(error => reportError('建立 Tag 失败', error));
      return;
    case 'save-book':
      void saveSelectedBook(session).catch(error => reportError('保存整理信息失败', error));
      return;
    case 'refresh':
      void runBusy(session, async () => {
        await refreshSession(session, true);
        toastr.success('已重新读取 Tavern 状态', 'Worldbook Editor');
      }).catch(error => reportError('刷新失败', error));
      return;
  }
}

function handleInput(session: UiSession, event: Event): void {
  const target = event.target as HTMLInputElement | null;
  if (!target || target.dataset?.role !== 'search' || target.tagName !== 'INPUT') return;

  session.view.search = target.value;
  renderManagerList(session.root, session);
}

function handleChange(session: UiSession, event: Event): void {
  const target = event.target as HTMLSelectElement | null;
  if (!target || target.dataset?.role !== 'sort' || target.tagName !== 'SELECT') return;

  if (target.value === 'name' || target.value === 'recent' || target.value === 'entryCount') {
    session.view.sort = target.value;
    renderManagerList(session.root, session);
  }
}

function mountManager(data: ManagerBootstrapResult): void {
  destroyManagerUi();
  ensureHostStyles();

  const root = createManagerRoot();
  const view: ViewState = {
    source: { type: 'folder', folderId: UNFILED_FOLDER_ID },
    tagIds: [],
    search: '',
    sort: 'name',
    boundSubtype: 'all',
  };

  const keydownHandler = (event: KeyboardEvent): void => {
    const session = activeSession;
    if (!session || session.root !== root || event.key !== 'Escape') return;

    if (session.selectedBookName) {
      if (session.selectedEntryUid !== undefined) {
        session.selectedEntryUid = undefined;
      } else {
        clearSelectedBook(session);
      }
      renderManagerSheet(session.root, session);
    } else if (session.sidebarOpen) {
      session.sidebarOpen = false;
      renderManager(session.root, session);
    } else {
      destroyManagerUi();
    }
  };

  const session: UiSession = {
    root,
    data,
    view,
    sidebarOpen: false,
    busy: false,
    bookEntriesLoading: false,
    keydownHandler,
  };

  root.addEventListener('click', event => handleClick(session, event));
  root.addEventListener('input', event => handleInput(session, event));
  root.addEventListener('change', event => handleChange(session, event));
  window.parent.document.addEventListener('keydown', keydownHandler);
  $('body').append(root).addClass('wbm-lock-scroll');

  activeSession = session;
  renderManager(root, session);
}

export async function openManagerUi(): Promise<void> {
  if (activeSession?.root.isConnected) return;
  mountManager(await bootstrapManager());
}

export function destroyManagerUi(): void {
  if (activeSession) {
    window.parent.document.removeEventListener('keydown', activeSession.keydownHandler);
    activeSession.root.remove();
    activeSession = null;
  }

  $(`#${ROOT_ID}`).remove();
  $(`#${STYLE_ID}`).remove();
  $('body').removeClass('wbm-lock-scroll');
}
