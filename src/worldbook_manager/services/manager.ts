import { loadManagerState, saveManagerState } from '../data/metadata';
import {
  readCharacterBindings,
  readGlobalLorebookNames,
  readLorebookNames,
  type CharacterBindingScan,
} from '../data/tavern';
import { reconcileLorebooks } from '../domain/reconcile';
import { buildLorebookSummaries, type LorebookSummary } from '../domain/views';
import { KeyedQueue } from '../infra/keyed-queue';
import { createBaselineState, type ManagerState } from '../model';

const mutationQueue = new KeyedQueue();
const MANAGER_STATE_QUEUE_KEY = 'manager-state';

export type ManagerSyncReport = {
  initialized: boolean;
  changed: boolean;
  added: string[];
  missing: string[];
  restored: string[];
};

export type ManagerBootstrapResult = {
  state: ManagerState;
  summaries: LorebookSummary[];
  sync: ManagerSyncReport;
  characterBindings: CharacterBindingScan;
};

export async function syncManagerState(now = Date.now()): Promise<{
  state: ManagerState;
  report: ManagerSyncReport;
}> {
  return mutationQueue.run(MANAGER_STATE_QUEUE_KEY, async () => {
    const currentNames = readLorebookNames();
    const loaded = loadManagerState();

    if (loaded.kind === 'invalid') {
      throw new Error(
        `Worldbook Manager metadata 无法通过校验，已拒绝自动覆盖。\n${loaded.issues.join('\n')}`,
      );
    }

    if (loaded.kind === 'missing') {
      const state = saveManagerState(createBaselineState(currentNames, now));
      return {
        state,
        report: {
          initialized: true,
          changed: true,
          added: [],
          missing: [],
          restored: [],
        },
      };
    }

    const reconciled = reconcileLorebooks(loaded.state, currentNames, now);
    const state = reconciled.changed ? saveManagerState(reconciled.state) : reconciled.state;

    return {
      state,
      report: {
        initialized: false,
        changed: reconciled.changed,
        added: reconciled.added,
        missing: reconciled.missing,
        restored: reconciled.restored,
      },
    };
  });
}

export async function bootstrapManager(): Promise<ManagerBootstrapResult> {
  const { state, report } = await syncManagerState();
  const globalLorebooks = new Set(readGlobalLorebookNames());
  const characterBindings = readCharacterBindings();
  const summaries = buildLorebookSummaries(state, {
    globalLorebooks,
    charactersByBook: characterBindings.byBook,
  });

  return {
    state,
    summaries,
    sync: report,
    characterBindings,
  };
}
