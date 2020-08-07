/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {Network} from "../network";
import {guardNetworkCall} from "../networkCallTypeguard";
import {combineURLPaths} from "../../utils/urlHelper";
import {apiUrl, namespace} from "../../utils/env";
import {EntitlementDecodeError, PlatformEntitlementList} from "./models/entitlements";

export async function fetchEntitlement(network: Network, userId: string, params?: { itemId?: string }) {
  return guardNetworkCall(
    () =>
      network.get(combineURLPaths(apiUrl, `platform/public/namespaces/${namespace}/users/${userId}/entitlements`), {
        params: {
          ...params
        },
      }),
    PlatformEntitlementList,
    EntitlementDecodeError,
    (error) => error
  );
}

export async function fetchEntitlementsByItemId(network: Network, userId: string, itemId: string) {
  return fetchEntitlement(network, userId, { itemId });
}
