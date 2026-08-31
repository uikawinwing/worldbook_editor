import { z } from 'zod';

export const MANAGER_STATE_VERSION = 1;
export const MANAGER_STATE_VARIABLE_KEY = 'worldbook_editor_state';
export const UNFILED_FOLDER_ID = 'system:unfiled';

const folderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  order: z.number(),
  color: z.string().optional(),
  icon: z.string().optional(),
  system: z.boolean().optional(),
});

const tagSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

const bookMetaSchema = z.object({
  folderId: z.string().min(1),
  tagIds: z.array(z.string()),
  firstSeenAt: z.number().optional(),
  manuallyFiled: z.boolean().optional(),
  lastKnownExists: z.boolean().optional(),
});

const prefixRuleSchema = z.object({
  id: z.string().min(1),
  prefix: z.string().min(1),
  folderId: z.string().min(1),
  enabled: z.boolean(),
  hidePrefixInTargetFolder: z.boolean(),
});

const chatBindingRefSchema = z.object({
  character: z.string().optional(),
  chat: z.string().optional(),
});

const trashMetaSchema = z.object({
  deletedAt: z.number(),
  originalFolderId: z.string(),
  originalTagIds: z.array(z.string()),
  bindings: z
    .object({
      global: z.boolean().optional(),
      characters: z.array(z.string()).optional(),
      chats: z.array(chatBindingRefSchema).optional(),
    })
    .optional(),
});

const managerSettingsSchema = z.object({
  recentDays: z.number().int().positive(),
  trashRetentionDays: z.number().int().positive(),
  autoFileNewBooks: z.boolean(),
});

const managerCacheSchema = z.object({
  characterBindings: z.record(z.string(), z.array(z.string())),
  chatBindings: z.record(z.string(), z.array(chatBindingRefSchema)),
  entryCounts: z.record(z.string(), z.number().int().nonnegative()),
  lastBindingScanAt: z.number().optional(),
});

export const managerStateSchema = z.object({
  version: z.literal(MANAGER_STATE_VERSION),
  baselineAt: z.number(),
  folders: z.array(folderSchema),
  tags: z.array(tagSchema),
  books: z.record(z.string(), bookMetaSchema),
  prefixRules: z.array(prefixRuleSchema),
  trash: z.record(z.string(), trashMetaSchema),
  settings: managerSettingsSchema,
  cache: managerCacheSchema,
});

export type Folder = z.infer<typeof folderSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type BookMeta = z.infer<typeof bookMetaSchema>;
export type PrefixRule = z.infer<typeof prefixRuleSchema>;
export type TrashMeta = z.infer<typeof trashMetaSchema>;
export type ManagerSettings = z.infer<typeof managerSettingsSchema>;
export type ManagerCache = z.infer<typeof managerCacheSchema>;
export type ManagerState = z.infer<typeof managerStateSchema>;
export type ChatBindingRef = z.infer<typeof chatBindingRefSchema>;

export const UNFILED_FOLDER: Folder = {
  id: UNFILED_FOLDER_ID,
  name: '未分类',
  order: 0,
  icon: '📥',
  system: true,
};

export function createBaselineState(lorebookNames: readonly string[], now = Date.now()): ManagerState {
  const books = Object.fromEntries(
    [...new Set(lorebookNames)].map(name => [
      name,
      {
        folderId: UNFILED_FOLDER_ID,
        tagIds: [],
        lastKnownExists: true,
      } satisfies BookMeta,
    ]),
  );

  return {
    version: MANAGER_STATE_VERSION,
    baselineAt: now,
    folders: [{ ...UNFILED_FOLDER }],
    tags: [],
    books,
    prefixRules: [],
    trash: {},
    settings: {
      recentDays: 30,
      trashRetentionDays: 30,
      autoFileNewBooks: true,
    },
    cache: {
      characterBindings: {},
      chatBindings: {},
      entryCounts: {},
    },
  };
}
