/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { clientId, redirectURI } from "src/utils/env";
import { LoginAPI } from "src/api/user-session/login";

const CODE_VERIFIER_LOCAL_STORAGE_KEY = "pp:pkce:cd";
export const loginAPI = new LoginAPI({
  saveCodeChallengeStoredState: (codeVerifier) => localStorage.setItem(CODE_VERIFIER_LOCAL_STORAGE_KEY, codeVerifier),
  loadLastCodeChallengeStoredState: () => localStorage.getItem(CODE_VERIFIER_LOCAL_STORAGE_KEY),
  clearLastCodeChallengeStoredState: () => localStorage.removeItem(CODE_VERIFIER_LOCAL_STORAGE_KEY),
  clientId,
  redirectURI,
});
