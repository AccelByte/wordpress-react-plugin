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
  LogoutDecodeError,
  RefreshError,
  User,
  UserDecodeError,
} from "./models/user";
import { generateDeviceId, getDeviceType } from "../../utils/device";

export async function fetchCurrentUser(network: Network) {
  const url = combineURLPaths(apiUrl, `/iam/v3/public/users/me`);
  return guardNetworkCall(
    () => network.get(url),
    User,
    UserDecodeError,
    (error) => error
  );
}

export const authTokenExchangePath = "/iam/v3/oauth/token";
export const authTokenExchangeUrl = combineURLPaths(apiUrl, authTokenExchangePath);

export function loginWithAuthorizationCode(
  network: Network,
  {
    code,
    codeVerifier,
    redirectURI,
    clientId,
    recreate = false,
    url = authTokenExchangeUrl,
  }: { code: string; codeVerifier: string; redirectURI: string; clientId: string, recreate?: boolean, url?: string },
) {
  const data = new URLSearchParams();
  data.append("grant_type", "authorization_code");
  data.append("code", code);
  data.append("code_verifier", codeVerifier);
  data.append("client_id", clientId);
  data.append("redirect_uri", redirectURI);
  if(recreate) data.append("recreate", recreate.toString());

  return guardNetworkCall(
    () =>
      network.post(url, data, {
        headers: {
          "Device-Id": localStorage.getItem("deviceId") || generateDeviceId(),
          "Device-Name": (platform.name || "").toString(),
          "Device-Os": (platform.os || "").toString(),
          "Device-Type": getDeviceType(),
        },
      }),
    LoginSessionData,
    LoginSessionDataDecodeError,
    (error) => error
  );
}

export const refreshSessionPath = "/iam/v3/oauth/token";
export const refreshSessionUrl = combineURLPaths(apiUrl || "", "/iam/v3/oauth/token");

export async function refreshSession(
  network: Network,
  { refreshToken, clientId, 
    recreate = false, url = refreshSessionUrl }: { refreshToken?: string | null; clientId: string; recreate?: boolean; url?: string; }
) {
  const payload = new URLSearchParams();
  refreshToken && payload.append("refresh_token", refreshToken);
  payload.append("client_id", clientId);
  payload.append("grant_type", "refresh_token");
  if(recreate) payload.append("recreate", recreate.toString());

  return guardNetworkCall(
    () => network.post(url, payload),
    LoginSessionData,
    RefreshError,
    (error) => error
  );
}

export const logoutPath = "iam/v3/logout";
export const logoutUrl = combineURLPaths(apiUrl, logoutPath);
export async function logout(network: Network, url:string = logoutUrl) {
  return guardNetworkCall(
    () =>
      // Passing string as second argument triggers Axios
      // to set content-type to application/x-www-form-urlencoded
      network.post(url, ""),
    ioTs.string,
    LogoutDecodeError,
    (error) => error
  );
}
