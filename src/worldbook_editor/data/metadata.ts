import {
  MANAGER_STATE_VARIABLE_KEY,
  type ManagerState,
  managerStateSchema,
} from '../model';

const LEGACY_STATE_VARIABLE_KEY = ['worldbook', 'manager', 'state'].join('_');

export type ManagerStateLoadResult =
  | { kind: 'missing' }
  | { kind: 'ok'; state: ManagerState }
  | { kind: 'invalid'; raw: unknown; issues: string[] };

export function loadManagerState(): ManagerStateLoadResult {
  const variables = getVariables({ type: 'script' });
  const current = variables[MANAGER_STATE_VARIABLE_KEY];
  const legacy = variables[LEGACY_STATE_VARIABLE_KEY];
  const raw = current ?? legacy;

  if (raw === undefined) {
    return { kind: 'missing' };
  }

  const parsed = managerStateSchema.safeParse(raw);
  if (parsed.success) {
    if (current === undefined && legacy !== undefined) {
      updateVariablesWith(
        previous => {
          previous[MANAGER_STATE_VARIABLE_KEY] = parsed.data;
          delete previous[LEGACY_STATE_VARIABLE_KEY];
          return previous;
        },
        { type: 'script' },
      );
    }

    return { kind: 'ok', state: parsed.data };
  }

  return {
    kind: 'invalid',
    raw,
    issues: parsed.error.issues.map(issue => `${issue.path.join('.') || '<root>'}: ${issue.message}`),
  };
}

export function saveManagerState(state: ManagerState): ManagerState {
  const validated = managerStateSchema.parse(state);

  updateVariablesWith(
    variables => {
      variables[MANAGER_STATE_VARIABLE_KEY] = validated;
      delete variables[LEGACY_STATE_VARIABLE_KEY];
      return variables;
    },
    { type: 'script' },
  );

  return validated;
}
