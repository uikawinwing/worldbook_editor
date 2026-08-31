import { syncManagerState } from './services/state';
import { destroyManagerUi, openManagerUi } from './ui/manager';

const BUTTON_NAME = '世界书编辑器';

function reportError(context: string, error: unknown): void {
  console.error(`[Worldbook Editor] ${context}`, error);
  toastr.error(error instanceof Error ? error.message : String(error), 'Worldbook Editor');
}

async function openManager(): Promise<void> {
  try {
    await openManagerUi();
  } catch (error) {
    reportError('启动失败', error);
  }
}

destroyManagerUi();
appendInexistentScriptButtons([{ name: BUTTON_NAME, visible: true }]);
eventOn(getButtonEvent(BUTTON_NAME), openManager);

$(window)
  .off('pagehide.worldbook-editor')
  .on('pagehide.worldbook-editor', () => destroyManagerUi());

void syncManagerState().catch(error => reportError('初始化 metadata 失败', error));
