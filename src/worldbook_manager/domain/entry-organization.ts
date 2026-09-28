import { parse } from 'yaml';
import { z } from 'zod';

export const ORGANIZATION_RULE_ENTRY_NAME = '[Worldbook Editor] Entry Organization';
const ORGANIZATION_RULE_MARKER = 'entry_organization_rules';

const extractAllSchema = z.object({
  type: z.literal('all'),
  pattern: z.string().min(1),
  flags: z.string().default('g'),
  capture: z.number().int().min(0).default(1),
});

const extractGroupsSchema = z.object({
  type: z.literal('groups'),
  groups: z.array(z.number().int().min(1)).min(1),
});

const ignoreRuleSchema = z.object({
  id: z.string().min(1).optional(),
  source: z.enum(['name', 'content']).default('name'),
  match: z.string().min(1),
  flags: z.string().default(''),
});

const organizationRuleSchema = z.object({
  id: z.string().min(1).optional(),
  source: z.enum(['name', 'content']).default('name'),
  match: z.string().min(1),
  flags: z.string().default(''),
  extract: z.discriminatedUnion('type', [extractAllSchema, extractGroupsSchema]),
  ignore: z.array(z.string()).default([]),
  stripMatch: z.boolean().default(false),
});

const DEFAULT_IGNORE_RULES = [
  {
    id: 'human-separator-arrows',
    source: 'name' as const,
    match: '^(?:\\[[^\\]]+\\])*\\s*➡️.*(?:开始|结束)\\s*$',
    flags: '',
  },
];

const organizationConfigSchema = z.object({
  version: z.literal(1),
  ignoreRules: z.array(ignoreRuleSchema).default(DEFAULT_IGNORE_RULES),
  rules: z.array(organizationRuleSchema),
});

export type OrganizationConfig = z.infer<typeof organizationConfigSchema>;

export type OrganizationConfigState = {
  entry?: WorldbookEntry;
  config?: OrganizationConfig;
  error?: string;
};

export type OrganizedEntry = {
  entry: WorldbookEntry;
  path: string[];
  displayName: string;
  ruleId?: string;
};

export const DEFAULT_ORGANIZATION_RULES_YAML = `version: 1
ignoreRules:
  - id: human-separator-arrows
    source: name
    match: '^(?:\\[[^\\]]+\\])*\\s*➡️.*(?:开始|结束)\\s*$'
rules:
  - id: tag-block-prefix
    source: name
    match: '^(?:\\[[^\\]]+\\])+'
    extract:
      type: all
      pattern: '\\[([^\\]]+)\\]'
      capture: 1
    ignore: []
    stripMatch: true
`;

function markerOf(entry: WorldbookEntry): unknown {
  return entry.extra?.worldbook_editor;
}

export function isOrganizationConfigEntry(entry: WorldbookEntry): boolean {
  const marker = markerOf(entry);
  if (
    marker &&
    typeof marker === 'object' &&
    'kind' in marker &&
    (marker as { kind?: unknown }).kind === ORGANIZATION_RULE_MARKER
  ) {
    return true;
  }
  return entry.name === ORGANIZATION_RULE_ENTRY_NAME;
}

function sourceText(entry: WorldbookEntry, source: 'name' | 'content'): string {
  return source === 'content' ? entry.content : entry.name;
}

function compileRegex(pattern: string, flags: string): RegExp {
  return new RegExp(pattern, flags);
}

