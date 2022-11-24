/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {AppState} from "../app-state/createAppState";
import {loginAPI} from "../app-state/loginAPIInstance";
import {AuthorizationCodeExchangeStateHelper} from "../components/Auth/AuthorizationCodeExchangeStateHelper";
import {combineURLPaths} from "../utils/urlHelper";
import {playerPortalUrl, redirectURI} from "../utils/env"; // SA-569 Need adjust flow in paydaythegame to be same as PP

let initialExchangeAutorizationCodeDone = false;
export default async (appState: AppState) => {
  const {state: {userSession, appHistory}} = appState;

  if (initialExchangeAutorizationCodeDone || !!userSession.state.user) return;
  initialExchangeAutorizationCodeDone = true;

  const searchParams = new URLSearchParams(appHistory.location.search);
  const code = searchParams.get("code");
  // SA-569 Need adjust flow in paydaythegame to be same as PP: START
  const alreadyLinked = searchParams.get("alreadyLinked");
  const clientId = searchParams.get("clientId");
  const linkingToken = searchParams.get("linkingToken");
  const platformId = searchParams.get("platformId");
  if (alreadyLinked === "false" && linkingToken && platformId && clientId) {
    searchParams.append("redirect_uri", redirectURI);
    window.location.replace(combineURLPaths(playerPortalUrl, `link-account?${searchParams.toString()}`));
    return;
  }
  // SA-569 Need adjust flow in paydaythegame to be same as PP: END
  if (!code) return;

  const state = searchParams.get("state") || "";
  const {result, error} = loginAPI.matchReceivedState(state);
  if (error) {
    console.error(error);
    return;
  }
  if (!result) return;

  const {payload, codeVerifier} = result;

  await userSession.loginWithAuthorizationCode({
    code,
    codeVerifier,
  }).then(() => {
    if (userSession.currentUserNeedAdministration()) return;

    if (payload) {
      const statePayload = AuthorizationCodeExchangeStateHelper.readJSONString(payload);
      if (statePayload !== null) {
        const path = statePayload.path;
        if (path) {
          appHistory.replace(path);
          if (path !== "" && path !== "/") {
            window.location.href = path
          }
        }
        return;
      }
    }
    appHistory.replace("/");
  }).catch(() => {
    console.error(error);
    window.location.replace(combineURLPaths(playerPortalUrl, "error/500"));
  });
};
