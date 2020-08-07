/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as DateFns from "date-fns";
import {Item, RegionDataItem} from "../models/item";
import {Currency} from "../models/currency";
import {CurrencyType} from "../../common/constants";

export class RegionDataItemHelper {
  static extractActiveRegionData(item: Item): RegionDataItem[] {
    const currentDate = new Date();
    return ((item.regionData || []) as RegionDataItem[]).filter((regionData) =>
      this.isPurchasable(regionData, currentDate)
    );
  }

  static isPurchasable(regionData: RegionDataItem, currentDate = new Date()) {
    return !this.isExpired(regionData, currentDate) && !this.isNotAvailableYet(regionData, currentDate);
  }

  static isDiscounted(regionData: RegionDataItem, currentDate = new Date()) {
    const {price, discountedPrice} = regionData;
    if (price === discountedPrice) {
      return false;
    }

    return !this.isDiscountExpired(regionData, currentDate) && !this.isDiscountNotAvailableYet(regionData, currentDate);
  }

  static isExpired(regionData: RegionDataItem, currentDate = new Date()) {
    if (regionData.expireAt === undefined) return false;
    return DateFns.isAfter(currentDate, new Date(regionData.expireAt));
  }

  static isNotAvailableYet(regionData: RegionDataItem, currentDate = new Date()) {
    if (regionData.purchaseAt === undefined) return false;
    return DateFns.isBefore(currentDate, new Date(regionData.purchaseAt));
  }

  static isDiscountExpirable(regionData: RegionDataItem) {
    return regionData.discountExpireAt !== undefined;
  }

  static isDiscountNotAvailableYet(regionData: RegionDataItem, currentDate = new Date()) {
    if (regionData.discountPurchaseAt === undefined) return false;
    return DateFns.isBefore(currentDate, new Date(regionData.discountPurchaseAt));
  }

  static isDiscountExpired(regionData: RegionDataItem, currentDate = new Date()) {
    if (regionData.discountExpireAt === undefined) return false;
    return DateFns.isAfter(currentDate, new Date(regionData.discountExpireAt));
  }

  static hasMatchingCurrencyInMap(regionData: RegionDataItem, currencyMap: Map<string, Currency>) {
    return !!currencyMap.get(regionData.currencyCode);
  }

  static calculateDiscountPercentage(regionData: RegionDataItem) {
    const price = regionData.price;
    const discountedPrice = regionData.discountedPrice;
    if (price === 0) {
      return 0;
    }
    return Math.floor(((price - discountedPrice) / price) * 100);
  }

  static isCurrencyTypeVirtual(regionData: RegionDataItem) {
    return regionData.currencyType === CurrencyType.VIRTUAL;
  }

  static getFinalPrice(regionData: RegionDataItem) {
    return this.isDiscounted(regionData) ? regionData.discountedPrice : regionData.price;
  }

  static finalPriceIsFree(regionData: RegionDataItem) {
    return this.getFinalPrice(regionData) <= 0;
  }

  static getFirstFreeRegionDatum(regionDataList: RegionDataItem[]): RegionDataItem | null {
    return regionDataList.find((regionData) => (
      this.isPurchasable(regionData) &&
      this.finalPriceIsFree(regionData))
    ) || null;
  }

  static getFirstNotFreeRegionDatum(regionDataList: RegionDataItem[]): RegionDataItem | null {
    return regionDataList.find((regionData) => (
      this.isPurchasable(regionData) &&
      !this.finalPriceIsFree(regionData))
    ) || null;
  }

  static getFinalRegionDatum(regionDataList: RegionDataItem[]): RegionDataItem | null {
    if (this.isFree(regionDataList)) {
      return this.getFirstFreeRegionDatum(regionDataList);
    } else {
      return this.getFirstNotFreeRegionDatum(regionDataList);
    }
  }

  static isFree(regionDataList: RegionDataItem[]) {
    return !!this.getFirstFreeRegionDatum(regionDataList);
  }
}
