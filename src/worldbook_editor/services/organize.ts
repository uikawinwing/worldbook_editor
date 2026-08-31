import {
  createFolder as createFolderDomain,
  createTag as createTagDomain,
  deleteFolder as deleteFolderDomain,
  deleteTag as deleteTagDomain,
  renameFolder as renameFolderDomain,
  renameTag as renameTagDomain,
  updateLorebookOrganization as updateLorebookOrganizationDomain,
} from '../domain/organize';
import type { ManagerState } from '../model';
import { mutateManagerState } from './state';

function createStableId(prefix: 'folder' | 'tag'): string {
  const randomId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}:${randomId}`;
}

export function createFolder(name: string): Promise<ManagerState> {
  return mutateManagerState(state =>
    createFolderDomain(state, createStableId('folder'), name),
  );
}

export function renameFolder(
  folderId: string,
  name: string,
): Promise<ManagerState> {
  return mutateManagerState(state => renameFolderDomain(state, folderId, name));
}

export function deleteFolder(folderId: string): Promise<ManagerState> {
  return mutateManagerState(state => deleteFolderDomain(state, folderId));
}

export function createTag(name: string): Promise<ManagerState> {
  return mutateManagerState(state =>
    createTagDomain(state, createStableId('tag'), name),
  );
}

export function renameTag(tagId: string, name: string): Promise<ManagerState> {
  return mutateManagerState(state => renameTagDomain(state, tagId, name));
}

export function deleteTag(tagId: string): Promise<ManagerState> {
  return mutateManagerState(state => deleteTagDomain(state, tagId));
}

export function updateLorebookOrganization(
  lorebookName: string,
  organization: {
    folderId: string;
    tagIds: readonly string[];
  },
): Promise<ManagerState> {
  return mutateManagerState(state =>
    updateLorebookOrganizationDomain(state, lorebookName, organization),
  );
}
