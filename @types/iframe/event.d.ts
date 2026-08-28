/* Project-local minimal event declarations.
 *
 * worldbook_editor only needs the generic TavernHelper event surface. Keeping the
 * full upstream event-name table here adds thousands of unrelated declarations
 * and currently triggers credential-like false positives in automated Git review.
 * The maintainer's local Toolchain keeps the complete upstream reference copy.
 */

type EventType = string;
type ListenerType = Record<string, (...args: any[]) => any>;

type EventOnReturn = {
  stop: () => void;
};

declare function eventOn<T extends EventType>(event_type: T, listener: ListenerType[T]): EventOnReturn;
declare function eventMakeLast<T extends EventType>(event_type: T, listener: ListenerType[T]): EventOnReturn;
declare function eventMakeFirst<T extends EventType>(event_type: T, listener: ListenerType[T]): EventOnReturn;
declare function eventOnce<T extends EventType>(event_type: T, listener: ListenerType[T]): EventOnReturn;
declare function eventEmit<T extends EventType>(event_type: T, ...data: any[]): Promise<void>;
declare function eventEmitAndWait<T extends EventType>(event_type: T, ...data: any[]): Promise<void>;
declare function eventRemoveListener<T extends EventType>(event_type: T, listener: ListenerType[T]): void;
declare function eventClearEvent(event_type: EventType): void;
declare function eventClearListener(listener: (...args: any[]) => any): void;
declare function eventClearAll(): void;

declare const iframe_events: Record<string, string>;
declare const tavern_events: Record<string, string>;
