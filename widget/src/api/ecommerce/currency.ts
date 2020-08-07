/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {apiUrl, namespace} from "../../utils/env";
import {combineURLPaths} from "../../utils/urlHelper";
import networkManager from "../network";
import { guardNetworkCall } from "../networkCallTypeguard";
import { CurrencyArray, CurrencyDecodeError } from "./models/currency";

export async function fetchCurrencies() {
  return guardNetworkCall(
    () => networkManager.create().get(combineURLPaths(apiUrl, `platform/public/namespaces/${namespace}/currencies`)),
    CurrencyArray,
    CurrencyDecodeError,
    (error) => error
  );
}
