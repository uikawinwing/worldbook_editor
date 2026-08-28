# worldbook_editor 开发说明

本仓库是独立可构建的 TavernHelper 项目。任何人只 clone 本仓库后，都应能通过 `pnpm install` 完成开发环境，不得依赖 `../../Toolchain` 或其他仓库。

## 开发边界

- 业务源码位于 `src/**`，只做与当前任务直接相关的修改。
- TavernHelper 类型、`util/`、webpack、PostCSS、Tailwind、schema tooling、依赖与 lockfile 都保存在本仓库，保证 standalone build。
- Master 本机的 `TavernDev/Toolchain` 只是维护者同步上游模板的本地工具来源；它可以把更新复制到 `dev`，但本仓库源码、脚本和 CI 禁止反向引用 Toolchain。
- 上游同步优先形成一个清晰的 `chore: sync TavernHelper upstream ...` commit，不把 bot bump/sync commit 散落进历史。

## Branch 与发布

- `dev`：唯一日常开发与模板同步分支。
- `main`：稳定发布分支；禁止直接 push、force push、删除，并应由 GitHub Ruleset 强制只能通过本仓库 `dev -> main` 的 PR 进入。
- 其他 feature branch 如需使用，先进入 `dev`，不得直接进入 `main`。
- `dev` push / PR 只运行 verify，不 commit、不 tag、不修改仓库。
- `main` 更新后由 `.github/workflows/bundle.yaml` fresh install、typecheck、build；验证成功后把当次 `dist` 放进 release-only commit 并创建新的 `vX.Y.Z` tag，只 push tag，不把 release commit 回写 `main`。
- 已发布 tag 永不移动、覆盖或删除。

## dist 规则

`dist` 是生成物，不是源码真相。正常开发、branch 切换、PR 或 merge 时，不要因为本地 `dist` 缺失、旧、dirty 或与其他 branch 不同而阻止操作，也不要为了让 Git 状态好看反复 rebuild。正式发布由 main workflow 重新生成并冻结到 tag。

## 本地开发

首次 clone：

```bash
pnpm install --frozen-lockfile
```

常用验证：

```bash
pnpm typecheck
pnpm build
```

修改 UI/脚本时仍遵循本仓库 `.agents/skills/` 中对应 TavernHelper Skill 与现有代码风格。

## Git 安全

- 不使用 `git clean`、`reset --hard`、force push 或历史重写作为日常处理手段。
- 删除或覆盖内容前优先使用可恢复方式。
- 未经 Master 明确要求，不直接创建/删除/移动 release tag。
- 修改发布流程前保留 safety branch；发现方案不合适时优先 revert 对应架构 commit，而不是继续叠兼容层。
