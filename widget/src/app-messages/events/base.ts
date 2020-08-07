/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

export class BaseAppEvent<T> {
  listeners: Map<keyof T, Set<Function>> = new Map();
  private getEventListenerSet<K extends keyof T>(eventName: K) {
    let listeners = this.listeners.get(eventName);
    if (!listeners) {
      listeners = new Set();
      this.listeners.set(eventName, listeners);
    }
    return listeners;
  }
  emit<K extends keyof T>(eventName: K, payload: T[K]) {
    return Array.from(this.getEventListenerSet(eventName)).map((listener) => listener(payload));
  }
  subscribe<K extends keyof T>(eventName: K, listener: (payload: T[K]) => unknown) {
    this.getEventListenerSet(eventName).add(listener);
  }
  unsubscribe<K extends keyof T>(eventName: K, listener: (payload: T[K]) => unknown) {
    this.getEventListenerSet(eventName).delete(listener);
  }
  clear<K extends keyof T>(eventName: K): void {
    this.getEventListenerSet(eventName).clear();
  }
}
