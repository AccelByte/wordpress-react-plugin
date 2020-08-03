/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {Currency, CurrencyMap} from "../models/currency";

export class CurrencyHelper {
  /**
   * Get the price in decimal format by Currency.
   * @param  price    Integer price from a RegionDataItem
   * @param  currency Currency object
   * @return          a combination of price with decimals of a currency object
   * which describes how many ten to the power of negative decimals it should be
   * multiplied with
   */
  static calculateIntegerPrice(price: number, currency: Currency) {
    return price / 10 ** currency.decimals;
  }

  static currencyToMap(currencies: Currency[]): CurrencyMap {
    return currencies.reduce(
      (currencyMap: Map<string, Currency>, currency) => {
        currencyMap.set(currency.currencyCode, currency);
        return currencyMap;
      },
      new Map() as CurrencyMap
    )
  }
}
