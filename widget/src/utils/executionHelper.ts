/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

export class ExecutionIgnorer {
  shouldIgnore: boolean;
  ignoreTime: number;

  constructor(ignoreTime = 100) {
    this.shouldIgnore = false;
    this.ignoreTime = ignoreTime;
  }

  execute(fun: Function) {
    if (!this.shouldIgnore) {
      this.ignore();
      fun();
    }
  }

  ignore() {
    this.shouldIgnore = true;
    new Promise(resolve => setTimeout(resolve, this.ignoreTime)).then(() => {
      this.shouldIgnore = false;
    });
  }
}

export class SingleExecutionLocker {
  isLocked: boolean;
  constructor() {
    this.isLocked = false;
  }
  lock() {
    if (this.isLocked) return false;
    this.isLocked = true;
    return true;
  }
  unlock() {
    this.isLocked = false;
  }
}

export interface AsyncExecutionQueueItem<T> {
  resolve: (resolvedValue?: T) => any;
  reject: (error: any) => any;
  fun: (...props: any[]) => T;
}

export class AsyncExecutionQueuer<T> {
  executionQueue: AsyncExecutionQueueItem<T>[] = [];
  maxQueue = 1;
  isRunning = false;
  constructor(maxQueue = 1) {
    this.maxQueue = maxQueue;
  }
  queue(fun: (...props: any[]) => T): Promise<T | void> {
    return new Promise((resolve, reject) => {
      this.executionQueue.unshift({
        resolve,
        reject,
        fun,
      });
      const ignoredExecution = this.executionQueue.splice(
        this.maxQueue,
        this.executionQueue.length
      );
      ignoredExecution.forEach(({ resolve }) => {
        resolve();
      });
    });
  }
  execute(fun: (...props: any[]) => T): Promise<T | void> {
    const promise = this.queue(fun);
    this.startLock();
    return promise;
  }
  startLock() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.runQueue();
  }
  async runQueue() {
    while (this.executionQueue.length > 0) {
      const {
        resolve,
        reject,
        fun,
      } = this.executionQueue.pop() as AsyncExecutionQueueItem<T>;
      try {
        resolve(await fun());
      } catch (e) {
        reject(e);
      }
    }
    this.isRunning = false;
  }
}

export class RepeatCommand extends Error {}

// eslint-disable-next-line consistent-return
export async function repeatOnCatchRepeatCommandAsync(asyncFun: Function) {
  let repeatFlag = true;
  while (repeatFlag) {
    repeatFlag = false;
    try {
      // eslint-disable-next-line no-await-in-loop
      return await asyncFun();
    } catch (possibleNetworkError) {
      if (possibleNetworkError instanceof RepeatCommand) {
        repeatFlag = true;
      } else {
        throw possibleNetworkError;
      }
    }
  }
}

export const sleepAsync = (timeInMs: number) =>
  new Promise(resolve => setTimeout(resolve, timeInMs));
