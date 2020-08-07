/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import { apiUrl } from "src/utils/env";
import { combineURLPaths } from "src/utils/urlHelper";
import { Network } from "../network";
import { guardNetworkCall } from "../networkCallTypeguard";
import platform from "platform";
import {
  LoginSessionData,
  LoginSessionDataDecodeError,
  LogoutDecodeError, RefreshError,
  User,
  UserDecodeError,
} from "./models/user";
import { generateDeviceId, getDeviceType } from "../../utils/device";

export async function fetchCurrentUser(network: Network) {
  const url = combineURLPaths(apiUrl, `/iam/v3/public/users/me`);
  return guardNetworkCall(() => network.get(url), User, UserDecodeError, (error) => error);
}

export const authTokenExchangeUrl = combineURLPaths(apiUrl, "/iam/v3/oauth/token");
export function loginWithAuthorizationCode(
  network: Network,
  {
    code,
    codeVerifier,
    redirectURI,
    clientId,
  }: { code: string; codeVerifier: string; redirectURI: string; clientId: string }
) {
  const data = new URLSearchParams();
  data.append("grant_type", "authorization_code");
  data.append("code", code);
  data.append("code_verifier", codeVerifier);
  data.append("client_id", clientId);
  data.append("redirect_uri", redirectURI);
  return guardNetworkCall(
    () => network.post(
      authTokenExchangeUrl, data, {
        headers: {
          "Device-Id": localStorage.getItem("deviceId") || generateDeviceId(),
          "Device-Name": (platform.name || "").toString(),
          "Device-Os": (platform.os || "").toString(),
          "Device-Type": getDeviceType(),
        }
      }),
    LoginSessionData,
    LoginSessionDataDecodeError,
    (error) => error
  );
}

export const refreshSessionUrl = combineURLPaths(apiUrl, "/v1/sessions/refresh");
export async function refreshSession(
  network: Network,
  { refreshId, clientId }: { refreshId: string; clientId: string }
) {
  const payload = new URLSearchParams();
  payload.append("refresh_id", refreshId);
  payload.append("client_id", clientId);
  return guardNetworkCall(
    () => network.post(refreshSessionUrl, payload),
    LoginSessionData,
    RefreshError,
    (error) => error
  );
}

export const logoutUrl = combineURLPaths(apiUrl, "v1/logout");
export async function logout(network: Network) {
  return guardNetworkCall(
    () =>
      // Passing string as second argument triggers Axios
      // to set content-type to application/x-www-form-urlencoded
      network.post(combineURLPaths(apiUrl, "v1/logout"), ""),
    ioTs.string,
    LogoutDecodeError,
    (error) => error
  );
}
