import {
  createLorebookEntries,
  readLorebookEntries,
  removeLorebookEntry,
  updateLorebookEntries,
} from '../data/tavern';

export type EntryEditorDraft = {
  name: string;
  enabled: boolean;
  content: string;
  probability: number;
  strategyType: WorldbookEntry['strategy']['type'];
  keys: WorldbookEntry['strategy']['keys'];
  positionType: WorldbookEntry['position']['type'];
  role: WorldbookEntry['position']['role'];
  depth: number;
  order: number;
};

export function loadLorebookEntries(worldbookName: string): Promise<WorldbookEntry[]> {
  return readLorebookEntries(worldbookName);
}

export async function createEntry(worldbookName: string): Promise<{
  worldbook: WorldbookEntry[];
  entry: WorldbookEntry;
}> {
  const result = await createLorebookEntries(worldbookName, [
    {
      name: '新条目',
      enabled: true,
      content: '',
    },
  ]);
  const entry = result.new_entries[0];
  if (!entry) throw new Error('Tavern 没有返回新建的世界书条目');
  return { worldbook: result.worldbook, entry };
}

export async function updateEntry(
  worldbookName: string,
  uid: number,
  draft: EntryEditorDraft,
): Promise<WorldbookEntry[]> {
  let found = false;
  const updated = await updateLorebookEntries(worldbookName, entries =>
    entries.map(entry => {
      if (entry.uid !== uid) return entry;
      found = true;
      return {
        ...entry,
        name: draft.name,
        enabled: draft.enabled,
        content: draft.content,
        probability: draft.probability,
        strategy: {
          ...entry.strategy,
          type: draft.strategyType,
          keys: draft.keys,
        },
        position: {
          ...entry.position,
          type: draft.positionType,
          role: draft.role,
          depth: draft.depth,
          order: draft.order,
        },
      };
    }),
  );
  if (!found) throw new Error(`找不到世界书条目 uid=${uid}`);
  return updated;
}

export async function deleteEntry(worldbookName: string, uid: number): Promise<WorldbookEntry[]> {
  const result = await removeLorebookEntry(worldbookName, uid);
  if (result.deleted_entries.length === 0) throw new Error(`找不到世界书条目 uid=${uid}`);
  return result.worldbook;
}
