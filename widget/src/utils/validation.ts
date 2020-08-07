/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

export function isValidUrl(url: string | undefined) {
  if (typeof url !== "string") return false;

  try {
    // will return either valid url or undefined
    new URL(url);
    return url;
  } catch (error) {}

  return false;
}
