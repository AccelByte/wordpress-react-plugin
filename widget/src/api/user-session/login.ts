/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as crypto from "crypto";
import { AuthorizationCodeExchangeStateHelper } from "src/components/Auth/AuthorizationCodeExchangeStateHelper";
import { apiUrl, clientId, redirectURI } from "src/utils/env";
import { combineURLPaths } from "src/utils/urlHelper";
import * as uuid from "uuid";
import { CodeChallengeHelper } from "./models/codeChallenge";

function base64URLEncode(code: Buffer) {
  return code
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

class CodeChallengeManager {
  static generateCodeChallenge(challengeMethod: "sha256") {
    const verifier = base64URLEncode(crypto.randomBytes(43));
    const challenge = base64URLEncode(
      crypto
        .createHash(challengeMethod)
        .update(verifier)
        .digest()
    );
    return { verifier, challenge };
  }

  static generateCodeCsrf(): string {
    return uuid.v4();
  }
}

interface LoginAPICodeChallengeStorageAccessor {
  saveCodeChallengeStoredState: (codeVerifier: string) => unknown;
  loadLastCodeChallengeStoredState: () => string | null;
  clearLastCodeChallengeStoredState: () => unknown;
}

export class LoginAPI implements LoginAPICodeChallengeStorageAccessor {
  clientId: string;
  redirectURI: string;
  saveCodeChallengeStoredState: (codeVerifier: string) => unknown;
  loadLastCodeChallengeStoredState: () => string | null;
  clearLastCodeChallengeStoredState: () => unknown;

  constructor({
    clientId,
    redirectURI,
    saveCodeChallengeStoredState,
    loadLastCodeChallengeStoredState,
    clearLastCodeChallengeStoredState,
  }: LoginAPICodeChallengeStorageAccessor & {
    clientId: string;
    redirectURI: string;
  }) {
    this.clientId = clientId;
    this.redirectURI = redirectURI;
    this.saveCodeChallengeStoredState = saveCodeChallengeStoredState;
    this.loadLastCodeChallengeStoredState = loadLastCodeChallengeStoredState;
    this.clearLastCodeChallengeStoredState = clearLastCodeChallengeStoredState;
  }

  matchReceivedState(maybeSentState: string) {
    const sentStateResult = CodeChallengeHelper.parseSentState(maybeSentState);
    if (sentStateResult.error) return { error: sentStateResult.error, result: null };

    const storedStateResult = CodeChallengeHelper.parseStoredState(this.loadLastCodeChallengeStoredState() || "");
    if (storedStateResult.error) return { error: storedStateResult.error, result: null };

    const sentState = sentStateResult.sentState;
    const storedState = storedStateResult.storedState;

    if (sentState.csrf !== storedState.csrf) return { error: null, result: null };
    return {
      error: null,
      result: {
        payload: sentState.payload,
        codeVerifier: storedState.codeVerifier,
      },
    };
  }

  createLoginWebsiteUrl( args: {payload: {}, targetAuthPage: string}): string {
    const { payload, targetAuthPage } = args;
    const { verifier, challenge } = CodeChallengeManager.generateCodeChallenge("sha256");
    const csrf = CodeChallengeManager.generateCodeCsrf();
    const storedState = {
      codeVerifier: verifier,
      csrf,
    };
    const sentState = {
      csrf,
      payload: AuthorizationCodeExchangeStateHelper.toJSONString(payload),
    };

    const searchParams = new URLSearchParams();
    searchParams.append("response_type", "code");
    searchParams.append("client_id", clientId);
    searchParams.append("redirect_uri", redirectURI);
    searchParams.append("state", CodeChallengeHelper.stringifySentState(sentState));
    searchParams.append("code_challenge", challenge);
    searchParams.append("code_challenge_method", "S256");
    searchParams.append("target_auth_page", targetAuthPage);

    this.saveCodeChallengeStoredState(CodeChallengeHelper.stringifyStoredState(storedState));
    const url = new URL(combineURLPaths(apiUrl, `/iam/v3/oauth/authorize?${searchParams.toString()}`));

    return url.toString();
  }
}  

