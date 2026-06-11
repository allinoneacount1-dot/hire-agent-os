// lib/events/bus.ts — Kafka-style Event Bus (in-memory for dev, WebSocket for prod)

import { HireAgentEvent, EventType } from './types';

type EventHandler = (event: HireAgentEvent) => void;

class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private eventLog: HireAgentEvent[] = [];
  private maxLogSize = 1000;

  subscribe(eventType: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  emit(event: HireAgentEvent): void {
    // Log event
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    // Notify handlers
    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      typeHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (err) {
          console.error(`EventBus handler error for ${event.type}:`, err);
        }
      });
    }

    // Also notify wildcard handlers
    const wildcardHandlers = this.handlers.get('*' as EventType);
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (err) {
          console.error(`EventBus wildcard handler error:`, err);
        }
      });
    }
  }

  getEventLog(): HireAgentEvent[] {
    return [...this.eventLog];
  }

  getRecentEvents(count: number = 10): HireAgentEvent[] {
    return this.eventLog.slice(-count);
  }

  clearLog(): void {
    this.eventLog = [];
  }
}

// Singleton
export const eventBus = new EventBus();

// Helper to generate event IDs
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
