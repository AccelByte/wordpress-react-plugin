/*
 * Copyright (c) 2020. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { apiUrl } from "src/utils/env";
import { combineURLPaths } from "src/utils/urlHelper";
import { Network } from "../network";
import { guardNetworkCall } from "../networkCallTypeguard";
import {geoLocation,getLocationDecodeError} from "./models/geoLocation";

export async function fetchGeoLocationInformation(network: Network) {
  const url = combineURLPaths(apiUrl, `/iam/v3/location/country`);
  return guardNetworkCall(() => network.get(url), geoLocation, getLocationDecodeError, (error) => error);
}