export function parseOrganizationConfig(content: string): OrganizationConfig {
  const config = organizationConfigSchema.parse(parse(content));

  for (const [index, rule] of config.ignoreRules.entries()) {
    try {
      compileRegex(rule.match, rule.flags.replaceAll('g', ''));
    } catch (error) {
      throw new Error(
        `忽略规则 ${rule.id ?? index + 1} 的正则无效：${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
    }
  }

  for (const [index, rule] of config.rules.entries()) {
    try {
      compileRegex(rule.match, rule.flags.replaceAll('g', ''));
      if (rule.extract.type === 'all') {
        compileRegex(rule.extract.pattern, rule.extract.flags);
      }
    } catch (error) {
      throw new Error(
        `整理规则 ${rule.id ?? index + 1} 的正则无效：${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
    }
  }
  return config;
}

export function readOrganizationConfig(entries: readonly WorldbookEntry[]): OrganizationConfigState {
  const entry = entries.find(isOrganizationConfigEntry);
  if (!entry) return {};

  try {
    const parsed = parseOrganizationConfig(entry.content);
    return { entry, config: parsed };
  } catch (error) {
    return {
      entry,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function shouldIgnoreEntry(entry: WorldbookEntry, config: OrganizationConfig): boolean {
  return config.ignoreRules.some(rule => {
    try {
      const source = sourceText(entry, rule.source);
      return compileRegex(rule.match, rule.flags.replaceAll('g', '')).test(source);
    } catch {
      return false;
    }
  });
}

function extractSegments(
  match: RegExpMatchArray,
  rule: OrganizationConfig['rules'][number],
): string[] {
  if (rule.extract.type === 'groups') {
    return rule.extract.groups
      .map(index => match[index] ?? '')
      .map(value => value.trim())
      .filter(Boolean);
  }

  const flags = rule.extract.flags.includes('g') ? rule.extract.flags : `${rule.extract.flags}g`;
  const extractor = compileRegex(rule.extract.pattern, flags);
  const segments: string[] = [];
  let extracted: RegExpExecArray | null;

  while ((extracted = extractor.exec(match[0])) !== null) {
    const value = extracted[rule.extract.capture] ?? '';
    if (value.trim()) segments.push(value.trim());
    if (extracted[0] === '') extractor.lastIndex += 1;
  }

  return segments;
}

function applyRule(
  entry: WorldbookEntry,
  rule: OrganizationConfig['rules'][number],
): Omit<OrganizedEntry, 'entry'> | undefined {
  const source = sourceText(entry, rule.source);
  const matcher = compileRegex(rule.match, rule.flags.replaceAll('g', ''));
  const match = source.match(matcher);
  if (!match) return undefined;

  const ignored = new Set(rule.ignore);
  const path = extractSegments(match, rule).filter(segment => !ignored.has(segment));
  const displayName =
    rule.stripMatch && rule.source === 'name' && match.index === 0
      ? entry.name.slice(match[0].length).trim() || entry.name
      : entry.name;

  return {
    path,
    displayName,
    ruleId: rule.id,
  };
}

export function organizeEntries(
  entries: readonly WorldbookEntry[],
  config: OrganizationConfig | undefined,
): OrganizedEntry[] {
  return entries
    .filter(entry => !isOrganizationConfigEntry(entry))
    .filter(entry => !config || !shouldIgnoreEntry(entry, config))
    .map(entry => {
      if (!config) return { entry, path: [], displayName: entry.name };

      for (const rule of config.rules) {
        try {
          const organized = applyRule(entry, rule);
          if (organized) return { entry, ...organized };
        } catch {
          continue;
        }
      }

      return { entry, path: [], displayName: entry.name };
    });
}

export function organizationConfigEntryDraft(
  content = DEFAULT_ORGANIZATION_RULES_YAML,
): TypeFest.PartialDeep<WorldbookEntry> {
  return {
    name: ORGANIZATION_RULE_ENTRY_NAME,
    enabled: false,
    content,
    probability: 0,
    extra: {
      worldbook_editor: {
        kind: ORGANIZATION_RULE_MARKER,
        version: 1,
      },
    },
  };
}

export function organizationConfigExtra(entry: WorldbookEntry): Record<string, any> {
  return {
    ...(entry.extra ?? {}),
    worldbook_editor: {
      kind: ORGANIZATION_RULE_MARKER,
      version: 1,
    },
  };
}
