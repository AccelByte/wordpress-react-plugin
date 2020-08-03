/*
 * Copyright (c) 2020. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";

export const geoLocation = ioTs.type({
  City: ioTs.string,
  CountryCode: ioTs.string,
  CountryName: ioTs.string,
  State: ioTs.string,
});

export type geoLocation = ioTs.TypeOf<typeof geoLocation>;

export class getLocationDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, getLocationDecodeError.prototype);
  }
}
