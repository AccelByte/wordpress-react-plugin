/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {Item} from "../models/item";
import {Entitlement} from "../models/entitlements";
import {ItemStatus} from "../../common/constants";
import {RegionDataItemHelper} from "./regionDataItemHelper";

export class EcommerceHelper {
  static isItemPurchaseAble = (item: Item): boolean => {
    if (!RegionDataItemHelper.getFinalRegionDatum(item.regionData || [])) return false;
    return !(item.maxCountPerUser === 0 || item.maxCount === 0 || item.status !== ItemStatus.ACTIVE);
  };

  static isItemPurchaseAbleWithEntitlementCheck = (item: Item, entitlements: Entitlement[]): boolean => {
    if (!EcommerceHelper.isItemPurchaseAble(item) || !item.maxCountPerUser) return false;
    if (item.maxCountPerUser === -1) return true;
    return EcommerceHelper.getItemEntitlementCount(item.itemId, entitlements) < item.maxCountPerUser;
  };

  static getItemEntitlementCount = (itemId: string, entitlements: Entitlement[]): number => {
    return entitlements
      .filter((entitlement) => (
        entitlement.itemId === itemId
      )).length;
  };
}

