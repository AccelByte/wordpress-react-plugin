/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";

export const LoginSessionData = ioTs.type({
  expires_in: ioTs.number,
  access_token: ioTs.string,
  refresh_token: ioTs.string,
  is_comply: ioTs.boolean,
  refresh_expires_in: ioTs.number,
});
export type LoginSessionData = ioTs.TypeOf<typeof LoginSessionData>;

export class LoginSessionDataDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, LoginSessionDataDecodeError.prototype);
  }
}

export const UserBan = ioTs.type({
  ban: ioTs.string,
  banId: ioTs.string,
  endDate: ioTs.string,
});

export const ElligibleUser = ioTs.intersection([
  ioTs.type({
    userId: ioTs.string,
    emailVerified: ioTs.boolean,
    displayName: ioTs.string,
    country: ioTs.string,
    dateOfBirth: ioTs.string,
    emailAddress: ioTs.string,
    bans: ioTs.union([ioTs.null, ioTs.array(UserBan)]),
  }),
  ioTs.partial({
    newEmailAddress: ioTs.string,
    oldEmailAddress: ioTs.string,
    deletionStatus: ioTs.boolean,
  }),
]);

export const User = ElligibleUser;

export type User = ioTs.TypeOf<typeof User>;

export class UserDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, UserDecodeError.prototype);
  }
}

export class LogoutDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, LogoutDecodeError.prototype);
  }
}
export class RefreshError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, RefreshError.prototype);
  }
}

export const IAMError = ioTs.type({
  ErrorCode: ioTs.number,
  ErrorMessage: ioTs.string,
});

export type IAMError = ioTs.TypeOf<typeof IAMError>;

export const ServiceError = ioTs.type({
  errorCode: ioTs.number,
  errorMessage: ioTs.string,
});

export type ServiceError = ioTs.TypeOf<typeof ServiceError>;
