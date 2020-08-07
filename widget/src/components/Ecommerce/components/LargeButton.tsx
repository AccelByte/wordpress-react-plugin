/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import {Item} from "../../../api/ecommerce/models/item";
import {RegionDataItemHelper} from "../../../api/ecommerce/helpers/regionDataItemHelper";
import {CurrencyMap} from "../../../api/ecommerce/models/currency";
import {getCreateOrderUrl} from "../../../utils/urlHelper";
import {CurrencyHelper} from "../../../api/ecommerce/helpers/currencyHelper";
import Thumbnail from "./Thumbnail";
import PurchaseButton from "./PurchaseButton";

export const PrimaryButton = (props: { item: Item; currencies: CurrencyMap; }) => {
  const { item, currencies } = props;
  const finalRegionData = RegionDataItemHelper.getFinalRegionDatum(item.regionData || []);
  if (!finalRegionData) return null;

  const isFree = RegionDataItemHelper.finalPriceIsFree(finalRegionData);
  const currency = currencies.get(finalRegionData.currencyCode);
  if (!currency) return null;

  return (
    <>
      <Thumbnail item={item} />
      <PurchaseButton
        item={item}
        text={isFree ? `Play For Free` : `Buy Now ${finalRegionData.currencyCode} ${CurrencyHelper.calculateIntegerPrice(RegionDataItemHelper.getFinalPrice(finalRegionData), currency)}`}
        onClickActionOrLink={getCreateOrderUrl(item.itemId, window.location.href)}
        style={"large"}
      />
    </>
  );
};

export const ErrorButton = (props: { onRetry: () => void; }) => {
  return (
    <>
      <Thumbnail item={null} />
      <PurchaseButton
        text={"Retry"}
        onClickActionOrLink={props.onRetry}
        style={"large"}
      />
    </>
  );
};

export const NotAvailableButton = ({ item }: { item: Item }) => {
  return (
    <>
      <Thumbnail item={item} />
      <PurchaseButton
        item={item}
        text={"This Item is Not Yet Available"}
        style={"large"}
      />
    </>
  );
};

export const OwnedItem = ({ item }: { item: Item }) => {
  return (
    <>
      <Thumbnail item={item} />
      <PurchaseButton
        item={item}
        text={"Item Already Owned"}
        style={"large"}
      />
    </>
  );
};
