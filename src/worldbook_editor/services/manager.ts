import {
  readCharacterBindings,
  readGlobalLorebookNames,
  type CharacterBindingScan,
} from '../data/tavern';
import { buildLorebookSummaries, type LorebookSummary } from '../domain/views';
import type { ManagerState } from '../model';
import { syncManagerState, type ManagerSyncReport } from './state';

export type ManagerRuntimeSnapshot = {
  globalLorebooks: ReadonlySet<string>;
  characterBindings: CharacterBindingScan;
};

export type ManagerBootstrapResult = {
  state: ManagerState;
  summaries: LorebookSummary[];
  sync: ManagerSyncReport;
  runtime: ManagerRuntimeSnapshot;
};

export async function bootstrapManager(
  runtime?: ManagerRuntimeSnapshot,
): Promise<ManagerBootstrapResult> {
  const { state, report } = await syncManagerState();
  const resolvedRuntime =
    runtime ??
    ({
      globalLorebooks: new Set(readGlobalLorebookNames()),
      characterBindings: readCharacterBindings(),
    } satisfies ManagerRuntimeSnapshot);

  const summaries = buildLorebookSummaries(state, {
    globalLorebooks: resolvedRuntime.globalLorebooks,
    charactersByBook: resolvedRuntime.characterBindings.byBook,
  });

  return {
    state,
    summaries,
    sync: report,
    runtime: resolvedRuntime,
  };
}
