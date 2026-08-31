import {
  MANAGER_STATE_VARIABLE_KEY,
  type ManagerState,
  managerStateSchema,
} from '../model';

export type ManagerStateLoadResult =
  | { kind: 'missing' }
  | { kind: 'ok'; state: ManagerState }
  | { kind: 'invalid'; raw: unknown; issues: string[] };

export function loadManagerState(): ManagerStateLoadResult {
  const variables = getVariables({ type: 'script' });
  const raw = variables[MANAGER_STATE_VARIABLE_KEY];

  if (raw === undefined) {
    return { kind: 'missing' };
  }

  const parsed = managerStateSchema.safeParse(raw);
  if (parsed.success) {
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
    variables => ({
      ...variables,
      [MANAGER_STATE_VARIABLE_KEY]: validated,
    }),
    { type: 'script' },
  );

  return validated;
}
