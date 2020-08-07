/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import {Item} from "../../../api/ecommerce/models/item";
import {getCreateOrderUrl} from "../../../utils/urlHelper";
import {RegionDataItemHelper} from "../../../api/ecommerce/helpers/regionDataItemHelper";
import {CurrencyMap} from "../../../api/ecommerce/models/currency";
import {CurrencyHelper} from "../../../api/ecommerce/helpers/currencyHelper";
import PurchaseButton from "./PurchaseButton";

export const PrimaryButton = (props: { item: Item; currencies: CurrencyMap; }) => {
  const { item, currencies } = props;
  const finalRegionData = RegionDataItemHelper.getFinalRegionDatum(item.regionData || []);
  if (!finalRegionData) return null;

  const isFree = RegionDataItemHelper.finalPriceIsFree(finalRegionData);
  const currency = currencies.get(finalRegionData.currencyCode);
  if (!currency) return null;

  return (
    <PurchaseButton
      text={isFree ? `Play For Free` : `Buy Now ${finalRegionData.currencyCode} ${CurrencyHelper.calculateIntegerPrice(RegionDataItemHelper.getFinalPrice(finalRegionData), currency)}`}
      onClickActionOrLink={getCreateOrderUrl(item.itemId, window.location.href)}
    />
  );
};

export const ErrorButton = (props: { onRetry: () => void }) => {
  return (
    <>
      <span className={"ab-wpr-purchase-error-message"}>Error Fetching Item Information</span>
      <PurchaseButton text={"Retry"} onClickActionOrLink={props.onRetry} />
    </>
  );
};

export const NotAvailableButton = () => {
  return (
    <PurchaseButton text={"This Item is Not Yet Available"} />
  );
};

export const OwnedItem = () => {
  return (
    <PurchaseButton text={"Item Already Owned"} />
  );
};
