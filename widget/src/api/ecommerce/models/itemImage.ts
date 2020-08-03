/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import { isValidUrl } from "../../../utils/validation";

export const ItemImage = ioTs.partial({
  as: ioTs.string,
  caption: ioTs.string,
  height: ioTs.number,
  imageUrl: ioTs.string,
  smallImageUrl: ioTs.string,
  width: ioTs.number,
});

export type ItemImage = ioTs.TypeOf<typeof ItemImage>;

export class ItemImageHelper {
  static getFilteredImageUrlByTag(images: ItemImage[] | undefined, tag: string) {
    if (!images) return undefined;
    const filteredImage = images.find((image) => image.as === tag && !!isValidUrl(image.imageUrl));
    return filteredImage ? filteredImage.imageUrl : undefined;
  }
}

export const ItemImageTag = Object.freeze({
  largeButtonImg: "purchase-btn-img-area",
  largeButtonBgBtn: "purchase-btn-bg"
});

export class ItemImageDecodeError extends Error {}
