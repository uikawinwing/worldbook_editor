# Worldbook Editor 架构约束

本文件只记录维护代码时必须遵守的边界与开发顺序；产品行为以 Phase 1 规格为准。

## 目标

Phase 1 是 Lorebook Library / File Manager，不是 Entry Editor。优先解决 Folder、Tag、Smart View、批量整理与安全 Trash。

## 当前模块

```text
src/worldbook_editor/
  index.ts                  # 脚本生命周期与 Script Button；不写业务逻辑
  model.ts                  # Editor 自己拥有的数据契约与 Zod 校验
  data/
    tavern.ts               # Tavern Helper API adapter
    metadata.ts             # Script Variables persistence
  domain/
    reconcile.ts            # baseline / 新书 / 缺失书 / prefix 自动归档
    views.ts                # Summary、Smart View、Tag/Search/Sort 纯函数
    organize.ts             # Folder / Tag / 单本整理纯函数
  infra/
    keyed-queue.ts          # 无业务含义的 keyed serialization primitive
  services/
    state.ts                # Editor metadata 唯一 mutation queue + sync
    manager.ts              # 首屏 bootstrap / runtime binding snapshot
    organize.ts             # Folder / Tag application service
  ui/
    manager.ts              # UI 生命周期、事件委派、调用 service
    view.ts                 # DOM rendering；只消费 normalized state/summary
    styles.ts               # 单套 responsive 样式
```

只有出现真实独立职责才拆文件。禁止建立只转发一次调用、没有自己边界的“占位模块”。

## 单向依赖

```text
index
 ├─→ ui/manager ─→ services
 │              └→ ui/view ─→ domain/views
 └─→ services/state

services ─→ data + domain ─→ model
infra 只提供无业务含义的小工具
```

`ui/view` 可以调用纯 selector/filter，但 UI 不得直接读写 Tavern 或 Script Variables。

尤其禁止：

- `data/` import `ui/` 或决定 Folder / Tag / Trash 业务。
- `domain/` 调 Tavern Helper、DOM、localStorage、Script Variables。
- `ui/` 直接调用 `getWorldbook*`、`rebind*`、`deleteWorldbook` 或 Script Variables。
- 在 `model.ts` 塞业务流程。
- 在多个 service 各自建立 metadata mutation queue；Editor state 只能走 `services/state.ts`。

## Source of Truth

- Lorebook 是否存在：Tavern Helper / SillyTavern。
- Character / Global binding：Tavern Helper / SillyTavern。
- Folder / Tag / Prefix Rule / Trash metadata：Script Variables 中的 `worldbook_editor_state`。
- Cache 永远可以删除重建，不能反过来覆盖真实绑定。

不要把 Editor metadata 写进 Lorebook Entry、`extra`、隐藏 Entry 或 Lorebook 名称。localStorage 只可用于非关键 UI cache。

## API 策略

只使用模板 `@types` 当前推荐的 API；不为 deprecated `LorebookEntry` / `getLorebooks` 建兼容层。

Adapter 只包装真正被当前里程碑使用的 API。Tavern Helper 的原始返回结构只能在 `data/` 出现，上层使用 Editor 自己的 normalized type。

Chat history 的类型仍不稳定，因此 Chat binding mapping 必须留在 adapter 边界内，并且在真实环境验证前不能成为核心功能的阻塞条件。

## 写操作规则

Editor metadata 的所有 mutation 必须经过同一个 `KeyedQueue`。Folder / Tag 这类安全操作只写 metadata；跨 Tavern + Editor metadata 的高风险操作必须遵循：

```text
读取真实状态
→ 计算目标状态
→ 串行执行 Tavern API
→ 再读并验证结果
→ 最后提交 Editor metadata
```

UI 不能 optimistic 地假装成功。Batch 操作必须返回逐项成功/失败结果；一个失败不能抹掉其他成功项。

## UI 规则

单套 full-screen responsive UI：

- Desktop：固定 Sidebar + compact list。
- Mobile：同一 DOM，Sidebar 变 Drawer，详情变 Bottom Sheet。
- 单行世界书使用事件委派，不为每一行建立独立永久 listener。
- 不依赖 hover、右键、drag-only 操作；核心触控目标约 44px。
- 用户输入/世界书名称渲染到 HTML 前必须 escape。
- 关闭或热重载时清理 Editor root 与 document listener。

## 性能预算

首屏只允许读取 Lorebook 名称与轻量 metadata / binding。禁止为了显示列表逐本 `getWorldbook()`。

Folder / Tag 修改后复用已读取的 runtime binding snapshot，不重新扫描全部角色；只有手动刷新才重读 Character / Global binding。

Entry count、Chat mapping 等昂贵信息以后采用 lazy load + cache；搜索只过滤内存 summary，不得每输入一个字符触发 Tavern 请求。

## 开发顺序

1. **Foundation（完成）**：API adapter、metadata schema/persistence、baseline/reconcile、summary/view、mutation queue。
2. **Folder / Tag + Editor Shell（当前）**：安全 metadata CRUD、responsive UI、Folder/Smart View、Tag filter、Search、单本 Move/Tag。
3. **Batch organize**：多选、批量 Move / Add Tag / Remove Tag。
4. **Bindings / Trash**：按 read → change → verify → metadata 实现；Soft Trash 优先。
5. **Lazy enhancements**：Entry count、Chat mapping、cache refresh。
