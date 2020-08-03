/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {Network} from "../network";
import { guardNetworkCall } from "../networkCallTypeguard";
import {combineURLPaths} from "../../utils/urlHelper";
import {apiUrl} from "../../utils/env";
import {PolicyResponse, PolicyResponseDecodeError, PolicyTypeEnum, TagsEnum} from "./model/policies";

interface FetchPoliciesByCountryCodeParam {
  namespace: string;
  countryCode: string;
  defaultOnEmpty: boolean;
  tags?: (keyof typeof TagsEnum)[];
  policyType?: keyof typeof PolicyTypeEnum;
}
export function fetchPoliciesByCountryCode(network: Network, { namespace, countryCode, defaultOnEmpty, tags, policyType }: FetchPoliciesByCountryCodeParam) {
  const url = combineURLPaths(apiUrl, `/agreement/public/policies/countries/${countryCode}`);

  const params: { defaultOnEmpty: boolean, policyType?: string, tags?: string } = { defaultOnEmpty, policyType };
  if (Array.isArray(tags) && tags.length > 0) {
    params.tags = tags.join(",");
  }

  return guardNetworkCall(
    () =>
      network.get(url, {
        params
      }),
    PolicyResponse,
    PolicyResponseDecodeError,
    (error) => error
  );
}
