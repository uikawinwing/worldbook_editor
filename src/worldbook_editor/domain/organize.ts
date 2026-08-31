import {
  UNFILED_FOLDER_ID,
  type Folder,
  type ManagerState,
  type Tag,
} from '../model';

function normalizedName(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${label}名称不能为空`);
  }
  return normalized;
}

function sameName(left: string, right: string): boolean {
  return left.localeCompare(right, undefined, { sensitivity: 'accent' }) === 0;
}

function assertUniqueFolderName(
  state: ManagerState,
  name: string,
  ignoredFolderId?: string,
): void {
  if (
    state.folders.some(
      folder => folder.id !== ignoredFolderId && sameName(folder.name, name),
    )
  ) {
    throw new Error(`Folder「${name}」已经存在`);
  }
}

function assertUniqueTagName(
  state: ManagerState,
  name: string,
  ignoredTagId?: string,
): void {
  if (
    state.tags.some(tag => tag.id !== ignoredTagId && sameName(tag.name, name))
  ) {
    throw new Error(`Tag「${name}」已经存在`);
  }
}

export function createFolder(
  state: ManagerState,
  id: string,
  name: string,
): ManagerState {
  const normalized = normalizedName(name, 'Folder');
  assertUniqueFolderName(state, normalized);

  const nextOrder =
    state.folders.reduce((max, folder) => Math.max(max, folder.order), 0) + 1;
  const folder: Folder = {
    id,
    name: normalized,
    order: nextOrder,
  };

  return {
    ...state,
    folders: [...state.folders, folder],
  };
}

export function renameFolder(
  state: ManagerState,
  folderId: string,
  name: string,
): ManagerState {
  const folder = state.folders.find(candidate => candidate.id === folderId);
  if (!folder) {
    throw new Error('Folder 不存在');
  }
  if (folder.system) {
    throw new Error('系统 Folder 不能改名');
  }

  const normalized = normalizedName(name, 'Folder');
  assertUniqueFolderName(state, normalized, folderId);

  if (folder.name === normalized) {
    return state;
  }

  return {
    ...state,
    folders: state.folders.map(candidate =>
      candidate.id === folderId ? { ...candidate, name: normalized } : candidate,
    ),
  };
}

export function deleteFolder(
  state: ManagerState,
  folderId: string,
): ManagerState {
  const folder = state.folders.find(candidate => candidate.id === folderId);
  if (!folder) {
    return state;
  }
  if (folder.system) {
    throw new Error('系统 Folder 不能删除');
  }

  const books = Object.fromEntries(
    Object.entries(state.books).map(([name, meta]) => [
      name,
      meta.folderId === folderId
        ? { ...meta, folderId: UNFILED_FOLDER_ID, manuallyFiled: true }
        : meta,
    ]),
  );

  return {
    ...state,
    folders: state.folders.filter(candidate => candidate.id !== folderId),
    books,
    prefixRules: state.prefixRules.filter(rule => rule.folderId !== folderId),
  };
}

export function createTag(
  state: ManagerState,
  id: string,
  name: string,
): ManagerState {
  const normalized = normalizedName(name, 'Tag');
  assertUniqueTagName(state, normalized);

  const tag: Tag = {
    id,
    name: normalized,
  };

  return {
    ...state,
    tags: [...state.tags, tag],
  };
}

export function renameTag(
  state: ManagerState,
  tagId: string,
  name: string,
): ManagerState {
  const tag = state.tags.find(candidate => candidate.id === tagId);
  if (!tag) {
    throw new Error('Tag 不存在');
  }

  const normalized = normalizedName(name, 'Tag');
  assertUniqueTagName(state, normalized, tagId);

  if (tag.name === normalized) {
    return state;
  }

  return {
    ...state,
    tags: state.tags.map(candidate =>
      candidate.id === tagId ? { ...candidate, name: normalized } : candidate,
    ),
  };
}

export function deleteTag(state: ManagerState, tagId: string): ManagerState {
  if (!state.tags.some(tag => tag.id === tagId)) {
    return state;
  }

  const books = Object.fromEntries(
    Object.entries(state.books).map(([name, meta]) => [
      name,
      meta.tagIds.includes(tagId)
        ? { ...meta, tagIds: meta.tagIds.filter(candidate => candidate !== tagId) }
        : meta,
    ]),
  );

  return {
    ...state,
    tags: state.tags.filter(tag => tag.id !== tagId),
    books,
  };
}

export function updateLorebookOrganization(
  state: ManagerState,
  lorebookName: string,
  organization: {
    folderId: string;
    tagIds: readonly string[];
  },
): ManagerState {
  const meta = state.books[lorebookName];
  if (!meta) {
    throw new Error(`世界书「${lorebookName}」不在 Editor metadata 中`);
  }
  if (!state.folders.some(folder => folder.id === organization.folderId)) {
    throw new Error('目标 Folder 不存在');
  }

  const knownTagIds = new Set(state.tags.map(tag => tag.id));
  const tagIds = [...new Set(organization.tagIds)];
  const unknownTag = tagIds.find(tagId => !knownTagIds.has(tagId));
  if (unknownTag) {
    throw new Error(`目标 Tag 不存在：${unknownTag}`);
  }

  if (
    meta.folderId === organization.folderId &&
    meta.tagIds.length === tagIds.length &&
    meta.tagIds.every((tagId, index) => tagId === tagIds[index])
  ) {
    return state;
  }

  return {
    ...state,
    books: {
      ...state.books,
      [lorebookName]: {
        ...meta,
        folderId: organization.folderId,
        tagIds,
        manuallyFiled: true,
      },
    },
  };
}
