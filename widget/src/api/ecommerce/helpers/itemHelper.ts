/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {ItemImage, ItemImageTag} from "../models/itemImage";
import {Item} from "../models/item";
import {ItemType} from "../../common/constants";

export class ItemHelper {
  static getBackgroundImage(itemImages: ItemImage[]): ItemImage | undefined {
    return itemImages.find((itemImages) => itemImages.as === ItemImageTag.largeButtonImg);
  }

  static getButtonBackgroundImage(itemImages: ItemImage[]): ItemImage | undefined {
    return itemImages.find((itemImages) => itemImages.as === ItemImageTag.largeButtonBgBtn);
  }

  static isItemTypeSupported(item: Item): boolean {
    const supportedItemType: (keyof typeof ItemType)[] = [
      ItemType.COINS,
      ItemType.APP,
      ItemType.CODE,
      ItemType.BUNDLE,
    ];
    return supportedItemType.includes(item.itemType);
  }
}
