import {
  UNFILED_FOLDER,
  UNFILED_FOLDER_ID,
  type BookMeta,
  type ManagerState,
  type PrefixRule,
} from '../model';

export type ReconcileResult = {
  state: ManagerState;
  changed: boolean;
  added: string[];
  missing: string[];
  restored: string[];
};

function withRequiredSystemFolders(state: ManagerState): ManagerState {
  if (state.folders.some(folder => folder.id === UNFILED_FOLDER_ID)) {
    return state;
  }

  return {
    ...state,
    folders: [{ ...UNFILED_FOLDER }, ...state.folders],
  };
}

function findAutoFileRule(state: ManagerState, lorebookName: string): PrefixRule | undefined {
  if (!state.settings.autoFileNewBooks) {
    return undefined;
  }

  const validFolderIds = new Set(state.folders.map(folder => folder.id));
  return state.prefixRules.find(
    rule => rule.enabled && validFolderIds.has(rule.folderId) && lorebookName.startsWith(rule.prefix),
  );
}

function normalizeBookMeta(state: ManagerState, meta: BookMeta): BookMeta {
  const validFolderIds = new Set(state.folders.map(folder => folder.id));
  const validTagIds = new Set(state.tags.map(tag => tag.id));
  const folderId = validFolderIds.has(meta.folderId) ? meta.folderId : UNFILED_FOLDER_ID;
  const tagIds = [...new Set(meta.tagIds)].filter(tagId => validTagIds.has(tagId));

  if (
    folderId === meta.folderId &&
    tagIds.length === meta.tagIds.length &&
    tagIds.every((tagId, index) => tagId === meta.tagIds[index])
  ) {
    return meta;
  }

  return { ...meta, folderId, tagIds };
}

export function reconcileLorebooks(
  inputState: ManagerState,
  currentLorebookNames: readonly string[],
  now = Date.now(),
): ReconcileResult {
  const state = withRequiredSystemFolders(inputState);
  const currentNames = [...new Set(currentLorebookNames)];
  const currentSet = new Set(currentNames);
  const knownNames = Object.keys(state.books);
  const books = { ...state.books };
  const added: string[] = [];
  const missing: string[] = [];
  const restored: string[] = [];
  let changed = state !== inputState;

  for (const name of knownNames) {
    const original = books[name];
    const current = normalizeBookMeta(state, original);
    const exists = currentSet.has(name);
    const wasKnownMissing = current.lastKnownExists === false;
    const next: BookMeta = {
      ...current,
      lastKnownExists: exists,
    };

    if (exists && wasKnownMissing) {
      restored.push(name);
    } else if (!exists && current.lastKnownExists !== false) {
      missing.push(name);
    }

    if (current !== original || next.lastKnownExists !== original.lastKnownExists) {
      books[name] = next;
      changed = true;
    }
  }

  for (const name of currentNames) {
    if (Object.prototype.hasOwnProperty.call(books, name)) {
      continue;
    }

    const rule = findAutoFileRule(state, name);
    books[name] = {
      folderId: rule?.folderId ?? UNFILED_FOLDER_ID,
      tagIds: [],
      firstSeenAt: now,
      manuallyFiled: false,
      lastKnownExists: true,
    };
    added.push(name);
    changed = true;
  }

  return {
    state: changed ? { ...state, books } : state,
    changed,
    added,
    missing,
    restored,
  };
}
