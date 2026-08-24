import { loadManagerState, saveManagerState } from '../data/metadata';
import { readLorebookNames } from '../data/tavern';
import { reconcileLorebooks } from '../domain/reconcile';
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

function invalidStateError(issues: readonly string[]): Error {
  return new Error(`Worldbook Manager metadata 无法通过校验，已拒绝自动覆盖。\n${issues.join('\n')}`);
}

export async function syncManagerState(now = Date.now()): Promise<{
  state: ManagerState;
  report: ManagerSyncReport;
}> {
  return mutationQueue.run(MANAGER_STATE_QUEUE_KEY, async () => {
    const currentNames = readLorebookNames();
    const loaded = loadManagerState();

    if (loaded.kind === 'invalid') {
      throw invalidStateError(loaded.issues);
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

export async function mutateManagerState(
  mutator: (state: ManagerState) => ManagerState,
  now = Date.now(),
): Promise<ManagerState> {
  return mutationQueue.run(MANAGER_STATE_QUEUE_KEY, async () => {
    const currentNames = readLorebookNames();
    const loaded = loadManagerState();

    if (loaded.kind === 'invalid') {
      throw invalidStateError(loaded.issues);
    }

    const reconciled =
      loaded.kind === 'missing'
        ? undefined
        : reconcileLorebooks(loaded.state, currentNames, now);
    const baseState =
      loaded.kind === 'missing'
        ? createBaselineState(currentNames, now)
        : reconciled!.state;
    const baseChanged = loaded.kind === 'missing' || reconciled!.changed;

    const nextState = mutator(baseState);
    if (nextState === baseState && !baseChanged) {
      return baseState;
    }

    return saveManagerState(nextState);
  });
}
