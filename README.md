# worldbook_editor

TavernHelper 世界书管理脚本。项目业务代码位于 `src/worldbook_manager`，项目结构说明见 [`docs/architecture.md`](docs/architecture.md)。

## Shared Toolchain

本仓库是 thin consumer，不再自带整套 TavernHelper 模板与依赖。

本地目录约定：

```text
TavernDev/
├─ Toolchain/                 # uikawinwing/tavern_helper_toolchain
└─ Scripts/
   └─ worldbook_editor/       # 本仓库
```

共享 Toolchain 负责：

- npm/pnpm dependencies 与 `node_modules`
- TavernHelper `@types`
- `util`
- webpack / PostCSS / Tailwind / schema tooling
- 模板示例和初始模板
- dependency / upstream template 更新
- reusable GitHub Actions

本仓库只维护自己的源码、文档、项目级配置和发布产物。

## 本地开发

先确保 `../../Toolchain` 已存在且依赖已安装，然后在本仓库运行：

```bash
npm run typecheck
npm run build
npm run build:dev
npm run watch
```

这些命令不会安装本地依赖，而是调用 `../../Toolchain`。

不要在本仓库运行 `npm install` / `pnpm install` 来重新建立一套依赖；共享依赖统一安装在：

```text
../../Toolchain/node_modules
```

## CI

- Pull Request：`.github/workflows/verify.yaml` 调用中央 `consumer-verify.yaml`，只做 typecheck + build。
- main/master push、定时或手动运行：`.github/workflows/bundle.yaml` 调用中央 `consumer-bundle.yaml`，重新生成 `dist` 并处理发布 tag。
- dependency、TavernHelper types 与 StageDog template 同步只在 `uikawinwing/tavern_helper_toolchain` 中进行。

## 目录职责

```text
worldbook_editor/
├─ src/                       # 项目业务源码
├─ docs/                      # 项目文档
├─ dist/                      # CI 生成的发布产物
├─ .github/workflows/         # thin CI callers
├─ .vscode/                   # 本地开发配置
├─ package.json               # shared Toolchain 命令入口
└─ tsconfig.json              # extends ../../Toolchain/tsconfig.json
```

共享 TavernHelper 类型、示例、工具函数和构建配置请直接查看 `../../Toolchain`，不要复制回本仓库。

## License

See [`LICENSE`](LICENSE).
