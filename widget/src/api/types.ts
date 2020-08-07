/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

export type UnionFromTuple<T> = T extends (infer U)[] ? U : never;
export const Enum = <T extends string[]>(...args: T) => {
  return Object.freeze(args.reduce((acc, next) => {
    return {
      ...acc,
      [next]: next,
    };
  }, Object.create(null)) as { [P in UnionFromTuple<typeof args>]: P });
};
export type Enum<T extends object> = T[keyof T];
export const isKeyOfEnum = <T extends object>(key: unknown, enumType: T): key is keyof T => {
  return !!Object.values(enumType).find((value) => value === key);
};
