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
