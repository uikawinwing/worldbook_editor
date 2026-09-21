export type CharacterBindingScan = {
  byBook: Record<string, string[]>;
  scannedCharacters: string[];
  failures: Array<{ character: string; message: string }>;
};

function uniqueNames(names: readonly string[]): string[] {
  return [...new Set(names.filter(Boolean))];
}

export function readLorebookNames(): string[] {
  return uniqueNames(getWorldbookNames());
}

export function readGlobalLorebookNames(): string[] {
  return uniqueNames(getGlobalWorldbookNames());
}

export function readLorebookEntries(worldbookName: string): Promise<WorldbookEntry[]> {
  return getWorldbook(worldbookName);
}

export function updateLorebookEntries(
  worldbookName: string,
  updater: WorldbookUpdater,
): Promise<WorldbookEntry[]> {
  return updateWorldbookWith(worldbookName, updater, { render: 'immediate' });
}

export function createLorebookEntries(
  worldbookName: string,
  entries: TypeFest.PartialDeep<WorldbookEntry>[],
): Promise<{ worldbook: WorldbookEntry[]; new_entries: WorldbookEntry[] }> {
  return createWorldbookEntries(worldbookName, entries, { render: 'immediate' });
}

export function removeLorebookEntry(
  worldbookName: string,
  uid: number,
): Promise<{ worldbook: WorldbookEntry[]; deleted_entries: WorldbookEntry[] }> {
  return deleteWorldbookEntries(worldbookName, entry => entry.uid === uid, {
    render: 'immediate',
  });
}

export function readCharacterBindings(): CharacterBindingScan {
  const byBook = new Map<string, Set<string>>();
  const characters = uniqueNames(getCharacterNames());
  const failures: CharacterBindingScan['failures'] = [];

  for (const character of characters) {
    try {
      const binding = getCharWorldbookNames(character);
      const lorebooks = uniqueNames([
        ...(binding.primary ? [binding.primary] : []),
        ...binding.additional,
      ]);

      for (const lorebook of lorebooks) {
        const boundCharacters = byBook.get(lorebook) ?? new Set<string>();
        boundCharacters.add(character);
        byBook.set(lorebook, boundCharacters);
      }
    } catch (error) {
      failures.push({
        character,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    byBook: Object.fromEntries([...byBook].map(([book, names]) => [book, [...names]])),
    scannedCharacters: characters,
    failures,
  };
}
