/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
export const UserProfile = ioTs.intersection([
  ioTs.type({
    userId: ioTs.string,
    namespace: ioTs.string,
  }),
  ioTs.partial({
    firstName: ioTs.string,
    lastName: ioTs.string,
    avatarSmallUrl: ioTs.string,
    avatarUrl: ioTs.string,
    avatarLargeUrl: ioTs.string,
    language: ioTs.string,
    timeZone: ioTs.string,
    dateOfBirth: ioTs.string,
  }),
]);

export type UserProfile = ioTs.TypeOf<typeof UserProfile>;

export class UserProfileDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, UserProfileDecodeError.prototype);
  }
}
