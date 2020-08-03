/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { apiUrl } from "src/utils/env";
import { combineURLPaths } from "src/utils/urlHelper";
import { Network } from "../network";
import { guardNetworkCall } from "../networkCallTypeguard";
import { UserProfile, UserProfileDecodeError } from "./models/profile";

export async function fetchUserProfile(network: Network, { namespace }: { namespace: string }) {
  const url = combineURLPaths(apiUrl, `basic/v1/public/namespaces/${namespace}/users/me/profiles`)
  return guardNetworkCall(
    () => network.get(url),
    UserProfile,
    UserProfileDecodeError,
    (error) => error
  );
}
