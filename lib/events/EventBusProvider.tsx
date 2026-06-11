// lib/events/EventBusProvider.tsx
'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { eventBus, generateEventId } from './bus';
import { HireAgentEvent, EventType } from './types';

interface EventBusContextValue {
  emit: (event: HireAgentEvent) => void;
  subscribe: (type: EventType, handler: (event: HireAgentEvent) => void) => () => void;
  getRecentEvents: (count?: number) => HireAgentEvent[];
}

const EventBusContext = createContext<EventBusContextValue | null>(null);

export function EventBusProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // In production, connect to WebSocket
    // For dev, use in-memory bus only
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const value: EventBusContextValue = {
    emit: (event) => eventBus.emit(event),
    subscribe: (type, handler) => eventBus.subscribe(type, handler),
    getRecentEvents: (count) => eventBus.getRecentEvents(count),
  };

  return (
    <EventBusContext.Provider value={value}>
      {children}
    </EventBusContext.Provider>
  );
}

export function useEventBus() {
  const ctx = useContext(EventBusContext);
  if (!ctx) throw new Error('useEventBus must be used within EventBusProvider');
  return ctx;
}
