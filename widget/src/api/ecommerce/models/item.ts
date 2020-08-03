/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import {AppType, CurrencyType, EntitlementType, ItemStatus, ItemType} from "../../common/constants";
import {ItemImage} from "./itemImage";

export const RegionDataItem = ioTs.intersection([
  ioTs.type({
    price: ioTs.number,
    currencyNamespace: ioTs.string,
    currencyCode: ioTs.string,
    currencyType: ioTs.keyof(CurrencyType),
    discountedPrice: ioTs.number,
  }),
  ioTs.partial({
    discountPercentage: ioTs.number,
    discountAmount: ioTs.number,
    purchaseAt: ioTs.string,
    expireAt: ioTs.string,
    discountPurchaseAt: ioTs.string,
    discountExpireAt: ioTs.string,
  }),
]);
export type RegionDataItem = ioTs.TypeOf<typeof RegionDataItem>;

export const Item = ioTs.intersection([
  ioTs.type({
    itemId: ioTs.string,
    itemType: ioTs.keyof(ItemType),
  }),
  ioTs.partial({
    appId: ioTs.string,
    baseAppId: ioTs.string,
    appType: ioTs.keyof(AppType),
    namespace: ioTs.string,
    sku: ioTs.string,
    name: ioTs.string,
    title: ioTs.string,
    description: ioTs.string,
    longDescription: ioTs.string,
    entitlementType: ioTs.keyof(EntitlementType),
    useCount: ioTs.number,
    categoryPath: ioTs.string,
    status: ioTs.keyof(ItemStatus),
    targetCurrencyCode: ioTs.string,
    targetNamespace: ioTs.string,
    regionData: ioTs.array(RegionDataItem),
    itemIds: ioTs.array(ioTs.string),
    tags: ioTs.array(ioTs.string),
    maxCountPerUser: ioTs.number,
    maxCount: ioTs.number,
    clazz: ioTs.string,
    codeFiles: ioTs.array(ioTs.string),
    createdAt: ioTs.string,
    updatedAt: ioTs.string,
    images: ioTs.array(ItemImage),
  }),
]);
export type Item = ioTs.TypeOf<typeof Item>;

export class ItemDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, ItemDecodeError.prototype);
  }
}

export class ItemTypeNotSupported extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, ItemTypeNotSupported.prototype);
  }
}
