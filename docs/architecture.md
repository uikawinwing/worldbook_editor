# Worldbook Manager 架构约束

本文件只记录维护代码时必须遵守的边界与开发顺序；产品行为以 Phase 1 规格为准。

## 目标

Phase 1 是 Lorebook Library / File Manager，不是 Entry Editor。优先解决 Folder、Tag、Smart View、批量整理与安全 Trash。

## 模块边界

当前基础层固定为 8 个代码模块：

```text
src/worldbook_manager/
  index.ts                  # 脚本生命周期与 Script Button；不写业务逻辑
  model.ts                  # Manager 自己拥有的数据契约与 Zod 校验
  data/
    tavern.ts               # Tavern Helper API adapter；只负责读取/写入 Tavern 数据
    metadata.ts             # Script Variables persistence；不懂 Folder/Trash 业务
  domain/
    reconcile.ts            # 纯函数：baseline 后的新书/缺失书/prefix 自动归档
    views.ts                # 纯函数：Summary、Folder/Smart View/Tag/Search/Sort
  infra/
    keyed-queue.ts          # 极小的 keyed serialization primitive
  services/
    manager.ts              # application coordinator；唯一允许跨 data/domain 编排的层
```

UI 到来后放在 `ui/`，但只有真的出现独立职责时才拆文件。不要为了“以后可能用”预先建立空模块。

## 单向依赖

```text
index / ui
    ↓
services
   ↙ ↘
data  domain
   ↘ ↙
  model

infra 只提供无业务含义的小工具。
```

禁止反向依赖。尤其禁止：

- `data/` import `ui/` 或决定 Folder / Tag / Trash 规则。
- `domain/` 调 Tavern Helper、DOM、localStorage、Script Variables。
- `ui/` 直接调用 `getWorldbook*`、`rebind*`、`deleteWorldbook` 或 Script Variables。
- 在 `model.ts` 塞业务流程。

## Source of Truth

- Lorebook 是否存在：Tavern Helper / SillyTavern。
- Character / Global binding：Tavern Helper / SillyTavern。
- Folder / Tag / Prefix Rule / Trash metadata：Script Variables 中的 `worldbook_manager_state`。
- Cache 永远可以删除重建，不能反过来覆盖真实绑定。

不要把 Manager metadata 写进 Lorebook Entry、`extra`、隐藏 Entry 或 Lorebook 名称。localStorage 只可用于未来的非关键 UI cache。

## API 策略

只使用模板 `@types` 当前推荐的 API；不为 deprecated `LorebookEntry` / `getLorebooks` 建兼容层。

Adapter 只包装真正被当前里程碑使用的 API。新功能需要新 API 时再加入，避免出现“万能 api.ts”。Tavern Helper 的原始返回结构只能在 `data/` 出现，上层使用 Manager 自己的 normalized type。

Chat history 目前的类型仍是 `any`，因此 Chat binding mapping 必须留在 adapter 边界内，并且在真实环境验证前不能成为核心功能的阻塞条件。

## 写操作规则

所有跨 Tavern + Manager metadata 的高风险操作必须遵循：

```text
读取真实状态
→ 计算目标状态
→ 串行执行 Tavern API
→ 再读并验证结果
→ 最后提交 Manager metadata
```

同一资源的 mutation 使用 `KeyedQueue` 串行化。不要在 UI 层 optimistic 地假装成功。

Batch 操作必须返回逐项成功/失败结果；一个失败不能抹掉其他成功项，也不能静默吞掉。

## 性能预算

首屏只允许读取 Lorebook 名称与轻量 metadata / binding。禁止为了显示列表逐本 `getWorldbook()`。

Entry count、Chat mapping 等昂贵信息以后采用 lazy load + cache；搜索只能过滤内存中的 summary，不得每输入一个字符触发 Tavern 请求。

## 开发顺序

1. **Foundation（当前）**：API adapter、metadata schema/persistence、baseline/reconcile、summary/view pure functions、mutation queue、Script Button。
2. **Folder / Tag**：创建、改名、删除、排序、批量移动与批量 Tag；先纯 domain，再 service，再 UI。
3. **Responsive Manager UI**：单套 full-screen responsive UI，desktop sidebar + mobile drawer/bottom sheet，compact list + event delegation。
4. **Bindings / Trash**：高风险写操作按 read → change → verify → metadata 流程实现；Soft Trash 优先。
5. **Lazy enhancements**：Entry count、Chat mapping、cache refresh；不能拖慢 Manager 首屏。

每个里程碑完成后再拆下一层模块。若一个文件只是转发另一个函数，没有形成独立边界，就不要创建它。
