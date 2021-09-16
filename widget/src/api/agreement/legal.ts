/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { apiUrl } from "../../utils/env";
import { combineURLPaths } from "../../utils/urlHelper";
import { Network } from "../network";
import { guardNetworkCall } from "../networkCallTypeguard";
import { LegalEligibilities, LegalEligibilityDecodeError } from "./model/legal";

export async function fetchLegalEligibilities(network: Network, namespace: string) {
  return guardNetworkCall(
    () => network.get(combineURLPaths(apiUrl, `agreement/public/eligibilities/namespaces/${namespace}`)),
    LegalEligibilities,
    LegalEligibilityDecodeError,
    (error) => error
  );
}