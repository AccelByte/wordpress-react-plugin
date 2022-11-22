/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { apiUrl } from "src/utils/env";
import { combineURLPaths } from "src/utils/urlHelper";
import { Network } from "../network";
import { guardNetworkCall } from "../networkCallTypeguard";
import { UserProfile, UserProfileDecodeError, UserProfileAvatar } from "./models/profile"; // SA-558 The avatar in paydaythegame.com is not the same as in my account

export async function fetchUserProfile(network: Network, { namespace }: { namespace: string }) {
  const url = combineURLPaths(apiUrl, `basic/v1/public/namespaces/${namespace}/users/me/profiles`)
  return guardNetworkCall(
    () => network.get(url),
    UserProfile,
    UserProfileDecodeError,
    (error) => error
  );
}

// SA-558 The avatar in paydaythegame.com is not the same as in my account: start
export async function fetchUserProfileAvatar(network: Network, { namespace }: { namespace: string }) {
  const url = combineURLPaths(apiUrl, `bridge/v1/public/namespaces/${namespace}/users/me/profiles`)
  return guardNetworkCall(
    () => network.get(url),
    UserProfileAvatar,
    UserProfileDecodeError,
    (error) => error
  );
}
// SA-558 The avatar in paydaythegame.com is not the same as in my account: end
