# worldbook_editor 开发说明

本仓库是一个 **TavernHelper consumer 项目**，共享开发环境位于同级工作区的 `../../Toolchain`。

## 开发前必须遵守

- 在修改 `src/**` 前，先读取 `../../Toolchain/AGENTS.md`；需要具体 TavernHelper / MVU 指引时，从 `../../Toolchain/.agents/skills/` 读取对应 skill。
- TavernHelper 类型定义以 `../../Toolchain/@types` 为唯一来源。
- 公共工具函数以 `../../Toolchain/util` 为唯一来源；项目内通过 `@util/*` 使用。
- 构建、webpack、schema、PostCSS、Tailwind、依赖版本与模板示例均由 `../../Toolchain` 维护，不要在本仓库重新复制一套。
- 本仓库不要添加自己的 `node_modules`、`pnpm-lock.yaml`、共享依赖列表或模板同步逻辑；如果共享构建能力有问题，应修 Toolchain contract，而不是在 consumer 内绕开。

## 本仓库负责的内容

- `src/**`：worldbook_editor 的真实业务源码。
- `docs/**`：本项目架构与项目文档。
- `package.json` / `tsconfig.json`：仅保留调用共享 Toolchain 所需的薄配置。
- `.vscode/**` / `.mcp.json`：本项目本地开发入口。
- `.github/workflows/verify.yaml`：PR 只读验证。
- `.github/workflows/bundle.yaml`：main/master 发布打包入口。
- `dist/**`：CI 生成的发布产物。

## 验证

在本仓库运行：

- `npm run typecheck`
- `npm run build`
- `npm run build:dev`
- `npm run watch`

这些命令都会转交给 `../../Toolchain`。依赖只安装在 `../../Toolchain/node_modules`。

## CI 边界

- Pull Request：调用中央 `consumer-verify.yaml`，只做安装、typecheck、build；不得 commit 或 tag。
- main/master push、定时任务或手动触发：调用中央 `consumer-bundle.yaml`，负责重新打包 `dist` 与发布 tag。
- 依赖升级、TavernHelper `@types` 更新、模板同步只在中央 Toolchain 仓库进行。
