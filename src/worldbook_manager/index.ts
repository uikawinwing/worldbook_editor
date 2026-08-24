import { bootstrapManager, syncManagerState } from './services/manager';

const BUTTON_NAME = '世界书管理器';

function reportError(context: string, error: unknown): void {
  console.error(`[Worldbook Manager] ${context}`, error);
  toastr.error(error instanceof Error ? error.message : String(error), 'Worldbook Manager');
}

async function openManagerFoundation(): Promise<void> {
  try {
    const result = await bootstrapManager();

    console.groupCollapsed(
      `[Worldbook Manager] ${result.summaries.length} books · ${result.characterBindings.scannedCharacters.length} characters`,
    );
    console.log('sync', result.sync);
    console.log('state', result.state);
    console.table(
      result.summaries.map(book => ({
        name: book.name,
        folder: book.folderId,
        tags: book.tagIds.length,
        characterBindings: book.characterNames.length,
        global: book.globalEnabled,
        trash: book.inTrash,
      })),
    );
    if (result.characterBindings.failures.length > 0) {
      console.warn('[Worldbook Manager] character binding scan failures', result.characterBindings.failures);
    }
    console.groupEnd();

    toastr.info('基础数据层已同步；完整 Manager UI 将在下一里程碑接入。', 'Worldbook Manager');
  } catch (error) {
    reportError('启动失败', error);
  }
}

appendInexistentScriptButtons([{ name: BUTTON_NAME, visible: true }]);
eventOn(getButtonEvent(BUTTON_NAME), openManagerFoundation);

void syncManagerState().catch(error => reportError('初始化 metadata 失败', error));
