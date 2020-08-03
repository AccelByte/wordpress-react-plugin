/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import {isLeft} from "fp-ts/lib/Either";

export const AuthorizationCodeExchangeState = ioTs.partial({
  path: ioTs.string,
});

export type AuthorizationCodeExchangeState = ioTs.TypeOf<typeof AuthorizationCodeExchangeState>;

export class AuthorizationCodeExchangeStateHelper {
  static fromPath(path: string): AuthorizationCodeExchangeState {
    return {path};
  }

  static toJSONString(state: AuthorizationCodeExchangeState) {
    return JSON.stringify(state);
  }

  static readJSONString(jsonString: string): AuthorizationCodeExchangeState | null {
    try {
      const decoded = AuthorizationCodeExchangeState.decode(JSON.parse(jsonString));
      if (isLeft(decoded)) throw new Error("Decode failed");
      return decoded.right;
    } catch (error) {
      return null;
    }
  }
}
