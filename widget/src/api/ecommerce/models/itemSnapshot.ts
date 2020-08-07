/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import {ItemImage} from "./itemImage";
import {ItemType} from "../../common/constants";
import {RegionDataItem} from "./item";

export const ItemSnapshot = ioTs.partial({
  thumbnailImage: ItemImage,
  itemType: ioTs.keyof(ItemType),
  itemId: ioTs.string,
  title: ioTs.string,
  regionDataItem: RegionDataItem,
});

export type ItemSnapshot = ioTs.TypeOf<typeof ItemSnapshot>;

export class ItemSnapshotDecodeError extends Error {}
