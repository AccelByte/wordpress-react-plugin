/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import {isLeft} from "fp-ts/lib/Either";

const CodeChallengeStoredState = ioTs.type({
  csrf: ioTs.string,
  codeVerifier: ioTs.string,
});
type CodeChallengeStoredState = ioTs.TypeOf<typeof CodeChallengeStoredState>;

const CodeChallengeSentState = ioTs.type({
  csrf: ioTs.string,
  payload: ioTs.union([ioTs.string, ioTs.null]),
});
type CodeChallengeSentState = ioTs.TypeOf<typeof CodeChallengeSentState>;

export class CodeChallengeHelper {
  static stringifyStoredState(storedState: CodeChallengeStoredState) {
    return JSON.stringify(storedState);
  }

  static parseStoredState(
    stringifiedStoredState: string
  ):
    | {
        storedState: CodeChallengeStoredState;
        error: null;
      }
    | {
        storedState: null;
        error: Error;
      } {
    try {
      const parsed = JSON.parse(stringifiedStoredState);
      const decoded = CodeChallengeStoredState.decode(parsed);
      if (isLeft(decoded)) throw decoded.left;
      return {
        storedState: decoded.right,
        error: null,
      };
    } catch (error) {
      return { storedState: null, error };
    }
  }

  static stringifySentState(sentState: CodeChallengeSentState) {
    return JSON.stringify(sentState);
  }

  static parseSentState(
    stringifiedSentState: string
  ):
    | {
        sentState: CodeChallengeSentState;
        error: null;
      }
    | {
        sentState: null;
        error: Error;
      } {
    try {
      const parsed = JSON.parse(stringifiedSentState);
      const decoded = CodeChallengeSentState.decode(parsed);
      if (isLeft(decoded)) throw decoded.left;
      return {
        sentState: decoded.right,
        error: null,
      };
    } catch (error) {
      return { sentState: null, error };
    }
  }
}
