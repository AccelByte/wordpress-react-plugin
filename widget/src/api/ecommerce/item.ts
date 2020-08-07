/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import networkManager from "../network";
import {guardNetworkCall} from "../networkCallTypeguard";
import {combineURLPaths} from "../../utils/urlHelper";
import {apiUrl, namespace} from "../../utils/env";
import {Item, ItemDecodeError} from "./models/item";

export function fetchItem(itemId: string, region?: string, language?: string) {
  const network = networkManager.create();
  return guardNetworkCall(
    () =>
      network.get(combineURLPaths(apiUrl, `platform/public/namespaces/${namespace}/items/${itemId}/locale`), {
        params: {
          region,
          language,
        },
      }),
    Item,
    ItemDecodeError,
    (error) => error
  );
}
