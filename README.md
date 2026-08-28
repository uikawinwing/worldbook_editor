# worldbook_editor

TavernHelper 世界书管理脚本。项目业务代码位于 `src/worldbook_manager`，结构说明见 [`docs/architecture.md`](docs/architecture.md)。

## 本地开发

本仓库是 standalone 项目，不依赖其他仓库或共享 Toolchain。clone 后直接：

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

共享的 TavernHelper 类型、`util/`、webpack 配置、依赖与 lockfile 都保存在本仓库，因此 fork / clone 后可以独立开发。

维护者本机可能使用 `TavernDev/Toolchain` 同步 StageDog TavernHelper template 更新，但那只是本地维护工具，绝不是本仓库的 build / runtime / CI 依赖。

## Branch 与 CI

- `dev`：日常开发和上游模板同步。push / PR 只运行 verify，不发布版本。
- `main`：稳定发布。应由 GitHub Ruleset 强制只接受本仓库 `dev -> main` 的 PR，并禁止 direct push、force push 与删除。
- `main` 更新后，GitHub Actions 会 fresh install、typecheck、build；成功后创建新的 `vX.Y.Z` tag。
- 发布时生成的 `dist` 只冻结在 release tag 对应的 release-only commit；这个 commit 不回写 `main`，因此不会产生 `[bot] bundle` 历史噪音。
- 已发布 tag 不移动、不覆盖、不删除。

`dist` 是生成物。日常开发和合并时不需要让本地 `dist` 与 branch 保持一致，正式版本以 tag 中 CI 重新 build 的结果为准。

## 使用固定版本

推荐始终引用明确 tag，而不是 `@main`，例如：

```js
import 'https://testingcf.jsdelivr.net/gh/uikawinwing/worldbook_editor@v0.0.5/dist/worldbook_manager/index.js';
```

这样后续 `main` / `dev` 继续变化也不会影响已经发布的版本。

## 目录职责

```text
worldbook_editor/
├─ src/                  # 业务源码
├─ @types/               # TavernHelper / SillyTavern 类型
├─ util/                 # 共享工具函数的本仓库副本
├─ docs/                 # 项目文档
├─ .agents/skills/       # 开发参考 Skills
├─ .github/workflows/    # verify / main guard / release
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
└─ webpack.config.ts
```

## License

See [`LICENSE`](LICENSE).
