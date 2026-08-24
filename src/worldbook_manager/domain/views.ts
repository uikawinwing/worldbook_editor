import type { ManagerState } from '../model';

export type RuntimeBindings = {
  globalLorebooks: ReadonlySet<string>;
  charactersByBook: Readonly<Record<string, readonly string[]>>;
};

export type LorebookSummary = {
  name: string;
  displayName: string;
  exists: boolean;
  folderId: string;
  tagIds: string[];
  firstSeenAt?: number;
  inTrash: boolean;
  globalEnabled: boolean;
  characterNames: string[];
  chatBindingsKnown: number;
  entryCount?: number;
};

export type SmartViewId = 'recent' | 'bound' | 'unbound' | 'trash';
export type ViewSource =
  | { type: 'folder'; folderId: string }
  | { type: 'smart'; smartId: SmartViewId };

export type ViewState = {
  source: ViewSource;
  tagIds: string[];
  search: string;
  sort: 'name' | 'recent' | 'entryCount';
  boundSubtype?: 'all' | 'character' | 'chat';
};

function getDisplayName(state: ManagerState, name: string, folderId: string): string {
  const rule = state.prefixRules.find(
    candidate =>
      candidate.enabled &&
      candidate.hidePrefixInTargetFolder &&
      candidate.folderId === folderId &&
      name.startsWith(candidate.prefix),
  );

  return rule ? name.slice(rule.prefix.length).trimStart() || name : name;
}

export function buildLorebookSummaries(
  state: ManagerState,
  runtime: RuntimeBindings,
): LorebookSummary[] {
  return Object.entries(state.books).map(([name, meta]) => ({
    name,
    displayName: getDisplayName(state, name, meta.folderId),
    exists: meta.lastKnownExists !== false,
    folderId: meta.folderId,
    tagIds: [...meta.tagIds],
    firstSeenAt: meta.firstSeenAt,
    inTrash: Object.prototype.hasOwnProperty.call(state.trash, name),
    globalEnabled: runtime.globalLorebooks.has(name),
    characterNames: [...(runtime.charactersByBook[name] ?? [])],
    chatBindingsKnown: state.cache.chatBindings[name]?.length ?? 0,
    entryCount: state.cache.entryCounts[name],
  }));
}

function isBound(summary: LorebookSummary): boolean {
  return summary.characterNames.length > 0 || summary.chatBindingsKnown > 0;
}

function matchesSource(
  summary: LorebookSummary,
  view: ViewState,
  recentThreshold: number,
): boolean {
  if (view.source.type === 'folder') {
    return !summary.inTrash && summary.exists && summary.folderId === view.source.folderId;
  }

  if (view.source.smartId === 'trash') {
    return summary.inTrash;
  }

  if (summary.inTrash || !summary.exists) {
    return false;
  }

  if (view.source.smartId === 'recent') {
    return summary.firstSeenAt !== undefined && summary.firstSeenAt >= recentThreshold;
  }

  if (view.source.smartId === 'unbound') {
    return !isBound(summary);
  }

  const subtype = view.boundSubtype ?? 'all';
  if (subtype === 'character') {
    return summary.characterNames.length > 0;
  }
  if (subtype === 'chat') {
    return summary.chatBindingsKnown > 0;
  }
  return isBound(summary);
}

export function filterLorebookSummaries(
  state: ManagerState,
  summaries: readonly LorebookSummary[],
  view: ViewState,
  now = Date.now(),
): LorebookSummary[] {
  const recentThreshold = now - state.settings.recentDays * 24 * 60 * 60 * 1000;
  const search = view.search.trim().toLocaleLowerCase();
  const selectedTags = new Set(view.tagIds);

  const filtered = summaries.filter(summary => {
    if (!matchesSource(summary, view, recentThreshold)) {
      return false;
    }
    if (selectedTags.size > 0 && ![...selectedTags].every(tagId => summary.tagIds.includes(tagId))) {
      return false;
    }
    if (
      search &&
      !summary.displayName.toLocaleLowerCase().includes(search) &&
      !summary.name.toLocaleLowerCase().includes(search)
    ) {
      return false;
    }
    return true;
  });

  return [...filtered].sort((left, right) => {
    if (view.sort === 'recent') {
      return (right.firstSeenAt ?? 0) - (left.firstSeenAt ?? 0) || left.displayName.localeCompare(right.displayName);
    }
    if (view.sort === 'entryCount') {
      return (right.entryCount ?? -1) - (left.entryCount ?? -1) || left.displayName.localeCompare(right.displayName);
    }
    return left.displayName.localeCompare(right.displayName, 'zh-Hans-CN', {
      numeric: true,
      sensitivity: 'base',
    });
  });
}
