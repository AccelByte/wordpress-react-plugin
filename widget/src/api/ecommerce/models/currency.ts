/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import {CurrencyType} from "../../common/constants";

export const Currency = ioTs.intersection([
  ioTs.type({
    currencyCode: ioTs.string,
    currencySymbol: ioTs.string,
    namespace: ioTs.string,
    currencyType: ioTs.keyof(CurrencyType),
    decimals: ioTs.number,
  }),
  ioTs.partial({
    maxAmountPerTransaction: ioTs.number,
    maxTransactionAmountPerDay: ioTs.number,
    maxBalanceAmount: ioTs.number,
    localizationDescriptions: ioTs.record(ioTs.string, ioTs.string),
  }),
]);
export type Currency = ioTs.TypeOf<typeof Currency>;

export type CurrencyMap = Map<string, Currency>;

export const CurrencyArray = ioTs.array(Currency);

export type CurrencyArray = ioTs.TypeOf<typeof CurrencyArray>;

export class CurrencyDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, CurrencyDecodeError.prototype);
  }
}
